import { Amount } from "@/types/types";

export function convertCurrency(labelValue: number) {
  let output = "";

  // Nine Zeroes for Billions

  // IF LENGTH IS 6 OR MORE, INCLUDING "." (ex. 290.78), CHANGE TO
  // 1 DECIMAL PLACE INSTEAD
  if (Math.abs(Number(labelValue)) >= 1.0e9) {
    if ((Math.abs(Number(labelValue)) / 1.0e9).toFixed(2).length >= 6) {
      output += (Math.abs(Number(labelValue)) / 1.0e9).toFixed(1) + "B";
    } else {
      output += (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B";
    }
  } else if (Math.abs(Number(labelValue)) >= 1.0e6) {
    if ((Math.abs(Number(labelValue)) / 1.0e6).toFixed(2).length >= 6) {
      output += (Math.abs(Number(labelValue)) / 1.0e6).toFixed(1) + "M";
    } else {
      output += (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M";
    }
  } else if (Math.abs(Number(labelValue)) >= 1.0e3) {
    if ((Math.abs(Number(labelValue)) / 1.0e3).toFixed(2).length >= 6) {
      output += (Math.abs(Number(labelValue)) / 1.0e3).toFixed(1) + "K";
    } else {
      output += (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K";
    }
  } else if (Math.abs(Number(labelValue)).toFixed(2).length >= 6) {
    output += Math.abs(Number(labelValue)).toFixed(2);
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
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
  }).format(num);
}

// FOR ONE ITEM
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

type EditableCurrency = Pick<Amount, "code" | "name" | "symbol" | "amount">;

// FOR AN ARRAY OF ITEMS
export function upsertCurrencies(
  list: Amount[],
  newCurrencies: EditableCurrency[]
): Amount[] {
  let result = [...list];

  newCurrencies.forEach((newCurrency) => {
    const idx = result.findIndex((c) => c.code === newCurrency.code);

    if (idx !== -1) {
      // update existing — preserve id, created_at, etc.
      result[idx] = {
        ...result[idx],
        ...newCurrency,
      };
    } else {
      // insert new — leave id/payment_id empty so Supabase can fill in
      result.push({
        id: crypto.randomUUID(), // temp id until backend responds
        payment_id: "",
        created_at: new Date().toISOString(),
        updated_at: null,
        ...newCurrency,
      });
    }
  });

  return result;
}

export function getPercentChange(current: number, prev: number) {
  const change = ((current - prev) / prev) * 100;
  let percent;

  if (change < 0) {
    return {
      percent: Number.isFinite(change) ? change.toFixed(1) : "-1000+",
      type: "decrease",
    };
  } else if (change > 0) {
    return {
      percent: Number.isFinite(change) ? change.toFixed(1) : "1000+",
      type: "increase",
    };
  }

  return {
    percent: Number.isNaN(change) ? (0).toFixed(1) : change.toFixed(1),
    type: "no change",
  };
}

export function checkArray(arr: any) {
  const checked = Array.isArray(arr) ? arr[0] : arr;

  return checked;
}
