import IconCircleX from "../../assets/images/icon-circle-x.svg?react";

interface PopupProps {
  children: React.ReactNode,
  isOpen: boolean,
  closeModal: () => void,
  title: string
}


const Popup = ({ children, isOpen, closeModal, title }: PopupProps) => {
  return (
    <>
      <div className="z-50 fixed-center w-3/4 h-[calc(70dvh)] bg-background-light text-invert-color rounded-md overflow-hidden font-lg backdrop-blur-sm" style={{ transform: isOpen ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(1.1)", opacity: isOpen ? 1 : 0, transition: ".4s" }}>
        <div className="flex items-center p-[15px] w-full h-[55px]">
          <span className="text-center text-white text-lg">{title}</span>
        </div>
        <button className="z-50 absolute top-[20px] right-[20px]" type="button">
          <IconCircleX
            className="transition duration-300"
            width={15}
            height={15}
            fill={"var(--white)"}
            onClick={closeModal}
          />
        </button>
        <div className="h-[calc(70dvh-60px)] overflow-y-scroll">
          {children}
        </div>
      </div >
      <div className={`z-40 fixed top-0 left-0 h-dvh w-screen bg-black ${isOpen ? "ease-out" : "ease-in"}`} style={{ transition: ".4s", opacity: isOpen ? .4 : 0 }} onClick={() => {
        closeModal()
      }} ></div>
    </>
  )
}

export default Popup