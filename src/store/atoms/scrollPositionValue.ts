import { atom } from "recoil";

interface scrollPositionValueType {
  post: number,
  schedule: number,
  message: number,
  setting: number
}

export const scrollPositionValueDefault = {
  post: 0,
  schedule: 1000,
  message: 0,
  setting: 0
};

export const scrollPositionValue = atom<scrollPositionValueType>({
  key: "scrollPositionValue",
  default: scrollPositionValueDefault,
});