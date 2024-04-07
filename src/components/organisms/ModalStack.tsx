import { useState, useEffect } from "react";
import useModalStack from "@/hooks/useModalStack";

import { useRecoilValue } from "recoil";
import { modalStack } from "@/store";

import Toast from "./Toast";
import LoadingModal from "./LoadingModal";
import Alert from "./Alert";
import Popup from "./Popup";
import Modal from "./Modal";
import PhotoSingleViewer from "../pages/PhotoSingleViewer";

import { ModalStackType } from "@/store";

const ModalComponent = ({ modal }: { modal: ModalStackType }) => {

  const modalStackState = useRecoilValue(modalStack);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolledToTop, setIsScrolledToTop] = useState<boolean>(true);

  const { Component, props, selectOptions, actions } = modal;
  const { closeModalDirect } = useModalStack();

  useEffect(() => {
    const { isOpen } = modalStackState[modalStackState.length - 1];
    if (isOpen) {
      setIsOpen(true)
    } else if (!isOpen) {
      setIsOpen(false)
      const timeoutId = setTimeout(() => {
        closeModalDirect()
      }, 400)
      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [modalStackState]);

  const closeModal = () => {
    setIsOpen(false)
    setTimeout(() => {
      closeModalDirect()
    }, 400)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop <= 0) {
      setIsScrolledToTop(true)
    } else {
      setIsScrolledToTop(false)
    }
  }

  const handleScrollLock = () => {
    setIsScrolledToTop(false)
  }

  if (!Component) {
    return null;
  }

  switch (Component) {
    case "Toast":
      return <Toast isOpen={isOpen} closeModal={closeModal} props={props} />
    case "Loading":
      return <LoadingModal isOpen={isOpen} props={props} />
    case "Alert":
      return <Alert isOpen={isOpen} closeModal={closeModal} props={props} selectOptions={selectOptions} actions={actions} />
    case "Popup":
      return (
        <Popup isOpen={isOpen} closeModal={closeModal} title={props.title}>
          <props.component closeModal={closeModal} props={props.props} />
        </Popup>
      );
    case "PhotoView":
      return <PhotoSingleViewer isOpen={isOpen} closeModal={closeModal} props={props} />
    default:
      return (
        <Modal isOpen={isOpen} closeModal={closeModal} props={props} isScrolledToTop={isScrolledToTop}>
          <Component closeModal={closeModal} props={props} handleScroll={handleScroll} handleScrollLock={handleScrollLock} />
        </Modal>
      )
  }
};

const ModalStack = () => {
  const modalStackState = useRecoilValue(modalStack);

  return (
    <>
      {modalStackState.map((modal, index) => (
        <ModalComponent key={index} modal={modal} />
      ))}
    </>
  );
};

export { ModalStack };
