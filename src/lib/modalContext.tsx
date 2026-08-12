import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { ProjectId } from "../content/site";

type LegalDoc = "privacy" | "terms";

interface ModalContextValue {
  contactSection: string | null;
  openContactModal: (section: string) => void;
  closeContactModal: () => void;

  caseStudyProject: ProjectId | null;
  openCaseStudy: (project: ProjectId) => void;
  closeCaseStudy: () => void;

  legalDoc: LegalDoc | null;
  openLegal: (doc: LegalDoc) => void;
  closeLegal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [contactSection, setContactSection] = useState<string | null>(null);
  const [caseStudyProject, setCaseStudyProject] = useState<ProjectId | null>(null);
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null);

  const openContactModal = useCallback((section: string) => setContactSection(section), []);
  const closeContactModal = useCallback(() => setContactSection(null), []);

  const openCaseStudy = useCallback((project: ProjectId) => setCaseStudyProject(project), []);
  const closeCaseStudy = useCallback(() => setCaseStudyProject(null), []);

  const openLegal = useCallback((doc: LegalDoc) => setLegalDoc(doc), []);
  const closeLegal = useCallback(() => setLegalDoc(null), []);

  const value = useMemo(
    () => ({
      contactSection,
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
