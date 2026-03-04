"use client";

import { useEffect } from "react";

export function ProposalViewTracker({ proposalId }: { proposalId: string }) {
  useEffect(() => {
    const startTime = Date.now();

    // Record the view
    fetch(`/api/v1/public/proposals/${proposalId}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_agent: navigator.userAgent,
      }),
    }).catch(() => {
      // Silently fail - analytics shouldn't break the page
    });

    // Record duration on page leave
    function handleUnload() {
      const duration = Math.round((Date.now() - startTime) / 1000);
      navigator.sendBeacon(
        `/api/v1/public/proposals/${proposalId}/view`,
        JSON.stringify({ duration, update: true })
      );
    }

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [proposalId]);

  return null;
}
