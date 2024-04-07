interface AlertProps {
  isOpen: boolean,
  closeModal: () => void,
  props: string,
  selectOptions?: (null | string)[],
  actions?: (null | (() => void))[]
}

const Alert = ({ isOpen, closeModal, props, selectOptions, actions }: AlertProps) => {

  return (
    <>
      <div className="z-50 fixed-center w-64 h-36 bg-input text-invert-color rounded-lg overflow-hidden font-lg backdrop-blur-sm" style={{ backgroundColor: "rgba(46,46,46,0.8)", opacity: `${isOpen ? 1 : 0}`, transition: ".4s" }}>
        <p className="text-center text-[#FFF] pt-10 text-lg">{props}</p>
        <div className="absolute bottom-0 w-full flex">
          <button
            className="flex-grow flex-basis-0 inline-block h-11 border-t border-box-shadow-color text-md text-[#068FFF] hover:bg-gray-heavy transition duration-300"
            onClick={() => {
              if (actions) {
                actions[0] === null
                  ? closeModal()
                  : actions[0]()
              }
            }}
          >
            {selectOptions && selectOptions[0]}
          </button>
          {selectOptions && selectOptions[1] &&
            <button
              className="w-32 h-11 text-md text-red font-bold border-t border-l border-box-shadow-color hover:bg-gray-heavy transition duration-300"
              onClick={() => {
                if (actions) {
                  actions[1] === null
                    ? closeModal()
                    : actions[1]()
                }
              }}
            >
              {selectOptions && selectOptions[1]}
            </button>
          }
        </div>
      </div >
      <div className={`z-40 fixed top-0 left-0 h-dvh w-screen bg-black ${isOpen ? "ease-out" : "ease-in"}`} style={{ transition: ".4s", opacity: `${isOpen ? .4 : 0}` }} onClick={() => {
        closeModal()
      }} ></div>
    </>
  );

}

export default Alert