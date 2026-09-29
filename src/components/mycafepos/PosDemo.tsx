import { useRef, useState } from "react";
import { Check, Coffee, Cookie, Leaf, Minus, Plus, ShoppingBag } from "lucide-react";
import { DEMO_MENU, DEMO_PAYMENT_METHODS } from "../../content/mycafepos";
import { track } from "../../lib/analytics";

type CartLine = { id: number; name: string; priceCentavos: number; qty: number };
type Step = "order" | "checkout" | "receipt";

const CATEGORY_ICON: Record<string, typeof Coffee> = {
  Coffee: Coffee,
  "Non-Coffee": Leaf,
  Snacks: Cookie,
};

function money(centavos: number): string {
  return `₱${(centavos / 100).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// A real, clickable simulation of MyCafe POS's order-taking screen, scoped to
// exactly what a visitor can safely play with on a marketing page: select an
// item, adjust the cart, pick a payment method, and see a receipt. Modeled
// after the actual app's PosView/CheckoutDialog/ReceiptPaper (mycafe-pos-system
// repo) but reimplemented here as a self-contained, client-only widget with
// sample data — no account, no backend, no real order or payment, ever.
export default function PosDemo() {
  const [step, setStep] = useState<Step>("order");
  const [category, setCategory] = useState<string>("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [justAddedId, setJustAddedId] = useState<number | null>(null);
  const [method, setMethod] = useState<(typeof DEMO_PAYMENT_METHODS)[number]>("Cash");
  const [cashReceived, setCashReceived] = useState("");
  const hasPlayedRef = useRef(false);
  const receiptNoRef = useRef<string>("");
  const receiptTimeRef = useRef<string>("");

  const categories = ["All", ...DEMO_MENU.categories];
  const visibleItems = DEMO_MENU.items.filter((item) => category === "All" || item.category === category);

  const subtotalCentavos = cart.reduce((sum, line) => sum + line.priceCentavos * line.qty, 0);
  const receivedCentavos = Math.round(Number(cashReceived || 0) * 100);
  const changeCentavos = Math.max(0, receivedCentavos - subtotalCentavos);
  const canConfirm = method === "GCash" || receivedCentavos >= subtotalCentavos;

  const addToCart = (item: (typeof DEMO_MENU.items)[number]) => {
    if (!hasPlayedRef.current) {
      hasPlayedRef.current = true;
      track("mycafe_demo_play", {});
    }
    setCart((current) => {
      const found = current.find((line) => line.id === item.id);
      if (found) return current.map((line) => (line.id === item.id ? { ...line, qty: line.qty + 1 } : line));
      return [...current, { id: item.id, name: item.name, priceCentavos: item.priceCentavos, qty: 1 }];
    });
    setJustAddedId(item.id);
    window.setTimeout(() => setJustAddedId(null), 400);
  };

  const updateQty = (id: number, delta: number) =>
    setCart((current) =>
      current.flatMap((line) => (line.id === id ? (line.qty + delta > 0 ? [{ ...line, qty: line.qty + delta }] : []) : [line])),
    );

  const goToCheckout = () => {
    setMethod("Cash");
    setCashReceived((subtotalCentavos / 100).toFixed(2));
    setStep("checkout");
  };

  const confirmSale = () => {
    receiptNoRef.current = `DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
    receiptTimeRef.current = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
    setStep("receipt");
  };

  const startNewOrder = () => {
    setCart([]);
    setCategory("All");
    setCashReceived("");
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

      <div className="mcp-demo-body">
        {step === "order" && (
          <div className="mcp-demo-grid">
            <div>
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
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="mcp-demo-product"
                      data-added={added}
                      onClick={() => addToCart(item)}
                      aria-label={`Add ${item.name}, ${money(item.priceCentavos)}, to cart`}
                    >
                      <div className="mcp-demo-product-row">
                        <Icon size={16} aria-hidden="true" />
                        {added ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                      </div>
                      <strong>{item.name}</strong>
                      <span className="mcp-demo-price">{money(item.priceCentavos)}</span>
                    </button>
                  );
                })}
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
              <div className="mcp-demo-cart-lines">
                {cart.length === 0 ? (
                  <div className="mcp-demo-empty">
                    <ShoppingBag size={28} aria-hidden="true" style={{ margin: "0 auto .5rem" }} />
                    <p className="font-semibold">The order is empty</p>
                    <p className="mcp-muted text-xs">Tap a menu item to begin.</p>
                  </div>
                ) : (
                  cart.map((line) => (
                    <div key={line.id} className="mcp-demo-cart-line">
                      <div>
                        <strong className="block text-sm">{line.name}</strong>
                        <span className="mcp-muted text-xs">{money(line.priceCentavos)} each</span>
                      </div>
                      <div className="mcp-demo-qty">
                        <button type="button" aria-label={`Remove one ${line.name}`} onClick={() => updateQty(line.id, -1)}>
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <span className="w-4 text-center text-sm font-bold">{line.qty}</span>
                        <button type="button" aria-label={`Add one more ${line.name}`} onClick={() => updateQty(line.id, 1)}>
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mcp-demo-cart-footer">
                <div className="mcp-demo-total-row">
                  <span>Total</span>
                  <span>{money(subtotalCentavos)}</span>
                </div>
                <button type="button" className="mcp-btn w-full" disabled={cart.length === 0} onClick={goToCheckout}>
                  Pay {money(subtotalCentavos)}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "checkout" && (
          <div className="mcp-demo-cart" style={{ maxWidth: "26rem", margin: "0 auto" }}>
            <div className="mcp-demo-cart-header">
              <strong>Record payment</strong>
            </div>
            <div className="mcp-demo-cart-footer">
              <div className="mcp-demo-total-row">
                <span>Amount due</span>
                <span>{money(subtotalCentavos)}</span>
              </div>
              <div className="mcp-demo-methods">
                {DEMO_PAYMENT_METHODS.map((m) => (
                  <button key={m} type="button" className="mcp-demo-method" data-active={method === m} onClick={() => setMethod(m)}>
                    {m}
                  </button>
                ))}
              </div>
              {method === "Cash" && (
                <div className="mt-4">
                  <label className="text-sm font-bold" htmlFor="mcp-demo-cash">
                    Cash received
                  </label>
                  <input
                    id="mcp-demo-cash"
                    className="mcp-demo-input"
                    inputMode="decimal"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                  />
                  <div className="mcp-demo-total-row" style={{ fontSize: "1rem" }}>
                    <span>Change</span>
                    <span>{money(changeCentavos)}</span>
                  </div>
                </div>
              )}
              {method === "GCash" && <p className="mcp-muted mt-4 text-xs">Simulated GCash payment — no real transaction is sent.</p>}
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

        {step === "receipt" && (
          <div>
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
                  No. <strong>{receiptNoRef.current}</strong>
                </span>
                <span>{receiptTimeRef.current}</span>
              </div>
              <div className="mt-3">
                {cart.map((line) => (
                  <div key={line.id} className="mcp-demo-receipt-line">
                    <span>
                      {line.qty}× {line.name}
                    </span>
                    <span>{money(line.priceCentavos * line.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="mcp-demo-receipt-marker" style={{ borderBottom: "none" }}>
                <div className="mcp-demo-receipt-line" style={{ fontWeight: 800, fontSize: "1rem" }}>
                  <span>Total</span>
                  <span>{money(subtotalCentavos)}</span>
                </div>
                <div className="mcp-demo-receipt-line">
                  <span>Payment</span>
                  <span>{method}</span>
                </div>
                {method === "Cash" && changeCentavos > 0 && (
                  <div className="mcp-demo-receipt-line">
                    <span>Change</span>
                    <span>{money(changeCentavos)}</span>
                  </div>
                )}
              </div>
              <p className="mcp-muted mt-4 text-center text-[11px]">
                Thank you for trying the demo. This is a sample order — no real payment or record was created.
              </p>
            </div>
            <div className="mt-6 text-center">
              <button type="button" className="mcp-btn" onClick={startNewOrder}>
                Start a New Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
