import Loader from "./Loader";

interface AlertProps {
  isOpen: boolean,
  props: {
    isLoader: boolean,
    message: string
  },
}

const LoadingModal = ({ isOpen, props }: AlertProps) => {

  return (
    <>
      <div className="z-50 fixed-center gap-[30px] relative  bg-input text-invert-color overflow-hidden rounded-lg font-lg backdrop-blur-sm" style={{ backgroundColor: "rgba(46,46,46,0.8)", opacity: `${isOpen ? 1 : 0}`, transition: ".4s" }}>
        {props.isLoader &&
          <div className="relative h-[90px]">
            <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-[40px]">
              <Loader color="white" />
            </div>
          </div>
        }
        <p className="px-10 py-5 text-center text-[#FFF] text-lg">{props.message}</p>
      </div >
      <div className={`z-40 fixed top-0 left-0 h-dvh w-screen bg-black ${isOpen ? "ease-out" : "ease-in"}`} style={{ transition: ".4s", opacity: `${isOpen ? .4 : 0}` }} ></div>
    </>
  );

}

export default LoadingModal