import { atom } from "recoil";

export interface ComponentProps {
  closeModal: () => void,
  props: any,
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void,
  handleScrollLock: () => void,
  selectOptions?: (null | string)[],
  actions?: (null | (() => void))[]
}

export interface ModalStackType {
  Component: React.ComponentType<ComponentProps> | "Toast" | "Loading" | "Alert" | "Popup" | "PhotoView" | null,
  props?: any,
  selectOptions?: (null | string)[],
  actions?: (null | (() => void))[],
  isOpen?: boolean,
}

export const modalStackDefault = [
    {
      Component: null,
      actions: [],
      isOpen: false,
      props: {},
      selectOptions: [],
    }
  ]

export const modalStack = atom<ModalStackType[]>({
  key: "modalStack",
  default: modalStackDefault
});
