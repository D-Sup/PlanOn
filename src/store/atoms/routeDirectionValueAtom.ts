import { atom } from "recoil";

interface routeDirectionValueType {
  direction: "next" | "prev" | "up" | "down" | "fade" | "",
  previousPageUrl: string[]
  data: any[],
}

export const routeDirectionValue = atom<routeDirectionValueType>({
  key: "routeTransitionDirection",
  default: {direction: "", previousPageUrl: [], data: []},
});