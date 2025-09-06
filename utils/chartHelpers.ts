import { ChartData } from "@/types/types";

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
// => [{name: "Reas", value" 18}, {name: "Opal", value: 90}, ...]
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

export function getUniqueObjects(
  arr: any[],
  key?: string | number,
) {
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
