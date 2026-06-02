"use client";

import { useCallback, useState } from "react";

export function usePurchaseOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const list = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`/api/purchase-orders${qs ? `?${qs}` : ""}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load purchase orders");
      return data.purchaseOrders || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.errors?.join(", ") || data.error || "Create failed";
        throw new Error(msg);
      }
      return data.purchaseOrder;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, list, create };
}
