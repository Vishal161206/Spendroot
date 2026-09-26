// CSV Parsing and Validation Service for SpendRoot
import { autoCategorizeMerchant } from './intelligenceEngine';

export function parseCsvContent(csvText, existingTransactions = []) {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    return {
      success: false,
      error: "CSV file is empty or missing data rows.",
      records: [],
      stats: { total: 0, valid: 0, duplicate: 0, incomplete: 0 },
    };
  }

  // Parse header
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = lines.slice(1);

  const parsedRecords = [];
  let validCount = 0;
  let duplicateCount = 0;
  let incompleteCount = 0;

  rows.forEach((rowStr, index) => {
    // Handle comma separated values
    const cols = rowStr.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const merchant = cols[1] || cols[0] || "";
    const rawAmount = cols[3] || cols[2] || "0";
    const rawDate = cols[0] || "2026-09-20";
    const amount = parseFloat(rawAmount.replace(/[^0-9.-]/g, '')) || 0;

    let status = "Valid";
    let issue = null;

    // Validation 1: Amount must be greater than zero
    if (amount <= 0 || isNaN(amount)) {
      status = "Incomplete";
      issue = "Invalid or zero transaction amount";
      incompleteCount++;
    }
    // Validation 2: Date validity
    else if (!rawDate || isNaN(new Date(rawDate).getTime())) {
      status = "Incomplete";
      issue = "Missing or invalid date format";
      incompleteCount++;
    }
    // Validation 3: Duplicate check against existing transactions
    else {
      const isDuplicate = existingTransactions.some(t => 
        t.merchant.toLowerCase() === merchant.toLowerCase() &&
        Math.abs(t.amount - amount) < 0.01 &&
        t.date === rawDate
      );

      if (isDuplicate) {
        status = "Duplicate";
        issue = "Exact match exists in current ledger";
        duplicateCount++;
      } else {
        validCount++;
      }
    }

    // Auto categorize
    const { category, confidence } = autoCategorizeMerchant(merchant);

    parsedRecords.push({
      row: index + 1,
      merchant: merchant || "Unknown Merchant",
      amount,
      date: rawDate,
      detectedCategory: category,
      confidence,
      status,
      issue,
      paymentMode: "UPI",
    });
  });

  return {
    success: true,
    records: parsedRecords,
    stats: {
      total: parsedRecords.length,
      valid: validCount,
      duplicate: duplicateCount,
      incomplete: incompleteCount,
    }
  };
}
