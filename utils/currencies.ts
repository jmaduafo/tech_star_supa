import { Amount } from "@/types/types";

export function convertCurrency(labelValue: number) {
  let output = "";
  // Nine Zeroes for Billions
  if (Math.abs(Number(labelValue)) >= 1.0e9) {
    output += (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B";
  } else if (Math.abs(Number(labelValue)) >= 1.0e6) {
    output += (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M";
  } else if (Math.abs(Number(labelValue)) >= 1.0e3) {
    output += (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K";
  } else {
    output += Math.abs(Number(labelValue));
  }

  return output;
}

export function totalSum(arr: number[]) {
  let total = 0;

  arr.forEach((i) => {
    total = i + total;
  });

  return total;
}

export function formatCurrency(num: number, code: string) {
  if (num.toString().length < 16) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(num);
  }
}

export function upsertCurrency(
  list: Amount[],
  newCurrency: Pick<Amount, "code" | "name" | "symbol" | "amount">
): Amount[] {
  const idx = list.findIndex((c) => c.code === newCurrency.code);

  if (idx !== -1) {
    // Update existing — keep id, created_at, etc.
    const updated = {
      ...list[idx],
      ...newCurrency, // only overrides code, name, symbol, amount
    };
    return [...list.slice(0, idx), updated, ...list.slice(idx + 1)];
  }

  // Add new currency (no id yet, backend should generate)
  return [
    ...list,
    {
      id: crypto.randomUUID(), // placeholder until backend returns real id
      payment_id: "",
      created_at: new Date().toISOString(),
      updated_at: null,
      ...newCurrency,
    },
  ];
}
