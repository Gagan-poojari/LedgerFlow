export function serializePurchaseOrder(doc) {
  const p = doc.toObject ? doc.toObject() : doc;
  const vendorRef = p.vendorId;

  return {
    id: p._id?.toString(),
    poNumber: p.poNumber,
    vendorId:
      vendorRef && typeof vendorRef === "object"
        ? vendorRef._id?.toString()
        : vendorRef?.toString?.() || vendorRef,
    vendor:
      vendorRef && typeof vendorRef === "object"
        ? {
            id: vendorRef._id?.toString(),
            name: vendorRef.name,
            vendorCode: vendorRef.vendorCode,
          }
        : undefined,
    lineItems: (p.lineItems || []).map((line) => ({
      id: line._id?.toString(),
      description: line.description,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      amount: line.amount,
      hsnCode: line.hsnCode,
      taxRate: line.taxRate,
    })),
    totalAmount: p.totalAmount,
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}
