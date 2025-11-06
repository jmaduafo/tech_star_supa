import { Amount, Contractor, Payment, Project } from "@/types/types";
import { checkArray, totalSum } from "./currencies";
import { versusLast } from "./dateAndTime";
import { chartFormatCount } from "./chartHelpers";
import { sortByNumOrBool } from "./sortFilter";

// GETS THE TOTAL AMOUNT OF ALL PAYMENTS UNDER A SPECIFIED CURRENCY AND PROJECT
export function totalAmountPaid(
  data: Project[],
  project_id: string,
  code: string,
  period: string,
  customStart?: string,
  customEnd?: string
) {
  const payments = data.find((item) => item.id === project_id)?.payments;

  const filter = payments?.filter(
    (item) =>
      item.is_paid &&
      item.payment_amounts &&
      item.payment_amounts[0]?.code === code
  );

  const prevAmounts: number[] = [];
  const currentAmounts: number[] = [];

  filter?.forEach((item) => {
    if (item?.payment_amounts) {
      if (period !== "All Time") {
        if (
          period.toLowerCase().includes("custom") &&
          customStart?.length &&
          customEnd?.length
        ) {
          versusLast(item?.date, period, customStart, customEnd).current &&
            currentAmounts.push(Number(item?.payment_amounts[0]?.amount));
        } else {
          versusLast(item?.date, period).prev &&
            prevAmounts.push(Number(item?.payment_amounts[0]?.amount));

          versusLast(item?.date, period).current &&
            currentAmounts.push(Number(item?.payment_amounts[0]?.amount));
        }
      } else {
        currentAmounts.push(Number(item?.payment_amounts[0]?.amount));
      }
    }
  });

  return {
    previousAmount: prevAmounts.length ? totalSum(prevAmounts) : 0,
    currentAmount: currentAmounts.length ? totalSum(currentAmounts) : 0,
  };
}

export function totalContractAmount(
  data: Project[],
  project_id: string,
  code: string,
  period: string,
  customStart?: string,
  customEnd?: string
) {
  const contracts = data.find((item) => item.id === project_id)?.contracts;

  const contractAmounts: any[] = [];

  contracts?.forEach((item) => {
    item.contract_amounts.forEach((amount) => {
      contractAmounts.push({ ...amount, date: item.date });
    });
  });

  const filter = contractAmounts.filter((item) => item.code === code);

  const prevAmounts: number[] = [];
  const currentAmounts: number[] = [];

  filter?.forEach((item) => {
    if (period !== "All Time") {
      if (
        period.toLowerCase().includes("custom") &&
        customStart?.length &&
        customEnd?.length
      ) {
        versusLast(item.date, period, customStart, customEnd).current &&
          currentAmounts.push(Number(item.amount));
      } else {
        versusLast(item.date, period).prev &&
          prevAmounts.push(Number(item.amount));

        versusLast(item.date, period).current &&
          currentAmounts.push(Number(item.amount));
      }
    } else {
      currentAmounts.push(Number(item.amount));
    }
  });

  return {
    previousAmount: prevAmounts.length ? totalSum(prevAmounts) : 0,
    currentAmount: currentAmounts.length ? totalSum(currentAmounts) : 0,
  };
}

export function totalContractPayments(
  data: Project[],
  project_id: string,
  code: string,
  period: string,
  customStart?: string,
  customEnd?: string
) {
  const payments = data.find((item) => item.id === project_id)?.payments;

  const filter = payments?.filter(
    (item) =>
      item.is_paid &&
      item.contract_id &&
      item.payment_amounts &&
      item.payment_amounts[0]?.code === code
  );

  const prevAmounts: number[] = [];
  const currentAmounts: number[] = [];

  filter?.forEach((item) => {
    if (item?.payment_amounts) {
      if (period !== "All Time") {
        versusLast(item?.date, period).prev &&
          prevAmounts.push(Number(item?.payment_amounts[0]?.amount));

        versusLast(item?.date, period).current &&
          currentAmounts.push(Number(item?.payment_amounts[0]?.amount));
      } else {
        currentAmounts.push(Number(item?.payment_amounts[0]?.amount));
      }
    }
  });

  return {
    previousAmount: prevAmounts.length ? totalSum(prevAmounts) : 0,
    currentAmount: currentAmounts.length ? totalSum(currentAmounts) : 0,
  };
}

export function totalContractBalance(
  data: Project[],
  project_id: string,
  code: string,
  period: string,
  customStart?: string,
  customEnd?: string
) {
  const currentContractAmount = totalContractAmount(
    data,
    project_id,
    code,
    period
  ).currentAmount;
  const previousContractAmount = totalContractAmount(
    data,
    project_id,
    code,
    period
  ).previousAmount;

  const currentContractPayment = totalContractPayments(
    data,
    project_id,
    code,
    period
  ).currentAmount;
  const previousContractPayment = totalContractPayments(
    data,
    project_id,
    code,
    period
  ).previousAmount;

  return {
    previousAmount:
      period !== "All Time"
        ? previousContractAmount - previousContractPayment
        : 0,
    currentAmount: currentContractAmount - currentContractPayment,
  };
}

// GETS A WHOLE NUMBER DIGIT OF ALL THE PAID TRANSACTIONS UNDER A
// SPECIFIED PROJECT AND CURRENCY
export function totalPayments(
  data: Project[],
  project_id: string,
  code: string,
  period: string,
  customStart?: string,
  customEnd?: string
) {
  const payments = data.find((item) => item.id === project_id)?.payments;

  const filter = payments?.filter(
    (item) =>
      item.is_paid === true &&
      item.payment_amounts &&
      item.payment_amounts[0].code === code
  );

  let previousAmount = 0;
  let currentAmount = 0;

  filter?.forEach((item) => {
    if (period === "custom" && customStart?.length && customEnd?.length) {
      versusLast(item?.date, period, customStart, customEnd).current &&
        currentAmount++;
    } else {
      versusLast(item?.date, period).prev && previousAmount++;
      versusLast(item?.date, period).current && currentAmount++;
    }
  });

  return {
    previousAmount,
    currentAmount,
  };
}

// GETS THE AVERAGE CONTRACT SIZE
export function averageContract(
  data: Project[],
  project_id: string,
  code: string,
  period: string,
  customStart?: string,
  customEnd?: string
) {
  const contracts = data.find((item) => item.id === project_id)?.contracts;

  const filter = contracts?.filter((item) =>
    item.contract_amounts?.find((item) => item.code === code)
  );

  const prevAmounts: number[] = [];
  const currentAmounts: number[] = [];

  filter?.forEach((item) => {
    if (item?.contract_amounts) {
      if (period === "custom" && customStart?.length && customEnd?.length) {
        versusLast(item?.date, period, customStart, customEnd).current &&
          currentAmounts.push(
            Number(
              item?.contract_amounts?.find((item) => item.code === code)?.amount
            )
          );
      } else {
        versusLast(item?.date, period).prev &&
          prevAmounts.push(
            Number(
              item?.contract_amounts?.find((item) => item.code === code)?.amount
            )
          );

        versusLast(item?.date, period).current &&
          currentAmounts.push(
            Number(
              item?.contract_amounts?.find((item) => item.code === code)?.amount
            )
          );
      }
    }
  });

  return {
    previousAmount: prevAmounts.length
      ? totalSum(prevAmounts) / prevAmounts.length
      : 0,
    currentAmount: currentAmounts.length
      ? totalSum(currentAmounts) / currentAmounts.length
      : 0,
  };
}

// GETS ALL THE ACTIVE CONTRACTORS UNDER A PROJECT
export function activeContractors(data: Project[], project_id: string) {
  const contractors = data.find((item) => item.id === project_id)?.contractors;

  const filter = contractors?.filter((item) => item.is_available === true);

  return {
    previousAmount: 0,
    currentAmount: filter ? filter.length : 0,
  };
}

// GETS ALL THE ACTIVE CONTRACTORS UNDER A PROJECT
export function topContractors(data: Payment[], project_id: string) {
  const payments = data.filter((item) => item.id === project_id);

  const contractors: Contractor[] = [];

  payments.forEach((item) => {
    item.contractors && contractors.push(item.contractors);
  });
  const contractorCounts = chartFormatCount(contractors, "name");
  const sort = sortByNumOrBool(contractorCounts, "value", "desc");

  return sort[0].name;
}

// GETS ALL THE ACTIVE CONTRACTORS UNDER A PROJECT
export function highestPaymentAmount(
  data: Project[],
  project_id: string,
  code: string,
  period: string,
  customStart?: string,
  customEnd?: string
) {
  const payments = data.find((item) => item.id === project_id)?.payments;

  const filter = payments?.filter(
    (item) =>
      item.is_paid &&
      item.payment_amounts &&
      item.payment_amounts[0]?.code === code
  );

  const prevAmounts: number[] = [];
  const currentAmounts: number[] = [];

  filter?.forEach((item) => {
    if (item?.payment_amounts) {
      if (period !== "All Time") {
        versusLast(item?.date, period).prev &&
          prevAmounts.push(Number(item?.payment_amounts[0]?.amount));

        versusLast(item?.date, period).current &&
          currentAmounts.push(Number(item?.payment_amounts[0]?.amount));
      } else {
        currentAmounts.push(Number(item?.payment_amounts[0]?.amount));
      }
    }
  });

  const prevSortDesc = prevAmounts.sort((a, b) => b - a);
  const currentSortDesc = currentAmounts.sort((a, b) => b - a);

  return {
    previousAmount: prevAmounts.length ? prevSortDesc[0] : 0,
    currentAmount: currentAmounts.length ? currentSortDesc[0] : 0,
  };
}

export function revisedContract(payments: Payment[], code: string) {
  const contract_amount: number[] = [];

  payments[0]?.contracts?.contract_amounts?.forEach((amount) => {
    code === amount?.code && contract_amount.push(+amount?.amount);
  });

  return {
    previousAmount: 0,
    currentAmount: totalSum(contract_amount) ?? 0,
  };
}

export function contractPayments(payments: Payment[], code: string) {
  const payment_amount: number[] = [];

  payments.forEach((payment) => {
    const amount = checkArray(payment?.payment_amounts);

    amount &&
      code === amount.code &&
      payment.is_paid &&
      payment_amount.push(+amount.amount);
  });

  return {
    previousAmount: 0,
    currentAmount: totalSum(payment_amount) ?? 0,
  };
}

export function totalBalance(payments: Payment[], code: string) {
  const contract = revisedContract(payments, code);
  const payment = contractPayments(payments, code);

  return {
    previousAmount: 0,
    currentAmount:
      contract && payment ? contract.currentAmount - payment.currentAmount : 0,
  };
}

export function totalPending(payments: Payment[], code: string) {
  const payment_amount: number[] = [];

  payments.forEach((payment) => {
    const amount = checkArray(payment?.payment_amounts);

    amount &&
      code === amount.code &&
      !payment.is_completed &&
      !payment.is_paid &&
      payment_amount.push(+amount.amount);
  });

  return {
    previousAmount: 0,
    currentAmount: totalSum(payment_amount) ?? 0,
  };
}

export function totalUnpaid(payments: Payment[], code: string) {
  const payment_amount: number[] = [];

  payments.forEach((payment) => {
    const amount = checkArray(payment?.payment_amounts);

    amount &&
      code === amount.code &&
      payment.is_completed &&
      !payment.is_paid &&
      payment_amount.push(+amount.amount);
  });

  return {
    previousAmount: 0,
    currentAmount: totalSum(payment_amount) ?? 0,
  };
}
