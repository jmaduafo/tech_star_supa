import {
  Activity,
  Amount,
  ChartData,
  Contract,
  Contractor,
  Payment,
  Project,
  Stage,
  StageContractor,
} from "@/types/types";
import { versusLast } from "./dateAndTime";
import { checkArray } from "./currencies";
import { format } from "date-fns";

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

export function activitiesBar(activities: Activity[], period: string) {
  const data: any[] = [];

  activities.forEach((activity) => {
    const index = data.findIndex(
      (item) => item.name === format(activity.created_at, "PP")
    );

    if (index !== -1) {
      if (period !== "All Time") {
        versusLast(activity.created_at, period).current &&
          data[index]["activityCount"]++;
      } else {
        data[index]["activityCount"]++;
      }
    } else {
      if (period !== "All Time") {
        versusLast(activity.created_at, period).current &&
          data.push({
            name: format(activity.created_at, "PP"),
            activityCount: 1,
          });
      } else {
        data.push({
          name: format(activity.created_at, "PP"),
          activityCount: 1,
        });
      }
    }
  });

  return data;
}

export function contractPaymentsAreaChart(
  projects: Project[],
  project_id: string,
  code: string,
  period: string
) {
  const project = projects.find((item) => item.id === project_id);

  if (!project) {
    return;
  }

  const contracts = project.contracts;
  const payments = project.payments;

  const contractAmounts: any[] = [];
  const contractPayments: any[] = [];

  contracts?.forEach((contract) => {
    contract.contract_amounts.forEach((amount) => {
      if (period !== "All Time") {
        versusLast(contract.date, period).current &&
          amount.code === code &&
          contractAmounts.push({
            name: format(contract.date, "PP"),
            amount: +amount.amount,
          });
      } else {
        amount.code === code &&
          contractAmounts.push({
            name: format(contract.date, "PP"),
            amount: +amount.amount,
          });
      }
    });
  });

  payments?.forEach((payment) => {
    const amount = checkArray(payment.payment_amounts);

    if (period !== "All Time") {
      versusLast(payment.date, period).current &&
        amount.code === code &&
        payment.is_paid &&
        payment.contract_id &&
        contractPayments.push({
          name: format(payment.date, "PP"),
          amount: +amount.amount,
        });
    } else {
      amount.code === code &&
        payment.contract_id &&
        payment.is_paid &&
        contractPayments.push({
          name: format(payment.date, "PP"),
          amount: +amount.amount,
        });
    }
  });

  const newData: any[] = [];

  contractAmounts.forEach((contract) => {
    const index = newData.findIndex((item) => item.name === contract.name);

    if (index !== -1) {
      newData[index]["contracts"] += contract.amount;
    } else {
      newData.push({
        name: contract.name,
        contracts: contract.amount,
        payments: 0,
      });
    }
  });

  contractPayments.forEach((payment) => {
    const index = newData.findIndex((item) => item.name === payment.name);

    if (index !== -1) {
      newData[index]["payments"] += payment.amount;
    } else {
      newData.push({
        name: payment.name,
        contracts: 0,
        payments: payment.amount,
      });
    }
  });

  // return sorted by date

  return newData.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
}

// pages/reports/charts/StatusBar

export function paymentStatusBarChart(
  project_id: string,
  payments: Payment[],
  contractors: Contractor[],
  period: string,
  code: string,
  isCount?: boolean
) {
  const data: any[] = [];

  // Filter through contractor
  contractors.forEach((contractor, index) => {
    // INITIALIZE ARRAY WITH CONTRACTOR OBJECT AND ONLY EDIT LATER
    data.push({ name: contractor.name, pending: 0, paid: 0, unpaid: 0 });

    // FILTER BY TIME PERIOD ("year", "month", "week") AND PROJECT ID
    // IF "ALL TIME" IS NOT SELECTED
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

    paymentsFilter.forEach((item) => {
      const amount = checkArray(item.payment_amounts);
      if (isCount) {
        // COUNT THE PAYMENTS PAID, PENDING, OR UNPAID PER CONTRACTOR
        if (item.is_completed && item.is_paid && amount.code === code) {
          data[index]["paid"]++;
        } else if (
          !item.is_paid &&
          !item.is_completed &&
          amount.code === code
        ) {
          data[index]["pending"]++;
        } else if (!item.is_paid && item.is_completed && amount.code === code) {
          data[index]["unpaid"]++;
        }
      } else {
        // AGGREGATE THE PAYMENTS PAID, PENDING, OR UNPAID PER CONTRACTOR
        if (item.is_completed && item.is_paid && amount.code === code) {
          data[index]["paid"] += +amount.amount;
        } else if (
          !item.is_paid &&
          !item.is_completed &&
          amount.code === code
        ) {
          data[index]["pending"] += +amount.amount;
        } else if (!item.is_paid && item.is_completed && amount.code === code) {
          data[index]["unpaid"] += +amount.amount;
        }
      }
    });
  });

  return data;
}

export function contractStatusBarChart(
  project_id: string,
  contracts: Contract[],
  contractors: Contractor[],
  period: string,
  code: string,
  isCount?: boolean
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

    contractFilter.forEach((item) => {
      item.contract_amounts.forEach((amount) => {
        if (isCount) {
          // COUNT THE CONTRACTS COMPLETED OR STILL ONGOING BY CURRENCY
          if (item.is_completed && amount.code === code) {
            data[index]["completed"]++;
          } else if (!item.is_completed && amount.code === code) {
            data[index]["ongoing"]++;
          }
        } else {
          // SUM THE CONTRACT AMOUNTS COMPLETED OR STILL ONGOING BY CURRENCY
          if (item.is_completed && amount.code === code) {
            data[index]["completed"] += +amount.amount;
          } else if (!item.is_completed && amount.code === code) {
            data[index]["ongoing"] += +amount.amount;
          }
        }
      });
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

export function contractorPieStageChart(data: StageContractor[]) {
  const chart: any[] = [];

  data.forEach((item) => {
    const stage = checkArray(item.stages);
    const contractor = checkArray(item.contractors);

    const index = chart.findIndex((ch) => ch.name === stage.name);

    if (index !== -1) {
      if (!chart[index].contractor_ids.includes(contractor.id)) {
        chart[index].contractor_ids.push(contractor.id);
      }
    } else {
      chart.push({ name: stage.name, contractor_ids: [contractor.id] });
    }
  });

  const newChart: any[] = [];

  chart.forEach((item) => {
    newChart.push({
      name: item.name,
      count: item.contractor_ids.length,
    });
  });

  return newChart;
}

export function contractorPieLocationChart(data: Project[], project_id: string) {
  const chart: any[] = [];


  const contractors = data.find(item => item.id === project_id)?.contractors

  contractors?.forEach((contractor) => {
    const index = chart.findIndex(item => item.name === contractor.country)

    if (index !== -1) {
      chart[index]["count"]++
    } else {
      chart.push({ name: contractor.country, count: 1})
    }
  });

  return chart
}

export function contractorPieStartYearChart(data: Project[], project_id: string) {
  const chart: any[] = [];


  const contractors = data.find(item => item.id === project_id)?.contractors

  contractors?.forEach((contractor) => {
    const index = chart.findIndex(item => item.name === contractor.start_year)

    if (index !== -1) {
      chart[index]["count"]++
    } else {
      chart.push({ name: contractor.start_year, count: 1})
    }
  });

  return chart
}

export function topContractors(
  contractor: Contractor[],
  currency_code: string,
  timePeriod: string
) {
  const data: any[] = [];

  contractor.forEach((contractor, i) => {
    data.push({ name: contractor.name, paymentAmount: 0 });

    contractor.payments.forEach((item) => {
      const amount = Array.isArray(item.payment_amounts)
        ? item.payment_amounts[0]
        : item.payment_amounts;

      if (timePeriod !== "All Time") {
        if (
          amount &&
          item.is_paid &&
          amount.code === currency_code &&
          versusLast(item.date, timePeriod).current
        ) {
          data[i]["paymentAmount"] += +amount?.amount;
        }
      } else {
        if (amount && item.is_paid && amount.code === currency_code) {
          data[i]["paymentAmount"] += +amount?.amount;
        }
      }
    });
  });

  return data;
}
