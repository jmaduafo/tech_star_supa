import {
  Amount,
  ChartData,
  Contract,
  Contractor,
  Payment,
  Stage,
} from "@/types/types";
import { versusLast } from "./dateAndTime";

// TAKES IN AN ARRAY AND RETURNS THE ITEM WITH THE HIGHEST FREQUENCY
export const mostFrequent = (array: string[] | number[]) => {
  let count = array.reduce<Record<string, number>>((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});

  let maxKey: string | null = null;
  let maxValue = -Infinity;

  for (const [key, value] of Object.entries(count)) {
    if (value > maxValue) {
      maxValue = value;
      maxKey = key;
    }
  }

  return maxKey;
};

// RETURNS APPROPRIATE FORMAT FOR CHART GRAPHING
// key = "value" => [{name: "Reas", value" 18}, {name: "Opal", value: 90}, ...]
export const chartFormatCount = (array: any[], key: string | number) => {
  let count = array.reduce<Record<string, number>>((acc, curr) => {
    acc[curr[key]] = (acc[curr[key]] || 0) + 1;
    return acc;
  }, {});

  const chartData: ChartData[] = Object.entries(count).map(([name, value]) => ({
    name,
    value,
  }));

  return chartData;
};

export function getUniqueObjects(arr: any[], key?: string | number) {
  const unique = new Set();
  return arr.filter((obj) => {
    let keyValue;

    if (key) {
      keyValue = obj[key];
    } else {
      keyValue = JSON.stringify(obj);
    }

    if (unique.has(keyValue)) {
      return false;
    }

    unique.add(keyValue);
    return true;
  });
}

// Input => [{ name: "Zion", value: 78, isPresent: false}, { name: "Zion", value: 45, isPresent: false}, { name: "Lucas", value: 50, isPresent: true}]
// Output => [{ name: "Zion", value: 113, isPresent: false}, { name: "Lucas", value: 50, isPresent: true}]
export function chartFormatTotal(
  arr: any[],
  name: string | number,
  value: string
) {
  const data: any[] = [];

  arr.forEach((item) => {
    const index = data.findIndex((fi) => fi[name] === item[name]);

    if (index !== -1) {
      data[index][value] += item[value];
    } else {
      data.push({ ...item, name: item[name], value: item[value] });
    }
  });

  return data;
}

// pages/reports/charts/StatusBar

export function paymentStatusBarChart(
  project_id: string,
  payments: Payment[],
  contractors: Contractor[],
  period: string
) {
  const data: any[] = [];

  // Filter through contractor
  contractors.forEach((contractor, index) => {
    // INITIALIZE ARRAY WITH CONTRACTOR OBJECT AND ONLY EDIT LATER
    data.push({ name: contractor.name, pending: 0, paid: 0, unpaid: 0 });

    // FILTER BY TIME PERIOD ("year", "month", "week") AND PROJECT ID
    const paymentsFilter =
      period !== "All Time"
        ? payments.filter(
            (item) =>
              item.project_id === project_id &&
              item.contractor_id === contractor.id &&
              versusLast(item.date, period).current
          )
        : payments.filter(
            (item) =>
              item.project_id === project_id &&
              item.contractor_id === contractor.id
          );

    // COUNT THE PAYMENTS PAID, PENDING, OR UNPAID PER CONTRACTOR
    paymentsFilter.forEach((item) => {
      if (item.is_completed && item.is_paid) {
        data[index]["paid"]++;
      } else if (!item.is_paid && !item.is_completed) {
        data[index]["pending"]++;
      } else if (!item.is_paid && item.is_completed) {
        data[index]["unpaid"]++;
      }
    });
  });

  return data;
}

export function contractStatusBarChart(
  project_id: string,
  contracts: Contract[],
  contractors: Contractor[],
  period: string
) {
  const data: any[] = [];

  // Filter through contractor
  contractors.forEach((contractor, index) => {
    data.push({ name: contractor.name, completed: 0, ongoing: 0 });

    // FILTER BY TIME PERIOD ("year", "month", "week") AND PROJECT ID
    const contractFilter =
      period !== "All Time"
        ? contracts.filter(
            (item) =>
              item.project_id === project_id &&
              item.contractor_id === contractor.id &&
              versusLast(item.date, period).current
          )
        : contracts.filter(
            (item) =>
              item.project_id === project_id &&
              item.contractor_id === contractor.id
          );

    // COUNT THE CONTRACTS COMPLETED OR STILL ONGOING
    contractFilter.forEach((item) => {
      if (item.is_completed) {
        data[index]["completed"]++;
      } else {
        data[index]["ongoing"]++;
      }
    });
  });

  return data;
}

// pages/report/PaymentPie

export function paymentPieCurrencyChart(
  project_id: string,
  currencies: Amount[],
  payments: Payment[]
) {
  const data: any[] = [];

  const paymentsFilter = payments.filter((item) => item.is_paid);

  currencies.forEach((currency, i) => {
    const index = data.findIndex((item) => item.name === currency.name);

    if (index === -1) {
      data.push({ name: currency.name, paymentCount: 0 });

      paymentsFilter.forEach((item) => {
        const amounts = Array.isArray(item.payment_amounts)
          ? item.payment_amounts[0]
          : item.payment_amounts;

        if (amounts) {
          amounts.name === currency.name && data[i]["paymentCount"]++;
        }
      });
    }
  });

  return data;
}

export function paymentPieContractorChart(
  project_id: string,
  contractors: Contractor[],
  payments: Payment[]
) {
  const data: any[] = [];

  const paymentsFilter = payments.filter(
    (item) => item.project_id === project_id && item.is_paid
  );

  contractors.forEach((contractor, i) => {
    data.push({ name: contractor.name, paymentCount: 0 });

    paymentsFilter.forEach((item) => {
      item.contractor_id === contractor.id && data[i]["paymentCount"]++;
    });
  });

  return data;
}

export function paymentPieContractChart(
  project_id: string,
  contracts: Contract[],
  payments: Payment[]
) {
  const data: any[] = [];

  const paymentsFilter = payments.filter(
    (item) => item.project_id === project_id && item.is_paid
  );

  contracts.forEach((contract, i) => {
    data.push({ name: contract.contract_code, paymentCount: 0 });

    paymentsFilter.forEach((item) => {
      item.contract_id === contract.id && data[i]["paymentCount"]++;
    });
  });

  return data;
}

export function paymentPieStageChart(
  project_id: string,
  stages: Stage[],
  payments: Payment[]
) {
  const data: any[] = [];

  const paymentsFilter = payments.filter(
    (item) => item.project_id === project_id && item.is_paid
  );

  stages.forEach((stage, i) => {
    data.push({ name: stage.name, paymentCount: 0 });

    paymentsFilter.forEach((item) => {
      item.stage_id === stage.id && data[i]["paymentCount"]++;
    });
  });

  return data;
}
