import useModalStack from "@/hooks/useModalStack";
import { useRef } from "react";

import usePressingHandler from "@/hooks/usePressingHandler";
import LeftAndRightSlider from "../molecules/LeftAndRightSlider";

import formatDate from "@/utils/formatDate";

import IconShare from "../../assets/images/icon-share.svg?react";
import IconTrash from "../../assets/images/icon-trash.svg?react";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { SchedulesType } from "@/types/schedules.type";
import { ScheduleDetails } from "@/store";


interface ScheduleCardProps {
  index?: number,
  data: ReadDocumentType<SchedulesType> | ScheduleDetails,
  handleSelectCard?: (scheduleId: string) => void;
  handleEditCard?: (data: ReadDocumentType<SchedulesType>) => void;
  handleDeleteCard?: (id: string) => void;
  handleFunc?: () => void;
  isSlideEnabled?: boolean
  selected?: boolean
  onAddress?: boolean,
  schedulerDetail?: "timeOffset" | "sequenceNumber",
}

const ScheduleCard = ({
  index,
  data,
  handleSelectCard,
  handleEditCard,
  handleDeleteCard,
  handleFunc,
  isSlideEnabled,
  selected,
  onAddress,
  schedulerDetail }: ScheduleCardProps) => {

  let scheduleId: string, scheduleData: SchedulesType | ScheduleDetails;
  if ("id" in data && "data" in data) {
    scheduleId = data.id;
    scheduleData = data.data
  } else {
    scheduleData = data
  }

  const { scheduleName, scheduleLocation, startTime, endTime } = scheduleData;

  const { openModal, closeModal } = useModalStack()

  const formattedAddress = useRef<HTMLInputElement>(null);

  const { startPressing, stopPressing } = usePressingHandler(() => {
    handleEditCard && handleEditCard(data as ReadDocumentType<SchedulesType>)
  });

  const handleCopyClipBoard = () => {
    if (formattedAddress.current) {
      closeModal()
      setTimeout(() => openModal("Toast", { message: "공유 링크 복사 완료" }), 500)
      formattedAddress.current.select();
      document.execCommand("copy");
    }
  };

  return (
    <LeftAndRightSlider className="h-[70px]" moreAreaWidth={120} isSlideEnabled={isSlideEnabled}>
      <div
        onTouchStart={startPressing}
        onTouchEnd={stopPressing}
        onMouseDown={startPressing}
        onMouseUp={stopPressing}
        onClick={() => {
          handleSelectCard && handleSelectCard(scheduleId)
          handleFunc && handleFunc()
        }}
        className={`${selected ? "border-highlight" : "border-input"} px-[15px] w-full h-full flex items-center justify-between bg-input rounded-[10px] leading-none border transition duration-100 select-none`}
      >
        <input ref={formattedAddress} className="a11y-hidden" value={`https://plan-on.vercel.app/schedule/detail/readonly/${"id" in data && data.id}`} readOnly />
        <div className="w-full h-3/4 flex flex-col justify-evenly">
          <p className="text-md text-white">{scheduleName}</p>

          {onAddress &&
            <span className="text-xsm text-gray-old reduce-words w-[50vw]">
              {scheduleLocation.placeAddress}
            </span>
          }
          <span className="text-xsm text-gray-old">
            {"selectedDay" in data
              ? `${formatDate(`${data.selectedDay} ${startTime}`, 7)} ~ ${formatDate(`${data.selectedDay} ${endTime}`, 7)}`
              : `${formatDate(startTime, 2)} ~ ${formatDate(endTime, 3)}`
            }
          </span>
        </div>

        {schedulerDetail === "timeOffset" &&
          <span className="text-sm text-gray-old min-w-[50px] text-right">
            {"selectedDay" in data
              ? `${formatDate(`${data.selectedDay} ${startTime}`, 9)}`
              : `${formatDate(startTime, 9)}`
            }
          </span>
        }

        {schedulerDetail === "sequenceNumber" &&
          <div
            className={`relative min-h-[25px] min-w-[25px] rounded-full transition duration-300 border text-md text-center text-highlight border-highlight`}
            style={{ backgroundColor: "rgba(211,255,99,0.2)" }}
          >
            <span className={`absolute-center "text-highlight text-xsm`}>{index}</span>
          </div>
        }
      </div>

      <button className="absolute top-1/2 -right-[50px] -translate-y-1/2" type="button" onClick={() => {
        handleCopyClipBoard()
      }}>
        <IconShare width={17} height={17} fill={"var(--highlight)"} />
      </button>

      <button className="absolute top-1/2 -right-[100px] -translate-y-1/2 pointer-events-auto" type="button" onClick={() => {
        handleDeleteCard && handleDeleteCard(scheduleId)
      }
      }>
        <IconTrash width={17} height={17} fill={"var(--red)"} />
      </button>
    </LeftAndRightSlider>
  )
}

export default ScheduleCard;