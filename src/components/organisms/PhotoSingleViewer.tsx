import ImageFrame from "../atoms/ImageFrame"
import IconCircleX from "../../assets/images/icon-circle-x.svg?react";

interface PhotoSingleViewerProps {
  isOpen: boolean,
  closeModal: () => void
  props: { photo: string }
}

const PhotoSingleViewer = ({ isOpen, closeModal, props }: PhotoSingleViewerProps) => {

  return (
    <>
      <div className="fixed left-0 top-0 z-50 w-full flex-center bg-[#000]" style={{ transform: isOpen ? "translateY(0%)" : "translateY(100%)", transition: ".3s" }}>
        <div className="w-full h-dvh py-[45px]">
          <button
            type="button"
            className="absolute z-10 top-[10px] right-[10px]"
            onClick={closeModal}>
            <IconCircleX width={25} height={25} fill={"#FFF"} />
          </button>
          <ImageFrame src={props.photo} alt={`photo-${props.photo}`} />
        </div>
      </div>
    </>
  )
}

export default PhotoSingleViewer