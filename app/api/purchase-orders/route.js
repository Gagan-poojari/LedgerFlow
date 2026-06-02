import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionUser, unauthorizedResponse } from "@/lib/api-auth";
import PurchaseOrder from "@/models/PurchaseOrder";
import Vendor from "@/models/Vendor";
import { serializePurchaseOrder } from "@/lib/po-serialize";
import { validatePurchaseOrderPayload } from "@/lib/po-validation";

export async function GET(request) {
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);
    const poNumber = searchParams.get("poNumber")?.trim();
    const vendorId = searchParams.get("vendorId")?.trim();

    await connectDB();

    const filter = {};
    if (poNumber) filter.poNumber = poNumber;
    if (vendorId) filter.vendorId = vendorId;

    const orders = await PurchaseOrder.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("vendorId", "name vendorCode")
      .lean();

    return NextResponse.json({
      purchaseOrders: orders.map(serializePurchaseOrder),
    });
  } catch (error) {
    console.error("List PO error:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchase orders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const validation = validatePurchaseOrderPayload(body);

    if (validation.errors.length) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    await connectDB();

    const vendor = await Vendor.findById(body.vendorId).select("_id name");
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const po = await PurchaseOrder.create({
      poNumber: validation.poNumber,
      vendorId: vendor._id,
      lineItems: validation.lineItems,
      totalAmount: validation.totalAmount,
      status: "open",
      createdBy: user._id,
    });

    await po.populate("vendorId", "name vendorCode");

    return NextResponse.json(
      { purchaseOrder: serializePurchaseOrder(po) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create PO error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "PO number already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create purchase order" },
      { status: 500 }
    );
  }
}
