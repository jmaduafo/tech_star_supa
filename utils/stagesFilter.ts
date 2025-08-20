import { Stage } from "@/types/types";

export function contractorStages(data: Stage[]) {
  const newArray: Stage[] = [];
  data.forEach((item) => {
    item.stage_contractors &&
      item.stage_contractors.length &&
      newArray.push(item);
  });

  return newArray
}
