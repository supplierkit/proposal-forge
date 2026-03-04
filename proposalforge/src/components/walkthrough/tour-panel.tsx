"use client";

import { useTour } from "./tour-provider";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, RotateCcw } from "lucide-react";
import { SupplierKitIcon } from "@/components/ui/supplierkit-logo";

export function TourPanel() {
  const { currentStep, currentStepIndex, steps, isActive, nextStep, prevStep, endTour, startTour } =
    useTour();

  // Show restart button when tour is dismissed
  if (!isActive) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={startTour}
          size="sm"
          variant="outline"
          className="shadow-lg bg-white border-[#eee] text-[#444] hover:text-[#111] gap-2"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Restart Tour
        </Button>
      </div>
    );
  }

  if (!currentStep) return null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
      <div className="rounded-xl border border-[#e0e0e0] bg-white shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-[#f0f0f0]">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <SupplierKitIcon className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-medium text-[#888]">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
            <button
              onClick={endTour}
              className="text-[#aaa] hover:text-[#666] transition-colors cursor-pointer"
              aria-label="Close tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <h3 className="text-[16px] font-semibold text-[#111] mb-1.5">
            {currentStep.title}
          </h3>
          <p className="text-[14px] leading-relaxed text-[#444]">
            {currentStep.description}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f0f0f0]">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              disabled={isFirst}
              className="gap-1 text-[#666]"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button size="sm" onClick={nextStep} className="gap-1">
              {isLast ? "Finish" : currentStep.action ? "Go there" : "Next"}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
