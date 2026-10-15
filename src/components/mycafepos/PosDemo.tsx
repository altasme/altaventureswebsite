import { useRef, useState } from "react";
import {
  CheckCircle2,
  Coffee,
  Cookie,
  Leaf,
  Minus,
  PackageX,
  Plus,
  Search,
  ShoppingBag,
  TrendingUp,
  X,
} from "lucide-react";
import { DEMO, DEMO_MENU, DEMO_ORDER_TYPES, DEMO_PAYMENT_METHODS } from "../../content/mycafepos";
import { track } from "../../lib/analytics";
import AccessButton from "./AccessButton";

type MenuItem = (typeof DEMO_MENU.items)[number];
type PaymentMethod = (typeof DEMO_PAYMENT_METHODS)[number];
type Step = "order" | "checkout" | "receipt";
type Selection = { group: string; option: string; deltaCentavos: number };

const MIN_SPLIT_WAYS = 2;
const MAX_SPLIT_WAYS = 5;

type CartLine = {
  lineId: string;
  productId: number;
  name: string;
  modifierLabel?: string;
  unitPriceCentavos: number;
  qty: number;
};

type SplitLine = { method: PaymentMethod; cashReceived: string; reference: string };

type ReceiptPayment = { method: PaymentMethod; amountCentavos: number; changeCentavos: number; reference?: string };

type ReceiptSnapshot = {
  no: string;
  time: string;
  orderType: (typeof DEMO_ORDER_TYPES)[number];
  lines: CartLine[];
  notes: string;
  subtotalCentavos: number;
  vatExemptCentavos: number;
  discountCentavos: number;
  totalCentavos: number;
  payments: ReceiptPayment[];
};

const CATEGORY_ICON: Record<string, typeof Coffee> = {
  Coffee: Coffee,
  "Non-Coffee": Leaf,
  Snacks: Cookie,
};

function money(centavos: number): string {
  return `₱${(centavos / 100).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function pesosToCentavos(pesos: string): number {
  return Math.round(Number(pesos || 0) * 100);
}

// Splits `totalCentavos` into `ways` shares as evenly as possible: any
// odd centavos left over after an even floor-division go to the first
// N shares, one each, so the shares always sum back to the exact total
// (never off by a centavo from rounding).
function splitShares(totalCentavos: number, ways: number): number[] {
  const base = Math.floor(totalCentavos / ways);
  const remainder = totalCentavos - base * ways;
  return Array.from({ length: ways }, (_, i) => base + (i < remainder ? 1 : 0));
}

function buildSplitLines(ways: number, totalCentavos: number, previous: SplitLine[]): SplitLine[] {
  const shares = splitShares(totalCentavos, ways);
  return shares.map((share, i) => ({
    method: previous[i]?.method ?? "Cash",
    cashReceived: (share / 100).toFixed(2),
    reference: previous[i]?.reference ?? "",
  }));
}

// A real, clickable simulation of MyCafe POS's order screen, scoped to what a
// visitor can safely play with on a marketing page but deliberately deep
// enough to show off more than just "tap, pay, done": multi-group modifiers
// (size + hot/iced), a live-depleting stock item, the SC/PWD statutory
// discount math, an even split-the-bill flow across cash/GCash/bank
// transfer, and a running "today's demo sales" tally. Modeled after the real
// app's PosView/ModifierDialog/CheckoutDialog/ReceiptPaper
// (mycafe-pos-system repo) but reimplemented here as a self-contained,
// client-only widget with sample data — no account, no backend, no real
// order or payment, ever.
export default function PosDemo() {
  const [step, setStep] = useState<Step>("order");
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [justAddedId, setJustAddedId] = useState<number | null>(null);
  const [justAddedLine, setJustAddedLine] = useState<string | null>(null);
  const [modifierItem, setModifierItem] = useState<MenuItem | null>(null);
  const [modifierChoices, setModifierChoices] = useState<Record<string, string>>({});
  const [orderType, setOrderType] = useState<(typeof DEMO_ORDER_TYPES)[number]>("Dine-in");
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [holderName, setHolderName] = useState("");
  const [holderId, setHolderId] = useState("");
  const [notes, setNotes] = useState("");

  const [splitWays, setSplitWays] = useState(1);
  const [splitLines, setSplitLines] = useState<SplitLine[]>([{ method: "Cash", cashReceived: "", reference: "" }]);

  const [receipt, setReceipt] = useState<ReceiptSnapshot | null>(null);
  const [salesTally, setSalesTally] = useState({ orders: 0, totalCentavos: 0 });
  const [stockSold, setStockSold] = useState<Record<number, number>>({});
  const hasPlayedRef = useRef(false);

  const categories = ["All", ...DEMO_MENU.categories];
  const visibleItems = DEMO_MENU.items.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const cartQtyFor = (productId: number) => cart.filter((l) => l.productId === productId).reduce((s, l) => s + l.qty, 0);
  const stockRemaining = (item: MenuItem): number | null =>
    "stock" in item && typeof item.stock === "number" ? item.stock - (stockSold[item.id] ?? 0) - cartQtyFor(item.id) : null;

  const subtotalCentavos = cart.reduce((sum, line) => sum + line.unitPriceCentavos * line.qty, 0);
  const vatExclusiveCentavos = discountEnabled ? Math.round(subtotalCentavos / 1.12) : subtotalCentavos;
  const vatExemptCentavos = discountEnabled ? subtotalCentavos - vatExclusiveCentavos : 0;
  const discountCentavos = discountEnabled ? Math.round(vatExclusiveCentavos * 0.2) : 0;
  const totalCentavos = subtotalCentavos - vatExemptCentavos - discountCentavos;

  const playedOnce = () => {
    if (!hasPlayedRef.current) {
      hasPlayedRef.current = true;
      track("mycafe_demo_play", {});
    }
  };

  const addLine = (item: MenuItem, selections: Selection[]) => {
    const remaining = stockRemaining(item);
    if (remaining !== null && remaining <= 0) return;
    playedOnce();
    const unitPrice = item.priceCentavos + selections.reduce((s, sel) => s + sel.deltaCentavos, 0);
    const modifierLabel = selections.length > 0 ? selections.map((s) => s.option).join(", ") : undefined;
    const key = `${item.id}:${selections.map((s) => s.option).join("|")}`;
    setCart((current) => {
      const found = current.find((l) => l.lineId === key);
      if (found) return current.map((l) => (l.lineId === key ? { ...l, qty: l.qty + 1 } : l));
      return [...current, { lineId: key, productId: item.id, name: item.name, modifierLabel, unitPriceCentavos: unitPrice, qty: 1 }];
    });
    setJustAddedId(item.id);
    setJustAddedLine(key);
    window.setTimeout(() => {
      setJustAddedId(null);
      setJustAddedLine(null);
    }, 500);
  };

  const selectItem = (item: MenuItem) => {
    if ("modifierGroups" in item && item.modifierGroups && item.modifierGroups.length > 0) {
      setModifierChoices(Object.fromEntries(item.modifierGroups.map((g) => [g.label, g.options[0].label])));
      setModifierItem(item);
    } else {
      addLine(item, []);
    }
  };

  const confirmModifier = () => {
    if (!modifierItem || !("modifierGroups" in modifierItem) || !modifierItem.modifierGroups) return;
    const selections: Selection[] = modifierItem.modifierGroups.map((g) => {
      const chosenLabel = modifierChoices[g.label] ?? g.options[0].label;
      const option = g.options.find((o) => o.label === chosenLabel) ?? g.options[0];
      return { group: g.label, option: option.label, deltaCentavos: option.deltaCentavos };
    });
    addLine(modifierItem, selections);
    setModifierItem(null);
  };

  const modifierPreviewCentavos = (): number => {
    if (!modifierItem || !("modifierGroups" in modifierItem) || !modifierItem.modifierGroups) return 0;
    let deltaSum = 0;
    for (const g of modifierItem.modifierGroups) {
      const chosenLabel = modifierChoices[g.label] ?? g.options[0].label;
      const option = g.options.find((o) => o.label === chosenLabel) ?? g.options[0];
      deltaSum += option.deltaCentavos;
    }
    return modifierItem.priceCentavos + deltaSum;
  };

  const updateQty = (lineId: string, delta: number) =>
    setCart((current) => current.flatMap((l) => (l.lineId === lineId ? (l.qty + delta > 0 ? [{ ...l, qty: l.qty + delta }] : []) : [l])));

  const goToCheckout = () => {
    setSplitWays(1);
    setSplitLines([{ method: "Cash", cashReceived: (totalCentavos / 100).toFixed(2), reference: "" }]);
    setStep("checkout");
  };

  const toggleSplit = () => {
    if (splitWays > 1) {
      setSplitWays(1);
      setSplitLines([{ method: "Cash", cashReceived: (totalCentavos / 100).toFixed(2), reference: "" }]);
    } else {
      setSplitWays(2);
      setSplitLines(buildSplitLines(2, totalCentavos, splitLines));
    }
  };

  const changeSplitWays = (delta: number) => {
    const next = Math.min(MAX_SPLIT_WAYS, Math.max(MIN_SPLIT_WAYS, splitWays + delta));
    setSplitWays(next);
    setSplitLines(buildSplitLines(next, totalCentavos, splitLines));
  };

  const updateSplitLine = (index: number, patch: Partial<SplitLine>) =>
    setSplitLines((current) => current.map((line, i) => (i === index ? { ...line, ...patch } : line)));

  const shares = splitShares(totalCentavos, splitWays);
  const lineChange = (line: SplitLine, shareCentavos: number) => (line.method === "Cash" ? Math.max(0, pesosToCentavos(line.cashReceived) - shareCentavos) : 0);
  const combinedChange = splitLines.reduce((sum, line, i) => sum + lineChange(line, shares[i] ?? 0), 0);

  const canConfirm = splitLines.every((line, i) => line.method !== "Cash" || pesosToCentavos(line.cashReceived) >= (shares[i] ?? 0));

  const confirmSale = () => {
    const payments: ReceiptPayment[] = splitLines.map((line, i) => ({
      method: line.method,
      amountCentavos: shares[i] ?? 0,
      changeCentavos: lineChange(line, shares[i] ?? 0),
      reference: line.reference.trim() || undefined,
    }));

    setReceipt({
      no: `DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      time: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }),
      orderType,
      lines: cart,
      notes: notes.trim(),
      subtotalCentavos,
      vatExemptCentavos,
      discountCentavos,
      totalCentavos,
      payments,
    });
    setStockSold((current) => {
      const next = { ...current };
      for (const line of cart) next[line.productId] = (next[line.productId] ?? 0) + line.qty;
      return next;
    });
    setSalesTally((current) => ({ orders: current.orders + 1, totalCentavos: current.totalCentavos + totalCentavos }));
    setCart([]);
    setStep("receipt");
  };

  const startNewOrder = () => {
    setCart([]);
    setCategory("All");
    setSearch("");
    setDiscountEnabled(false);
    setHolderName("");
    setHolderId("");
    setNotes("");
    setReceipt(null);
    setStep("order");
  };

  return (
    <div className="mcp-demo">
      <div className="mcp-demo-bar">
        <strong>MyCafe POS · Order</strong>
        <div className="mcp-demo-steps">
          {(["order", "checkout", "receipt"] as Step[]).map((s) => (
            <span key={s} data-active={step === s}>
              {s}
            </span>
          ))}
        </div>
      </div>
      {salesTally.orders > 0 && (
        <div className="mcp-demo-tally">
          <span>
            <TrendingUp size={14} aria-hidden="true" /> Today&apos;s demo sales
          </span>
          <strong>
            {salesTally.orders} order{salesTally.orders === 1 ? "" : "s"} · {money(salesTally.totalCentavos)}
          </strong>
        </div>
      )}

      <div className="mcp-demo-body" style={{ position: "relative" }}>
        {step === "order" && (
          <div className="mcp-demo-grid">
            <div>
              <div className="mcp-demo-search">
                <Search size={16} aria-hidden="true" />
                <input
                  className="mcp-demo-input mcp-demo-search-input"
                  placeholder="Search the menu"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search the demo menu"
                />
              </div>
              <div className="mcp-demo-categories">
                {categories.map((c) => (
                  <button key={c} type="button" className="mcp-demo-chip" data-active={category === c} onClick={() => setCategory(c)}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="mcp-demo-products">
                {visibleItems.map((item) => {
                  const Icon = CATEGORY_ICON[item.category] ?? Coffee;
                  const added = justAddedId === item.id;
                  const remaining = stockRemaining(item);
                  const soldOut = remaining !== null && remaining <= 0;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="mcp-demo-product"
                      data-added={added}
                      data-soldout={soldOut}
                      disabled={soldOut}
                      onClick={() => selectItem(item)}
                      aria-label={soldOut ? `${item.name}, sold out` : `Add ${item.name}, ${money(item.priceCentavos)}, to cart`}
                    >
                      <div className="mcp-demo-product-row">
                        <Icon size={16} aria-hidden="true" />
                        {soldOut ? null : added ? <Plus size={16} aria-hidden="true" className="mcp-demo-check-pop" /> : <Plus size={16} aria-hidden="true" />}
                      </div>
                      <strong>{item.name}</strong>
                      <span className="mcp-demo-price">{money(item.priceCentavos)}</span>
                      {remaining !== null && (
                        <span className="mcp-demo-stock" data-low={remaining <= 2 && remaining > 0} data-out={soldOut}>
                          {soldOut ? (
                            <>
                              <PackageX size={12} aria-hidden="true" /> Sold out
                            </>
                          ) : (
                            `${remaining} left`
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
                {visibleItems.length === 0 && <p className="mcp-muted text-sm">No items match "{search}".</p>}
              </div>
            </div>

            <div className="mcp-demo-cart">
              <div className="mcp-demo-cart-header">
                <strong>Current order</strong>
                {cart.length > 0 && (
                  <button type="button" className="mcp-btn--ghost text-xs font-bold" onClick={() => setCart([])}>
                    Clear
                  </button>
                )}
              </div>
              <div className="mcp-demo-toggle-row" style={{ margin: "0 1.1rem", gridTemplateColumns: `repeat(${DEMO_ORDER_TYPES.length}, 1fr)` }}>
                {DEMO_ORDER_TYPES.map((t) => (
                  <button key={t} type="button" className="mcp-demo-toggle-btn" data-active={orderType === t} onClick={() => setOrderType(t)}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="mcp-demo-cart-lines">
                {cart.length === 0 ? (
                  <div className="mcp-demo-empty">
                    <ShoppingBag size={28} aria-hidden="true" style={{ margin: "0 auto .5rem" }} />
                    <p className="font-semibold">The order is empty</p>
                    <p className="mcp-muted text-xs">Tap a menu item to begin.</p>
                  </div>
                ) : (
                  cart.map((line) => (
                    <div key={line.lineId} className="mcp-demo-cart-line" data-flash={justAddedLine === line.lineId}>
                      <div>
                        <strong className="block text-sm">{line.name}</strong>
                        {line.modifierLabel && <span className="mcp-muted text-xs">{line.modifierLabel} · </span>}
                        <span className="mcp-muted text-xs">{money(line.unitPriceCentavos)} each</span>
                      </div>
                      <div className="mcp-demo-qty">
                        <button type="button" aria-label={`Remove one ${line.name}`} onClick={() => updateQty(line.lineId, -1)}>
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <span className="w-4 text-center text-sm font-bold">{line.qty}</span>
                        <button type="button" aria-label={`Add one more ${line.name}`} onClick={() => updateQty(line.lineId, 1)}>
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mcp-demo-cart-footer">
                <button type="button" className="mcp-demo-dashed-btn" onClick={() => setDiscountEnabled((v) => !v)}>
                  <span>{discountEnabled ? "SC/PWD discount applied" : "Add SC/PWD discount"}</span>
                  {discountEnabled ? <CheckCircle2 size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                </button>
                {discountEnabled && (
                  <div className="mt-2 grid gap-2">
                    <input className="mcp-demo-input" placeholder="ID number (optional)" value={holderId} onChange={(e) => setHolderId(e.target.value)} />
                    <input className="mcp-demo-input" placeholder="Holder name (optional)" value={holderName} onChange={(e) => setHolderName(e.target.value)} />
                  </div>
                )}
                <div className="mt-2">
                  <div className="mcp-demo-line-row">
                    <span>Subtotal</span>
                    <span>{money(subtotalCentavos)}</span>
                  </div>
                  {discountEnabled && (
                    <>
                      <div className="mcp-demo-line-row">
                        <span>VAT exemption (est.)</span>
                        <span>−{money(vatExemptCentavos)}</span>
                      </div>
                      <div className="mcp-demo-line-row" style={{ color: "var(--mcp-accent)" }}>
                        <span>Statutory discount (est.)</span>
                        <span>−{money(discountCentavos)}</span>
                      </div>
                    </>
                  )}
                  <div className="mcp-demo-total-row">
                    <span>Total</span>
                    <span>{money(totalCentavos)}</span>
                  </div>
                </div>
                <button type="button" className="mcp-btn w-full" disabled={cart.length === 0} onClick={goToCheckout}>
                  Pay {money(totalCentavos)}
                </button>
                <textarea
                  className="mcp-demo-textarea"
                  placeholder="Add an order note for the barista…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={140}
                />
              </div>
            </div>
          </div>
        )}

        {modifierItem && "modifierGroups" in modifierItem && modifierItem.modifierGroups && (
          <div className="mcp-demo-overlay">
            <div className="mcp-demo-overlay-card">
              <div className="mcp-demo-cart-header">
                <strong>{modifierItem.name}</strong>
                <button type="button" className="mcp-btn--ghost" aria-label="Cancel" onClick={() => setModifierItem(null)}>
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="mcp-demo-size-list">
                {modifierItem.modifierGroups.map((group) => (
                  <div key={group.label}>
                    <span className="mcp-demo-modgroup-label">{group.label}</span>
                    <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${group.options.length}, 1fr)` }}>
                      {group.options.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          className="mcp-demo-toggle-btn"
                          data-active={(modifierChoices[group.label] ?? group.options[0].label) === opt.label}
                          onClick={() => setModifierChoices((c) => ({ ...c, [group.label]: opt.label }))}
                        >
                          {opt.label}
                          {opt.deltaCentavos > 0 && <small className="mcp-muted"> +{money(opt.deltaCentavos)}</small>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button type="button" className="mcp-btn w-full" onClick={confirmModifier}>
                  Add to Order, {money(modifierPreviewCentavos())}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "checkout" && (
          <div className="mcp-demo-cart" style={{ maxWidth: "28rem", margin: "0 auto" }}>
            <div className="mcp-demo-cart-header">
              <strong>Record payment</strong>
            </div>
            <div className="mcp-demo-cart-footer">
              <div className="mcp-demo-total-row">
                <span>Amount due</span>
                <span>{money(totalCentavos)}</span>
              </div>

              <button type="button" className="mcp-demo-dashed-btn" onClick={toggleSplit}>
                <span>Split the bill</span>
                {splitWays > 1 ? <CheckCircle2 size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
              </button>

              {splitWays > 1 && (
                <div className="mcp-demo-split-header">
                  <span>Split {splitWays} ways</span>
                  <div className="mcp-demo-stepper">
                    <button type="button" aria-label="Fewer ways" onClick={() => changeSplitWays(-1)} disabled={splitWays <= MIN_SPLIT_WAYS}>
                      <Minus size={14} aria-hidden="true" />
                    </button>
                    <button type="button" aria-label="More ways" onClick={() => changeSplitWays(1)} disabled={splitWays >= MAX_SPLIT_WAYS}>
                      <Plus size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-3 grid gap-4">
                {splitLines.map((line, i) => (
                  <div key={i} className={splitWays > 1 ? "mcp-demo-split-block" : ""}>
                    {splitWays > 1 && (
                      <span className="mcp-demo-split-label">
                        Payment {i + 1} of {splitWays} · {money(shares[i] ?? 0)}
                      </span>
                    )}
                    <div className="mcp-demo-toggle-row" style={{ gridTemplateColumns: `repeat(${DEMO_PAYMENT_METHODS.length}, 1fr)` }}>
                      {DEMO_PAYMENT_METHODS.map((m) => (
                        <button key={m} type="button" className="mcp-demo-toggle-btn" data-active={line.method === m} onClick={() => updateSplitLine(i, { method: m })}>
                          {m}
                        </button>
                      ))}
                    </div>
                    {line.method === "Cash" && (
                      <div className="mt-3">
                        <label className="text-sm font-bold" htmlFor={`mcp-demo-cash-${i}`}>
                          Cash received
                        </label>
                        <input
                          id={`mcp-demo-cash-${i}`}
                          className="mcp-demo-input"
                          inputMode="decimal"
                          value={line.cashReceived}
                          onChange={(e) => updateSplitLine(i, { cashReceived: e.target.value })}
                        />
                        <div className="mcp-demo-total-row" style={{ fontSize: "1rem" }}>
                          <span>Change</span>
                          <span>{money(lineChange(line, shares[i] ?? 0))}</span>
                        </div>
                      </div>
                    )}
                    {line.method === "GCash" && <p className="mcp-muted mt-3 text-xs">Simulated GCash payment. No real transaction is sent.</p>}
                    {line.method === "Bank Transfer" && (
                      <div className="mt-3">
                        <label className="text-sm font-bold" htmlFor={`mcp-demo-ref-${i}`}>
                          Reference (optional)
                        </label>
                        <input
                          id={`mcp-demo-ref-${i}`}
                          className="mcp-demo-input"
                          placeholder="Enter transfer reference"
                          value={line.reference}
                          onChange={(e) => updateSplitLine(i, { reference: e.target.value })}
                        />
                        <p className="mcp-muted mt-2 text-xs">Simulated bank transfer. No real transaction is sent.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {splitWays > 1 && combinedChange > 0 && (
                <div className="mcp-demo-line-row mt-2">
                  <span>Combined change</span>
                  <span>{money(combinedChange)}</span>
                </div>
              )}

              <div className="mt-5 flex gap-2">
                <button type="button" className="mcp-btn--ghost mcp-btn--sm" onClick={() => setStep("order")}>
                  Back
                </button>
                <button type="button" className="mcp-btn flex-1" disabled={!canConfirm} onClick={confirmSale}>
                  Confirm &amp; Complete Sale
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "receipt" && receipt && (
          <div>
            <div className="mcp-demo-success" aria-hidden="true">
              <span className="mcp-demo-success-ring" />
              <CheckCircle2 size={40} className="mcp-demo-success-check" />
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="mcp-demo-confetti-dot"
                  style={
                    {
                      "--dx": `${Math.cos((i / 6) * Math.PI * 2) * 46}px`,
                      "--dy": `${Math.sin((i / 6) * Math.PI * 2) * 46}px`,
                      "--rot": `${i * 47}deg`,
                      background: i % 2 === 0 ? "var(--mcp-accent)" : "var(--mcp-primary)",
                      animationDelay: `${i * 40}ms`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
            <div className="mcp-demo-receipt">
              <div className="mcp-demo-receipt-head">
                <strong>MyCafe (Demo Café)</strong>
                <div className="mcp-demo-receipt-marker">
                  <strong className="block">ORDER ACKNOWLEDGEMENT</strong>
                  <span className="text-[11px] font-bold">NOT AN OFFICIAL RECEIPT · DEMO</span>
                </div>
              </div>
              <div className="mcp-demo-receipt-line">
                <span>
                  No. <strong>{receipt.no}</strong>
                </span>
                <span>{receipt.time}</span>
              </div>
              <div className="mcp-demo-receipt-line mcp-muted">
                <span>{receipt.orderType}</span>
                {receipt.notes && <span>Note: {receipt.notes}</span>}
              </div>
              <div className="mt-3">
                {receipt.lines.map((line) => (
                  <div key={line.lineId} className="mcp-demo-receipt-line">
                    <span>
                      {line.qty}× {line.name}
                      {line.modifierLabel && <small className="mcp-muted"> ({line.modifierLabel})</small>}
                    </span>
                    <span>{money(line.unitPriceCentavos * line.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="mcp-demo-receipt-marker" style={{ borderBottom: "none" }}>
                <div className="mcp-demo-receipt-line">
                  <span>Subtotal</span>
                  <span>{money(receipt.subtotalCentavos)}</span>
                </div>
                {receipt.discountCentavos > 0 && (
                  <div className="mcp-demo-receipt-line">
                    <span>SC/PWD VAT exemption + discount</span>
                    <span>−{money(receipt.vatExemptCentavos + receipt.discountCentavos)}</span>
                  </div>
                )}
                <div className="mcp-demo-receipt-line" style={{ fontWeight: 800, fontSize: "1rem" }}>
                  <span>Total</span>
                  <span>{money(receipt.totalCentavos)}</span>
                </div>
                {receipt.payments.map((p, i) => (
                  <div key={i} className="mcp-demo-receipt-line">
                    <span>
                      Payment{receipt.payments.length > 1 ? ` ${i + 1}` : ""}
                      {p.reference && <small className="mcp-muted"> (Ref: {p.reference})</small>}
                    </span>
                    <span>
                      {p.method}
                      {receipt.payments.length > 1 ? ` · ${money(p.amountCentavos)}` : ""}
                    </span>
                  </div>
                ))}
                {receipt.payments.reduce((s, p) => s + p.changeCentavos, 0) > 0 && (
                  <div className="mcp-demo-receipt-line">
                    <span>Change</span>
                    <span>{money(receipt.payments.reduce((s, p) => s + p.changeCentavos, 0))}</span>
                  </div>
                )}
              </div>
              <p className="mcp-muted mt-4 text-center text-[11px]">
                Thank you for trying the demo. This is a sample order, and no real payment or record was created.
              </p>
            </div>
            <div className="mt-6 text-center">
              <p className="mcp-muted mb-3 text-sm">{DEMO.receiptCta}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button type="button" className="mcp-btn mcp-btn--secondary" onClick={startNewOrder}>
                  Start a New Order
                </button>
                <AccessButton label={DEMO.cta} location="demo_receipt" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
