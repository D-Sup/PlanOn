import { useEffect } from "react"

import IconInfo from "../../assets/images/icon-info.svg?react";
import IconAlert from "../../assets/images/icon-alert.svg?react";
import IconCheck from "../../assets/images/icon-check.svg?react";
import IconMessage from "../../assets/images/icon-comment.svg?react";
import IconCircleX from "../../assets/images/icon-circle-x.svg?react";

interface ToastProps {
  isOpen: boolean,
  closeModal: () => void
  props: {
    type: "fail" | "info" | "message" | "alert",
    title: string,
    message: string
  }
}

const Toast = ({ isOpen, closeModal, props }: ToastProps) => {

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      closeModal()
    }, 1500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isOpen])

  return (
    <div className="max-w-[calc(100%-20px)] z-50 fixed top-0 left-1/2  px-5 py-2 flex-center gap-[10px] font-lg text-center text-[#FFF] text-lg rounded-sm backdrop-blur-sm" style={{ backgroundColor: "rgba(118, 122, 126,0.3)", opacity: isOpen ? 1 : 0, transition: isOpen ? ".3s ease-out" : ".3s ease-in", transform: isOpen ? "translate(-50%, 10px)" : "translate(-50%, -80%)" }}>
      {props.type === "fail" && <IconCircleX width={15} height={15} fill={"var(--red)"} />}
      {props.type === "alert" && <IconAlert width={15} height={15} fill={"var(--highlight)"} />}
      {props.type === "info" && <IconInfo width={15} height={15} fill={"var(--highlight)"} />}
      {props.type === "message" &&
        <>
          <IconMessage width={17} height={17} fill={"var(--highlight)"} className="min-w-[17px]" />
          <span className="text-nowrap leading-none">{props.title}</span>
        </>
      }
      {!props.type && <IconCheck width={15} height={15} fill={"var(--green)"} />}
      <span className="text-nowrap reduce-words">{props.message}</span>
    </div >
  )
}

export default Toast