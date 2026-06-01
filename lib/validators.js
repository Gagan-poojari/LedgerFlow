const GSTIN_FORMAT =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_FORMAT = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function normalizeGstin(value) {
  return value?.trim().toUpperCase() || "";
}

export function normalizePan(value) {
  return value?.trim().toUpperCase() || "";
}

/** GSTN mod-36 check digit for the first 14 characters (official RTL algorithm). */
export function computeGstinCheckDigit(gstin14) {
  const base = normalizeGstin(gstin14).slice(0, 14);
  if (base.length !== 14) return null;

  let factor = 2;
  let sum = 0;
  for (let i = 13; i >= 0; i--) {
    const code = CHARSET.indexOf(base[i]);
    if (code < 0) return null;
    let digit = factor * code;
    factor = factor === 2 ? 1 : 2;
    digit = Math.floor(digit / 36) + (digit % 36);
    sum += digit;
  }

  const checkCode = (36 - (sum % 36)) % 36;
  return CHARSET[checkCode];
}

export function validateGSTIN(gstin) {
  const g = normalizeGstin(gstin);
  if (!g) return { valid: false, error: "GSTIN is required" };
  if (!GSTIN_FORMAT.test(g)) {
    return { valid: false, error: "GSTIN format is invalid (15 characters)" };
  }

  const expected = computeGstinCheckDigit(g);
  if (!expected) {
    return { valid: false, error: "GSTIN contains invalid characters" };
  }
  if (expected !== g[14]) {
    return {
      valid: false,
      error: `GSTIN checksum is invalid (expected "${expected}", got "${g[14]}")`,
    };
  }

  return { valid: true, value: g };
}

export function validatePAN(pan) {
  const p = normalizePan(pan);
  if (!p) return { valid: true, value: null };
  if (!PAN_FORMAT.test(p)) {
    return { valid: false, error: "PAN format is invalid (e.g. ABCDE1234F)" };
  }
  return { valid: true, value: p };
}

export function validateAmounts({ subtotal, tax, total }, options = {}) {
  const tolerance = options.tolerance ?? 1;
  const errors = [];
  const warnings = [];

  const nums = { subtotal, tax, total };
  for (const [key, val] of Object.entries(nums)) {
    if (val == null || val === "") continue;
    if (typeof val !== "number" || val < 0 || !Number.isFinite(val)) {
      errors.push(`${key} must be a non-negative number`);
    }
  }

  if (errors.length) return { errors, warnings };

  if (total != null && total <= 0) {
    errors.push("Total amount must be greater than zero");
  }

  if (
    subtotal != null &&
    tax != null &&
    total != null &&
    Number.isFinite(subtotal) &&
    Number.isFinite(tax) &&
    Number.isFinite(total)
  ) {
    const expected = subtotal + tax;
    const diff = Math.abs(expected - total);
    if (diff > tolerance && diff / total > 0.01) {
      warnings.push(
        `Total (${total}) does not match subtotal + tax (${expected.toFixed(2)})`
      );
    }
  }

  if (subtotal != null && total != null && tax == null && subtotal > total) {
    warnings.push("Subtotal exceeds total - verify tax and line items");
  }

  return { errors, warnings };
}

export function validateMandatoryFields(invoice) {
  const errors = [];
  const { invoiceNumber, extractedData, vendorId } = invoice;

  if (!invoiceNumber?.trim()) {
    errors.push("Invoice number is required");
  }
  if (!vendorId) {
    errors.push("Vendor link is required");
  }
  if (!extractedData?.invoiceDate) {
    errors.push("Invoice date is required");
  }
  if (extractedData?.total == null || extractedData.total <= 0) {
    errors.push("Total amount is required and must be greater than zero");
  }

  return errors;
}
