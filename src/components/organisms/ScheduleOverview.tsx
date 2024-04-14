import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useWindowSize from "@/hooks/useWindowSize";
import useModalStack from "@/hooks/useModalStack";

import { useSetRecoilState } from "recoil";
import { newScheduleFormValue, updateScheduleFormValue, isNewScheduleFormModifiedSelector, routeDirectionValue } from "@/store";

import ScheduleService from "@/services/scheduleService";

import { useRecoilValue, useResetRecoilState, SetterOrUpdater } from "recoil";
import { selectedDateValue } from "@/store";

import FixedTrigger from "../mocules/FixedTrigger";
import ScheduleCardField from "../mocules/ScheduleCardField";
import DateDropdownSelector from "../mocules/DateDropdownSelector";
import ScheduleCard from "../atoms/ScheduleCard"
import ScheduleOverviewSkeleton from "../skeleton/ScheduleOverviewSkeleton";

import { produce } from "immer"
import formatDate from "@/utils/formatDate";
import filterSecondsByDate from "@/utils/filterSecondsByDate";

import IconCirclePlus from "../../assets/images/icon-circle-plus.svg?react";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { SchedulesType } from "@/types/schedules.type";
import { ScheduleFormValueType } from "@/store";
import { PostFormValueType } from "@/store";

interface ScheduleOverviewProps {
  postFormState?: PostFormValueType,
  setPostFormState?: SetterOrUpdater<PostFormValueType> | React.Dispatch<React.SetStateAction<PostFormValueType>>,
  isScheduleSelectable?: boolean,
  isSlideEnabled?: boolean,
  onSelected?: boolean
  onAddress?: boolean,
  schedulerDetail?: "timeOffset" | "sequenceNumber",
  editData?: PostFormValueType
}

const ScheduleOverview = ({ postFormState, setPostFormState, isScheduleSelectable = true, isSlideEnabled = true, onSelected = true, onAddress = true, schedulerDetail = "timeOffset", editData }: ScheduleOverviewProps) => {

  const isNewScheduleFormModified = useRecoilValue(isNewScheduleFormModifiedSelector);
  const resetNewScheduleFormState = useResetRecoilState(newScheduleFormValue);
  const resetSelectedDate = useResetRecoilState(selectedDateValue);
  const selectedDate = useRecoilValue(selectedDateValue);
  const setUpdateScheduleFormValueState = useSetRecoilState(updateScheduleFormValue);
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue);
  const [filteredSchedule, setFilteredSchedule] = useState<ReadDocumentType<SchedulesType>[]>();
  const [targetDeleteSchedule, setTargetDeleteSchedule] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const overViewRef = useRef<HTMLDivElement | null>(null);
  const [isEnableAnimation, setIsEnableAnimation] = useState<boolean>(false);

  const navigate = useNavigate()
  const location = useLocation()

  const { currentHeight } = useWindowSize()
  const { openModal, closeModal, closeModalDirect } = useModalStack()

  const { ReadSchedule, DeleteSchedule } = ScheduleService()
  const { data: scheduleData, isLoading, refetch } = ReadSchedule()
  const { mutate, isPending } = DeleteSchedule(targetDeleteSchedule,
    () => {
      closeModal();
      setTimeout(() => {
        openModal("Toast", { message: "일정이 삭제되었습니다." });
      }, 500)
    }, () => {
      closeModal();
      setTimeout(() => {
        openModal("Toast", { type: "fail", message: "일정 삭제를 실패했습니다." });
      }, 500)
    })

  if (isPending && isFetching) {
    closeModalDirect()
    openModal("Loading", { isLoader: false, message: "일정 삭제 중..." });
    setIsFetching(false)
  }

  const handleSelectCard = (id: string) => {
    if (postFormState && setPostFormState && onSelected) {
      setPostFormState(Prev => ({ ...Prev, scheduleId: postFormState.scheduleId === id ? "" : id }))
    }
  }

  const handleEditCard = (data: ReadDocumentType<SchedulesType>) => {
    const { id: preScheduleId, data: preScheduleData } = data;
    const formattedScheduleData = {
      ...preScheduleData,
      startTime: formatDate(preScheduleData.startTime, 4),
      endTime: formatDate(preScheduleData.endTime, 4),
      scheduleDetails: preScheduleData.scheduleDetails.map(detail => ({
        ...detail,
        selectedDay: formatDate(detail.startTime, 4),
        startTime: formatDate(detail.startTime, 8),
        endTime: formatDate(detail.endTime, 8),
      })),
    };
    setUpdateScheduleFormValueState((Prev) =>
      produce(Prev, (draft) => {
        Object.assign(draft, formattedScheduleData);
        draft.id = preScheduleId;
        draft.isAddingScheduleDetail = false;
        draft.inProgressFormNumber = null;
        draft.isScheduleFormModified = false;
        draft.scheduleFormSnapshot = formattedScheduleData as ScheduleFormValueType;
      })
    )
    setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, { data: editData }] }))
    navigate("/schedule/detail", {
      state: {
        direction: "next"
      },
    })
  }

  const handleDeleteCard = (id: string) => {
    openModal("Alert", "일정을 삭제하시겠습니까?", ["취소", "확인"], [null, () => setTargetDeleteSchedule(id)])
  }

  useEffect(() => {
    if (targetDeleteSchedule) {
      mutate()
    }
  }, [targetDeleteSchedule])

  useEffect(() => {
    if (!isLoading && scheduleData) {
      setFilteredSchedule(filterSecondsByDate(scheduleData, selectedDate, selectedDate.length !== 10 ? "month" : "day"))
    }
  }, [scheduleData, selectedDate])

  useEffect(() => {
    if (overViewRef.current) setIsEnableAnimation(overViewRef.current?.offsetHeight >= (currentHeight - 290))
    window.scrollTo({
      top: selectedDate.length !== 10 ? 0 : currentHeight - 80,
      behavior: "smooth"
    });
  }, [filteredSchedule])

  useEffect(() => {
    resetSelectedDate()
  }, [])

  useEffect(() => {
    if (!scheduleData) {
      refetch()
    }
  }, [scheduleData])

  if (isLoading) return <ScheduleOverviewSkeleton isScheduleSelectable={isScheduleSelectable} />


  return (
    <>
      {isScheduleSelectable ? (
        <FixedTrigger height={55} hasReachedTop={false} enableAnimation={isEnableAnimation}>
          <div className="pb-[15px] flex gap-[5px] w-screen bg-background">
            <DateDropdownSelector />
          </div>
        </FixedTrigger>
      ) : (
        <h2 className="sticky top-0 z-10 w-screen ml-[-30px] px-[30px] py-[15px] text-lg text-white backdrop-blur-sm">{selectedDate.length !== 10 ? `${parseInt(selectedDate.slice(5, 7))}월 예정된 일정` : `${formatDate(selectedDate, 6)} 일정`}</h2>
      )}

      <div className="flex flex-col gap-[15px]" ref={overViewRef}>
        {filteredSchedule?.map((schedule, index) => (
          <ScheduleCardField key={schedule.id} label={formatDate(schedule.data.startTime, 3) !== formatDate(index === 0 ? new Date(0) : filteredSchedule[index - 1].data.startTime, 3) ? formatDate(schedule.data.startTime, 5) : ""} >
            <ScheduleCard
              data={schedule}
              handleSelectCard={handleSelectCard}
              handleEditCard={handleEditCard}
              handleDeleteCard={handleDeleteCard}
              selected={onSelected && schedule.id === postFormState?.scheduleId}
              isSlideEnabled={isSlideEnabled}
              onAddress={onAddress}
              schedulerDetail={schedulerDetail}
            />
          </ScheduleCardField>
        ))}

        <ScheduleCardField label={""}>
          <button className="w-full h-[70px] rounded-[10px] flex-center gap-[10px] bg-white" type="button"
            onClick={() => {
              if (isNewScheduleFormModified) {
                openModal("Alert", "이전에 작성하던 내용이 있습니다.", ["새로 작성", "이어서 작성"], [
                  () => {
                    closeModal()
                    resetNewScheduleFormState()
                    setTimeout(() => navigate("/schedule/update", {
                      state: { direction: "next" },
                    }), 400)
                  },
                  () => {
                    closeModal()
                    setTimeout(() => navigate("/schedule/update", {
                      state: { direction: "next" },
                    }), 400)
                  }
                ])
              } else {
                navigate("/schedule/update", {
                  state: { direction: "next" },
                })
              }
              setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, { data: editData }] }))
            }}>
            <IconCirclePlus width={20} height={20} fill={"var(--black)"} />
            <p className="text-md text-black">일정 추가</p>
          </button>
        </ScheduleCardField>
      </div>
    </>
  )
}

export default ScheduleOverview