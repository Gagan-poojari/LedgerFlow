export function normalizePoLineItems(lineItems) {
  if (!Array.isArray(lineItems)) return [];

  return lineItems
    .map((line) => {
      const quantity = Number(line.quantity);
      const unitPrice = Number(line.unitPrice);
      const qty = Number.isFinite(quantity) && quantity >= 0 ? quantity : 0;
      const price = Number.isFinite(unitPrice) && unitPrice >= 0 ? unitPrice : 0;
      const amount =
        line.amount != null && Number.isFinite(Number(line.amount))
          ? Number(line.amount)
          : qty * price;

      return {
        description: line.description?.trim() || "",
        quantity: qty,
        unitPrice: price,
        amount: Math.round(amount * 100) / 100,
        hsnCode: line.hsnCode?.trim() || undefined,
        taxRate: line.taxRate != null ? Number(line.taxRate) : undefined,
      };
    })
    .filter((line) => line.description);
}

export function validatePurchaseOrderPayload(payload) {
  const errors = [];
  const poNumber = payload.poNumber?.trim();

  if (!poNumber) errors.push("PO number is required");
  if (!payload.vendorId) errors.push("Vendor is required");

  const lineItems = normalizePoLineItems(payload.lineItems);
  if (lineItems.length === 0) {
    errors.push("Add at least one line item with a description");
  }

  for (const [i, line] of lineItems.entries()) {
    if (line.quantity <= 0) {
      errors.push(`Line ${i + 1}: quantity must be greater than zero`);
    }
    if (line.unitPrice < 0) {
      errors.push(`Line ${i + 1}: unit price cannot be negative`);
    }
  }

  const computedTotal = lineItems.reduce((sum, l) => sum + l.amount, 0);
  const totalAmount =
    payload.totalAmount != null && payload.totalAmount !== ""
      ? Number(payload.totalAmount)
      : computedTotal;

  if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
    errors.push("Total amount must be greater than zero");
  }

  if (
    lineItems.length > 0 &&
    Math.abs(computedTotal - totalAmount) > 1 &&
    Math.abs(computedTotal - totalAmount) / totalAmount > 0.01
  ) {
    errors.push(
      `Total (${totalAmount.toFixed(2)}) does not match line items (${computedTotal.toFixed(2)})`
    );
  }

  return {
    errors,
    poNumber,
    lineItems,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}
