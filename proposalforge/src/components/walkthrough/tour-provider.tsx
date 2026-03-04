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
      "Here's the Grand Hotel Berlin — a 5-star property with 350 rooms, 4 room types, and 3 function spaces. Click on it to see the full details.",
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
      "Here's your pipeline — from new inquiries to won deals. Toggle between Board and List views. Click the \"European Tech Summit\" lead to see the details.",
    action: "/dashboard/leads/demo-lead-002",
  },
  {
    id: "lead-detail",
    page: "/dashboard/leads/demo-lead-002",
    title: "Generate an AI proposal",
    description:
      "This is where the magic happens. Review the event details, then click \"Generate AI Proposal\" to create a professional proposal in seconds. (In this demo, the button is shown but requires an API key to function.)",
  },
  {
    id: "proposals-nav",
    page: "/dashboard/leads/demo-lead-002",
    title: "Check your proposals",
    description:
      "Click \"Proposals\" in the sidebar to see all generated proposals and their statuses.",
    action: "/dashboard/proposals",
  },
  {
    id: "proposals-overview",
    page: "/dashboard/proposals",
    title: "Track every proposal",
    description:
      "See the status of each proposal — Draft, Sent, Viewed, Accepted, or Declined. Click the ACME Corp proposal to see the full details.",
    action: "/dashboard/proposals/demo-proposal-001",
  },
  {
    id: "proposal-detail",
    page: "/dashboard/proposals/demo-proposal-001",
    title: "Send, preview, and track",
    description:
      "From here you can send the proposal via email, preview the interactive client-facing page, copy the share link, and track when clients view it. The ACME proposal was viewed 3 times before being accepted.",
  },
  {
    id: "analytics-nav",
    page: "/dashboard/proposals/demo-proposal-001",
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
  {
    id: "complete",
    page: "/dashboard/analytics",
    title: "Tour complete!",
    description:
      "You've seen the full SupplierKit workflow: manage properties, capture leads, generate AI proposals, send & track them, and analyze performance. Ready to get started?",
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
