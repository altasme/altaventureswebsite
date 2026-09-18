import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type LegalDoc = "privacy" | "terms" | "refund" | "fyb-refund" | "fyb-terms" | "fyb-privacy";

interface ModalContextValue {
  contactSection: string | null;
  contactPrefill: string | undefined;
  openContactModal: (section: string, prefillMessage?: string) => void;
  closeContactModal: () => void;

  caseStudyProject: string | null;
  openCaseStudy: (project: string) => void;
  closeCaseStudy: () => void;

  legalDoc: LegalDoc | null;
  openLegal: (doc: LegalDoc) => void;
  closeLegal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [contactSection, setContactSection] = useState<string | null>(null);
  const [contactPrefill, setContactPrefill] = useState<string | undefined>(undefined);
  const [caseStudyProject, setCaseStudyProject] = useState<string | null>(null);
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null);

  const openContactModal = useCallback((section: string, prefillMessage?: string) => {
    setContactSection(section);
    setContactPrefill(prefillMessage);
  }, []);
  const closeContactModal = useCallback(() => {
    setContactSection(null);
    setContactPrefill(undefined);
  }, []);

  const openCaseStudy = useCallback((project: string) => setCaseStudyProject(project), []);
  const closeCaseStudy = useCallback(() => setCaseStudyProject(null), []);

  const openLegal = useCallback((doc: LegalDoc) => setLegalDoc(doc), []);
  const closeLegal = useCallback(() => setLegalDoc(null), []);

  const value = useMemo(
    () => ({
      contactSection,
      contactPrefill,
      openContactModal,
      closeContactModal,
      caseStudyProject,
      openCaseStudy,
      closeCaseStudy,
      legalDoc,
      openLegal,
      closeLegal,
    }),
    [
      contactSection,
      contactPrefill,
      openContactModal,
      closeContactModal,
      caseStudyProject,
      openCaseStudy,
      closeCaseStudy,
      legalDoc,
      openLegal,
      closeLegal,
    ],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModals() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModals must be used within a ModalProvider");
  return ctx;
}
