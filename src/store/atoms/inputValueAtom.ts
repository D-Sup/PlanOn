import { atom } from "recoil";

export const inputValue = atom({
  key: "inputValue",
  default: "" as string,
});