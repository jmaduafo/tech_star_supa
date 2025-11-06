import { months, days } from "./dataTools";

export function fullTime() {
  const now = new Date();
  let hour = "";
  let minutes = "";

  if (now.getHours().toString().length === 1) {
    hour += "0" + now.getHours();
  } else {
    hour += now.getHours();
  }

  if (now.getMinutes().toString().length === 1) {
    minutes += "0" + now.getMinutes();
  } else {
    minutes += now.getMinutes();
  }

  return { hour, minutes };
}

export function fullDate() {
  const now = new Date();
  let date = "";

  // Ex: Thu., Feb. 6, 2025
  date +=
    days[now.getDay()].substring(0, 3) +
    "., " +
    months[now.getMonth()].substring(0, 3) +
    ". " +
    now.getDate() +
    ", " +
    now.getFullYear();

  return date;
}

export function formatDate(input_date: string, formatOption?: number) {
  const date = new Date(input_date);

  // Output: 12 Aug 23
  const format =
    date.getDate() +
    " " +
    months[date.getMonth()].substring(0, 3) +
    " " +
    date.getFullYear().toString().slice(2);

  // Output: Aug 12, 2023
  const format2 =
    months[date.getMonth()].substring(0, 3) +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear();

  return formatOption === 2 ? format2 : format;
}

export function pastTime(period: string) {
  // GET CURRENT
  const now = new Date();
  const previous = new Date();

  // Ex: now.getMonth() -> 3, lastMonth -> 3 - 1 = 2
  if (period === "Last 1 year") {
    previous.setFullYear(now.getFullYear() - 1);
  } else if (period === "Last 1 month") {
    previous.setMonth(now.getMonth() - 1);
  } else if (period === "Last week") {
    previous.setDate(now.getDate() - 7);
  }

  // CONVERT START TIME AND END TIME TO FIREBASE TIMESTAMP FORMAT
  return previous;
}

// EVALUATES IF DATE INPUTTED IS WITHIN THE CURRENT OR PREVIOUS YEAR,
// MONTH, OR WEEK
export function versusLast(
  date: string,
  period: string,
  customStart?: string,
  customEnd?: string
) {
  const now = new Date();
  const itemDate = new Date(date);

  const current = new Date();
  const previous = new Date();

  //  PREVIOUS YEAR VERSUS CURRENT YEAR
  if (period.toLowerCase().includes("year")) {
    previous.setFullYear(now.getFullYear() - 2);
    current.setFullYear(now.getFullYear() - 1);
  } else if (period.toLowerCase().includes("quarter")) {
    //  PREVIOUS MONTH VERSUS CURRENT MONTH
    previous.setMonth(now.getMonth() - 12);
    current.setMonth(now.getMonth() - 6);
  } else if (period.toLowerCase().includes("month")) {
    //  PREVIOUS MONTH VERSUS CURRENT MONTH
    previous.setMonth(now.getMonth() - 2);
    current.setMonth(now.getMonth() - 1);
  } else if (period.toLowerCase().includes("week")) {
    //  PREVIOUS WEEK VERSUS CURRENT WEEK
    previous.setDate(now.getDate() - 14);
    current.setDate(now.getDate() - 7);
  } else if (period.toLowerCase().includes("day")) {
    //  PREVIOUS DAY VERSUS CURRENT DAY
    previous.setDate(now.getDate() - 2);
    current.setDate(now.getDate() - 1);
  } else if (
    period.toLowerCase().includes("custom") &&
    customStart &&
    customEnd
  ) {
    const start = new Date(customStart);
    const end = new Date(customEnd);

    return {
      prev: false,
      current: itemDate >= start && itemDate <= end,
    };
  }

  return {
    prev: previous <= itemDate && itemDate < current,
    current: current <= itemDate && itemDate <= now,
  };
}

export function switchPeriod(period: string) {
  if (period === "Yearly") {
    return "year";
  } else if (period === "Quarterly") {
    return "quarter";
  } else if (period === "Monthly") {
    return "month";
  } else if (period === "Weekly") {
    return "week";
  } else {
    return period;
  }
}
