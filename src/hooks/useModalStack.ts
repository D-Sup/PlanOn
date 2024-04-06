import useBodyScrollLock from "./useBodyScrollLock";
import { useResetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import { modalStack, isModalStackModifiedSelector, inputValue, ComponentProps } from "@/store";
import { produce } from "immer"

const useModalStack = () => {

  const resetInputValueState = useResetRecoilState(inputValue)
  const [modalStackState, setModalStackState] = useRecoilState(modalStack);
  const isModalStackModified = useRecoilValue(isModalStackModifiedSelector);
  const resetModalStack = useResetRecoilState(modalStack);

  const { lockScroll, openScroll } = useBodyScrollLock();

  const { Component: lastComponent } = modalStackState[modalStackState.length - 1];
  
  const openModal = (
    Component: React.ComponentType<ComponentProps> | "Toast" | "Loading" | "Alert" | "Popup" | "PhotoView" | null,
    props?: any,
    selectOptions?: string[],
    actions?: (null | (() => void))[] ): void => {
      const { Component: lastComponent } = modalStackState[modalStackState.length - 1];
      if ( lastComponent !== "Toast" ) {
        setModalStackState((Prev) => [
          ...Prev,
          { isOpen: true, Component, props, selectOptions, actions },
        ]);
        Component !== "Toast" && lockScroll()
      }
  };

  const closeModal = (): void => {
    lastComponent !== "Toast"  && openScroll()
    setModalStackState((Prev) => 
      produce(Prev, draft => {
        const lastElement = draft[draft.length - 1];
        lastElement.isOpen = false;
      })
    );
  };

  const closeModalDirect = () => {
    lastComponent !== "Toast"  && openScroll()
    if (lastComponent !== "Toast" && location.pathname !== "/post/detail") {
      resetInputValueState()
    }
    if (isModalStackModified && modalStackState.length !== 1) {
      setModalStackState((Prev) => {
        const newModalStack = [...Prev];
        newModalStack.pop();
        return newModalStack;
      });
    }
  }

  const updateModal = (newProps): void => {
    if (isModalStackModified && lastComponent !== "Alert" && lastComponent !== "Loading" && lastComponent !== "Toast" && lastComponent !== "PhotoView") {
      setModalStackState((Prev) => {
        const newModalStack = [...Prev];
        const lastIndex = newModalStack.length - 1;
        newModalStack[lastIndex] = {
          ...newModalStack[lastIndex],
          props: typeof newProps === "string" ? newProps : { ...newModalStack[lastIndex].props, ...newProps } 
        };
        return newModalStack;
      });
    }
  };

  const clearModal = () => resetModalStack();

  return { openModal, closeModal, closeModalDirect, updateModal, clearModal };
};

export default useModalStack;