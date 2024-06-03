import { atom } from "recoil";

import { format, startOfToday } from "date-fns"

const today = startOfToday()

export const selectedDateValue = atom({
  key: "selectedDateValue",
  default: format(today, "yyyy-MM") as string,
});