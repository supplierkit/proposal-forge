"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export interface TourStep {
  id: string;
  page: string; // pathname the step lives on
  title: string;
  description: string;
  target?: string; // CSS selector to highlight
  action?: string; // what the user should click
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    page: "/dashboard",
    title: "Welcome to SupplierKit",
    description:
      "This is your command center. The dashboard shows your properties, active leads, proposals sent, and revenue won at a glance.",
  },
  {
    id: "properties",
    page: "/dashboard",
    title: "Let's explore your properties",
    description:
      "Click \"Properties\" in the sidebar to see your hotel portfolio. We've set up the Grand Hotel Berlin for you.",
    action: "/dashboard/properties",
  },
  {
    id: "property-detail",
    page: "/dashboard/properties",
    title: "Your hotel property",
    description:
      "Here's the Grand Hotel Berlin \u2014 a 5-star property with 350 rooms, 4 room types, and 3 function spaces. Click on it to see the full details.",
    action: "/dashboard/properties/demo-property-001",
  },
  {
    id: "leads-nav",
    page: "/dashboard/properties/demo-property-001",
    title: "Now let's see your sales pipeline",
    description:
      "Click \"Leads\" in the sidebar to view your group booking inquiries. You have 5 active leads at different stages.",
    action: "/dashboard/leads",
  },
  {
    id: "leads-overview",
    page: "/dashboard/leads",
    title: "Your lead pipeline",
    description:
      "Here's your pipeline \u2014 from new inquiries to won deals. Toggle between Board and List views. Click the \"European Tech Summit\" lead to see the details.",
    action: "/dashboard/leads/demo-lead-002",
  },
  {
    id: "lead-detail",
    page: "/dashboard/leads/demo-lead-002",
    title: "Generate an AI proposal",
    description:
      "This is where Kit works its magic. Click \"Generate AI Proposal\" and Kit analyzes the lead requirements \u2014 350 attendees, keynote hall, exhibition space, networking dinner \u2014 and creates a tailored proposal in seconds. Kit has already generated one for this event. Let's go see it.",
    action: "/dashboard/proposals",
  },
  {
    id: "proposals-overview",
    page: "/dashboard/proposals",
    title: "Kit's generated proposals",
    description:
      "Here are all proposals Kit has generated. Notice the \"European Tech Summit 2026\" proposal \u2014 Kit created it from the lead we just viewed. It's been sent to Marcus Weber and already viewed. Click it to review the full proposal.",
    action: "/dashboard/proposals/demo-proposal-002",
  },
  {
    id: "proposal-detail",
    page: "/dashboard/proposals/demo-proposal-002",
    title: "Review Kit's proposal",
    description:
      "Kit generated a complete proposal: 600 room nights, Grand Ballroom for the keynote, Garden Terrace for the exhibition, full catering, and a \u20AC72,000 investment summary. You can send it, preview the client-facing page, or copy the share link.",
  },
  {
    id: "analytics-nav",
    page: "/dashboard/proposals/demo-proposal-002",
    title: "View your analytics",
    description:
      "Click \"Analytics\" in the sidebar to see performance metrics across your pipeline.",
    action: "/dashboard/analytics",
  },
  {
    id: "analytics",
    page: "/dashboard/analytics",
    title: "Performance at a glance",
    description:
      "Track proposals sent, win rates, response times, and pipeline stages. Use these insights to improve your conversion.",
  },
  // Configure section steps
  {
    id: "configure-nav",
    page: "/dashboard/analytics",
    title: "Configure your workflow",
    description:
      "Click \"Configure\" in the sidebar to set up integrations, templates, and automated actions.",
    action: "/dashboard/configure",
  },
  {
    id: "configure-integrations",
    page: "/dashboard/configure",
    title: "Integrations",
    description:
      "This is where SupplierKit connects to your existing systems. Inbound integrations (PMS, website forms, ITB API) feed lead data in. Outbound integrations (email, CRM) push generated proposals out. Kit runs autonomously between them.",
  },
  {
    id: "configure-templates",
    page: "/dashboard/configure",
    title: "Templates",
    description:
      "Define what Kit's proposals look like \u2014 brand settings, default sections, pricing guidance, and inclusions. Kit follows these rules when generating every proposal, so output is always on-brand and on-policy.",
  },
  {
    id: "configure-kit-actions",
    page: "/dashboard/configure",
    title: "Kit Actions",
    description:
      "Control what Kit does automatically: confirm details with submitters, flag out-of-policy proposals, send follow-up nudges, and keep communication warm. Toggle each action on or off.",
  },
  {
    id: "complete",
    page: "/dashboard/configure",
    title: "Tour complete!",
    description:
      "You've seen the full SupplierKit workflow: manage properties, capture leads, let Kit generate and send proposals, track performance, and configure integrations and automations. Ready to get started?",
  },
];

interface TourContextValue {
  steps: TourStep[];
  currentStepIndex: number;
  currentStep: TourStep | null;
  isActive: boolean;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}

const STORAGE_KEY = "proposalforge_tour";

export function TourProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isActive, setIsActive] = useState(false);

  // On mount, check if tour should auto-start
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored === "dismissed") return;
    // Auto-start tour on first visit
    if (!stored) {
      setIsActive(true);
      setCurrentStepIndex(0);
    } else {
      const idx = parseInt(stored, 10);
      if (!isNaN(idx) && idx >= 0 && idx < TOUR_STEPS.length) {
        setIsActive(true);
        setCurrentStepIndex(idx);
      }
    }
  }, []);

  // Persist step
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isActive && currentStepIndex >= 0) {
      localStorage.setItem(STORAGE_KEY, String(currentStepIndex));
    }
  }, [isActive, currentStepIndex]);

  const startTour = useCallback(() => {
    setIsActive(true);
    setCurrentStepIndex(0);
    localStorage.setItem(STORAGE_KEY, "0");
    router.push("/dashboard");
  }, [router]);

  const endTour = useCallback(() => {
    setIsActive(false);
    setCurrentStepIndex(-1);
    localStorage.setItem(STORAGE_KEY, "dismissed");
  }, []);

  const nextStep = useCallback(() => {
    const next = currentStepIndex + 1;
    if (next >= TOUR_STEPS.length) {
      endTour();
      return;
    }
    const step = TOUR_STEPS[currentStepIndex];
    // If current step has an action (navigation), go there
    if (step?.action) {
      router.push(step.action);
    }
    setCurrentStepIndex(next);
  }, [currentStepIndex, endTour, router]);

  const prevStep = useCallback(() => {
    const prev = currentStepIndex - 1;
    if (prev < 0) return;
    const step = TOUR_STEPS[prev];
    if (step?.page && step.page !== pathname) {
      router.push(step.page);
    }
    setCurrentStepIndex(prev);
  }, [currentStepIndex, pathname, router]);

  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= TOUR_STEPS.length) return;
      const step = TOUR_STEPS[index];
      if (step.page !== pathname) {
        router.push(step.page);
      }
      setCurrentStepIndex(index);
      setIsActive(true);
    },
    [pathname, router]
  );

  const currentStep = isActive && currentStepIndex >= 0 ? TOUR_STEPS[currentStepIndex] : null;

  return (
    <TourContext.Provider
      value={{
        steps: TOUR_STEPS,
        currentStepIndex,
        currentStep,
        isActive,
        startTour,
        endTour,
        nextStep,
        prevStep,
        goToStep,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}
