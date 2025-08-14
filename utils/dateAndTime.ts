import { TimeStamp } from "@/types/types";
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
    days[now.getDay()] +
    ", " +
    months[now.getMonth()].substring(0, 3) +
    ". " +
    now.getDate() +
    ", " +
    now.getFullYear();

  return date;
}

export function formatDate(timestamp: TimeStamp, formatOption?: number) {
  const date = new Date(timestamp.seconds * 1000);

  const format =
    date.getDate() +
    " " +
    months[date.getMonth()].substring(0, 3) +
    " " +
    date.getFullYear().toString().slice(2);
  const format2 =
    months[date.getMonth()].substring(0, 3) +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear();

  return formatOption === 2 ? format2 : format;
}

// export function formatChartDate(timestamp: TimeStamp) {
//   const date = new Date(timestamp.seconds * 1000);

//   let month = "";
//   let day = "";

//   if (date.getMonth().toString().length === 1) {
//     month += "0" + (date.getMonth() + 1);
//   } else {
//     month += date.getMonth() + 1;
//   }

//   if (date.getDate().toString().length === 1) {
//     day += "0" + date.getDate();
//   } else {
//     day += date.getDate();
//   }

//   const format = date.getFullYear() + "-" + month + "-" + day;

//   return format;
// }

// export function pastMonth() {
//   // GET CURRENT
//   const now = new Date();
//   const lastMonth = new Date();

//   // Ex: now.getMonth() -> 3, lastMonth -> 3 - 1 = 2
//   lastMonth.setMonth(now.getMonth() - 1);

//   // CONVERT START TIME AND END TIME TO FIREBASE TIMESTAMP FORMAT
//   const startTimestamp = Timestamp.fromDate(lastMonth);
//   const endTimestamp = Timestamp.fromDate(now);

//   return {
//     startTime: startTimestamp,
//     endTime: endTimestamp,
//   };
// }

// export function filterByDateRange(
//   array: any[] | undefined,
//   range: string
// ) {
//   const filter = array?.filter((item) => {
//     const date = new Date(item.date);
//     const referenceDate = new Date();

//     // For last 3 months
//     let daysToSubtract = 90;

//     // For last 1 month selected
//     if (range === "Last 1 month".toLowerCase()) {
//       daysToSubtract = 30;
//       // For last 7 days selected
//     } else if (range === "Last 7 days".toLowerCase()) {
//       daysToSubtract = 7;
//     }

//     const startDate = new Date(referenceDate);
//     startDate.setDate(startDate.getDate() - daysToSubtract);

//     // RETURN THE ARRAY OF OBJECTS WITHIN THE DATE RANGE
//     return date >= startDate;
//   });

//   return filter
// }
