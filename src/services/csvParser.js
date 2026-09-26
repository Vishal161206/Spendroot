// CSV Parsing and Validation Service for SpendRoot
import { autoCategorizeMerchant } from './intelligenceEngine';

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

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

  // Parse header and map column indices by name
  const headerCols = parseCsvLine(lines[0]).map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
  const rows = lines.slice(1);

  const dateIdx = headerCols.findIndex(h => h.includes('date') || h.includes('time'));
  const merchantIdx = headerCols.findIndex(h => h.includes('merchant') || h.includes('desc') || h.includes('payee') || h.includes('vendor') || h.includes('title') || h === 'name');
  const amountIdx = headerCols.findIndex(h => h.includes('amount') || h.includes('value') || h.includes('price') || h.includes('inr') || h.includes('debit'));
  const categoryIdx = headerCols.findIndex(h => h.includes('category'));
  const modeIdx = headerCols.findIndex(h => h.includes('mode') || h.includes('method'));

  const getCol = (cols, namedIdx, positionalIdx) => {
    if (namedIdx !== -1 && cols[namedIdx] !== undefined) return cols[namedIdx];
    if (positionalIdx !== -1 && cols[positionalIdx] !== undefined) return cols[positionalIdx];
    return "";
  };

  const parsedRecords = [];
  let validCount = 0;
  let duplicateCount = 0;
  let incompleteCount = 0;

  rows.forEach((rowStr, index) => {
    const cols = parseCsvLine(rowStr);
    const rawDate = getCol(cols, dateIdx, 0) || "2026-09-20";
    const merchant = getCol(cols, merchantIdx, 1) || "Unknown Merchant";
    const rawAmount = getCol(cols, amountIdx, 3) || getCol(cols, -1, 2) || "0";
    const rawCategory = getCol(cols, categoryIdx, -1);
    const rawMode = getCol(cols, modeIdx, -1) || "UPI";

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
        (t.merchant || '').toLowerCase() === merchant.toLowerCase() &&
        Math.abs(Number(t.amount) - amount) < 0.01 &&
        ((t.date && t.date.slice(0, 10) === rawDate.slice(0, 10)) ||
         (t.transaction_date && String(t.transaction_date).slice(0, 10) === rawDate.slice(0, 10)))
      );

      if (isDuplicate) {
        status = "Duplicate";
        issue = "Exact match exists in current ledger";
        duplicateCount++;
      } else {
        validCount++;
      }
    }

    // Auto categorize or use CSV category
    const autoCat = autoCategorizeMerchant(merchant);
    const category = rawCategory || autoCat.category;
    const confidence = rawCategory ? 1.0 : autoCat.confidence;

    parsedRecords.push({
      row: index + 1,
      merchant: merchant || "Unknown Merchant",
      amount,
      date: rawDate,
      detectedCategory: category,
      confidence,
      status,
      issue,
      paymentMode: rawMode,
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
