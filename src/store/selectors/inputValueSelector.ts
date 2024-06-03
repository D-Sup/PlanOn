import { selector } from "recoil";
import { inputValue } from "../atoms/inputValueAtom";

export const inputValueSelector = selector({
  key: "inputValueSelector", 
  get: ({get}) => {
    return get(inputValue);
  },
});