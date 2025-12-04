"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker(): null {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const onLoad = async () => {
        try {
          const res = await fetch("/service-worker.js", {
            method: "HEAD",
            cache: "no-store",
          });
          if (res.ok) {
            await navigator.serviceWorker.register("/service-worker.js");
          }
        } catch {
          // swallow errors silently to avoid noisy logs in the client
        }
      };

      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
    return undefined;
  }, []);

  return null;
}
