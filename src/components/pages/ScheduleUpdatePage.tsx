import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useModalStack from "@/hooks/useModalStack";
import { useRecoilValue, useRecoilState, useSetRecoilState, useResetRecoilState } from "recoil";
import { routeDirectionValue, newScheduleFormValue, updateScheduleFormValue, isNewScheduleFormModifiedSelector, isUpdateScheduleFormModifiedSelector } from "@/store";

import ScheduleService from "@/services/scheduleService";

import FixedTrigger from "../molecules/FixedTrigger";
import Header from "../organisms/Header"
import SlideTransition from "../transitions/SlideTransition";
import ScheduleForm from "../organisms/ScheduleForm"
import ScheduleCardField from "../molecules/ScheduleCardField";
import ScheduleCard from "../organisms/ScheduleCard";

import { produce } from "immer"
import formatDate from "@/utils/formatDate";
import IconCirclePlus from "../../assets/images/icon-circle-plus.svg?react";

import { ScheduleDetails, ScheduleFormValueType } from "@/store";

const ScheduleUpdatePage = () => {

  const resetUpdateScheduleFormValue = useResetRecoilState(updateScheduleFormValue);
  const resetNewScheduleFormState = useResetRecoilState(newScheduleFormValue);
  const isNewScheduleFormModified = useRecoilValue(isNewScheduleFormModifiedSelector);
  const isUpdateScheduleFormModified = useRecoilValue(isUpdateScheduleFormModifiedSelector);
  const [newScheduleFormValueState, setNewScheduleFormValueState] = useRecoilState(newScheduleFormValue);
  const [updateScheduleFormValueState, setUpdateScheduleFormValueState] = useRecoilState(updateScheduleFormValue);
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue);

  const isAddSchedule = !isUpdateScheduleFormModified;

  const scheduleState = isAddSchedule ? newScheduleFormValueState : updateScheduleFormValueState
  const setScheduleState = isAddSchedule ? setNewScheduleFormValueState : setUpdateScheduleFormValueState

  const inProgressFormNumber = scheduleState.inProgressFormNumber as number
  const editScheduleIndex = inProgressFormNumber
  const isAddingScheduleDetail = scheduleState.isAddingScheduleDetail

  const [isEditingScheduleDetail, setIsEditingScheduleDetail] = useState<boolean>(false);
  const [addScheduleDate, setAddScheduleDate] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(inProgressFormNumber === 0 || inProgressFormNumber ? 1 : 0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const { startTime, endTime, scheduleName, scheduleDetails } = scheduleState;

  const sortSchedule = (scheduleDetails: ScheduleDetails[]) => {
    return scheduleDetails.slice().sort((a, b) => {
      if (a.selectedDay < b.selectedDay) return -1;
      if (a.selectedDay > b.selectedDay) return 1;
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
    });
  }

  const filteredData = sortSchedule(scheduleDetails)

  // useEffect(() => {
  //   if (!isAddingScheduleDetail) {
  //     setScheduleState((prevState) =>
  //       produce(prevState, (draft) => {
  //         draft.scheduleDetails = filteredData;
  //       })
  //     );
  //   }
  // }, [isAddingScheduleDetail, editScheduleIndex])

  const { openModal, closeModal, closeModalDirect } = useModalStack()
  const navigate = useNavigate();
  const location = useLocation();

  const { ManageSchedulesHeader } = Header();

  const { CreateSchedule, UpdateSchedule, DeleteSchedule } = ScheduleService()
  const { mutate: createScheduleMutate, isPending: createScheduleIsPending } = CreateSchedule(
    () => {
      onFetchComplete("일정이 추가되었습니다.")
      resetNewScheduleFormState()
    }, () => {
      onFetchComplete("일정 추가를 실패했습니다.")
      resetNewScheduleFormState()
    })

  const { mutate: updateScheduleMutate, isPending: UpdateScheduleIsPending } = UpdateSchedule(
    { id: updateScheduleFormValueState.id as string, data: scheduleState },
    () => {
      onFetchComplete("일정이 수정되었습니다.")
      resetUpdateScheduleFormValue()
    }, () => {
      onFetchComplete("일정 수정을 실패했습니다.")
    })

  const { mutate: DeleteScheduleMutate, isPending: DeleteScheduleIsPending } = DeleteSchedule(updateScheduleFormValueState.id as string,
    () => {
      onFetchComplete("일정이 삭제되었습니다.")
    },
    () => {
      onFetchComplete("일정 삭제를 실패했습니다.")
    }
  )

  const onFetchComplete = (message: string) => {
    closeModal();
    setTimeout(() => {
      openModal("Toast", { isFail: message.includes("실패"), message });
    }, 800)
    // navigate("/schedule", {
    //   state: { direction: "prev" },
    // })
    setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
  }

  if (createScheduleIsPending && isFetching) {
    closeModalDirect()
    openModal("Loading", { isLoader: false, message: "일정 추가 중..." });
    setIsFetching(false)
  }

  if (UpdateScheduleIsPending && isFetching) {
    closeModalDirect()
    openModal("Loading", { isLoader: false, message: "일정 수정 중..." });
    setIsFetching(false)
  }

  if (DeleteScheduleIsPending && isFetching) {
    closeModalDirect()
    openModal("Loading", { isLoader: false, message: "일정 삭제 중..." });
    setIsFetching(false)
  }

  const handlePreviousProgress = () => {
    if (progress === 0 && isAddSchedule && !isNewScheduleFormModified) {
      setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
    } else if (progress === 0 && isAddSchedule && isNewScheduleFormModified) {
      openModal("Alert", "임시저장을 하시겠습니까?", ["삭제", "확인"],
        [
          () => {
            closeModal()
            setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
            resetNewScheduleFormState()
          },
          () => {
            closeModal()
            setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
          }
        ])
    } else if (progress === 1) {
      setIsEditingScheduleDetail(false)
      setScheduleState((Prev) => produce(Prev, (draft) => {
        draft.isAddingScheduleDetail = false
        draft.scheduleDetails = sortSchedule(draft.scheduleDetails);
      }))
      setProgress(0)
      setDirection("prev")
      isAddingScheduleDetail ? deleteScheduleDetail() : cancelEditScheduleDetail()
    } else {
      navigate("/schedule/detail", {
        state: {
          direction: "prev",
        },
      })
      const rollback = produce(updateScheduleFormValueState, draft => {
        if (draft.scheduleFormSnapshot) {
          const keys = Object.keys(draft.scheduleFormSnapshot) as (keyof ScheduleFormValueType)[];
          keys.forEach(key => {
            (draft[key] as ScheduleFormValueType[keyof ScheduleFormValueType]) = draft.scheduleFormSnapshot![key] as ScheduleFormValueType[keyof ScheduleFormValueType];
          });
        }
      });
      setUpdateScheduleFormValueState(rollback)
    }
  }

  const handleNextProgress = () => {
    if (progress === 0 && isAddSchedule) {
      openModal("Alert", "일정을 추가하시겠습니까?", ["취소", "확인"],
        [null,
          () => {
            createScheduleMutate()
          }
        ])
    } else if (progress === 0 && !isAddSchedule) {
      openModal("Alert", "일정을 수정하시겠습니까?", ["취소", "확인"],
        [null,
          () => {
            updateScheduleMutate()
          }
        ])
    } else {
      setIsEditingScheduleDetail(false)
      setScheduleState((Prev) => produce(Prev, (draft) => {
        draft.isAddingScheduleDetail = false
        draft.scheduleDetailSnapshot = null
        draft.scheduleDetails = sortSchedule(draft.scheduleDetails);
      }))
      setProgress(0)
      setDirection("prev")
    }
  }

  const addScheduleDetailDefault = (time: string) => {
    setAddScheduleDate(time)
    setProgress(1)
    setDirection("next")
    const newValue = produce(scheduleState, (draft) => {
      draft.isAddingScheduleDetail = true
      draft.inProgressFormNumber = scheduleState.scheduleDetails.length
      draft.scheduleDetails.push({
        selectedDay: time,
        startTime: "00:00",
        endTime: "00:00",
        scheduleName: "",
        scheduleLocation: {
          placeName: "",
          placeAddress: "",
          placeId: "",
          lat: 0,
          lng: 0,
        },
        memoContent: ""
      })
    })
    setScheduleState(newValue)
  }

  const cancelEditScheduleDetail = () => {
    setScheduleState((Prev) => produce(Prev, (draft) => {
      draft.inProgressFormNumber = null
      draft.scheduleDetails[editScheduleIndex] = draft.scheduleDetailSnapshot as ScheduleDetails
    }))
  }

  const deleteScheduleDetail = () => {
    setIsEditingScheduleDetail(false)
    setProgress(0)
    setDirection("prev")
    const newValue = produce(scheduleState, (draft) => {
      draft.inProgressFormNumber = null
      draft.scheduleDetailSnapshot = null
      draft.scheduleDetails.splice(editScheduleIndex, 1);
    })
    setScheduleState(newValue);
  }

  const getDatesBetween = (startDate: string, endDate: string) => {
    const dates = [];
    const startDateArray = startDate.split("-");
    const currentDate = new Date(Date.UTC(+startDateArray[0], +startDateArray[1] - 1, +startDateArray[2]));
    const endDateArray = endDate.split("-");
    const end = new Date(Date.UTC(+endDateArray[0], +endDateArray[1] - 1, +endDateArray[2]));

    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return dates.map(date => date.toISOString().split("T")[0]);
  };

  useEffect(() => {
    const scheduleLocation = location.state?.scheduleLocation
    if (location.state?.scheduleLocation) {
      setScheduleState((Prev) => produce(Prev, (draft) => {
        draft.scheduleDetails[inProgressFormNumber].scheduleLocation = scheduleLocation
      }))
      setIsEditingScheduleDetail(true)
    } else {
      setScheduleState((prevState) =>
        produce(prevState, (draft) => {
          draft.scheduleDetails = filteredData;
        })
      );
    }

    if (inProgressFormNumber === 0 || inProgressFormNumber) {
      setIsEditingScheduleDetail(true)
    }
  }, [])


  return (
    <>
      <FixedTrigger className="z-20 top-0" height={40} enableAnimation={false}>
        <ManageSchedulesHeader
          handleFunc={[handlePreviousProgress, handleNextProgress]}
          isEdit={isAddSchedule ? (isAddingScheduleDetail ? "추가" : isEditingScheduleDetail ? "수정" : "추가") : (isAddingScheduleDetail ? "추가" : isEditingScheduleDetail ? "수정" : "수정")}
          title={
            progress === 0
              ? isAddSchedule ? "일정 추가" : "일정 수정"
              : `${formatDate(addScheduleDate ? addScheduleDate : scheduleState.scheduleDetails[editScheduleIndex].selectedDay, 5).slice(1)} 일정 ${isAddSchedule ? (isAddingScheduleDetail ? "추가" : isEditingScheduleDetail ? "수정" : "추가") : (isAddingScheduleDetail ? "추가" : isEditingScheduleDetail ? "수정" : "수정")}`
          }
          isRequired={
            progress === 0 && (scheduleName !== "" && startTime !== "" && endTime !== "") ||
            progress === 1 && scheduleState.scheduleDetails[scheduleState.scheduleDetails.length - 1].scheduleName !== ""
          }
        />
      </FixedTrigger>

      <SlideTransition className="mt-[30px] px-[30px]" progress={progress} direction={direction} >
        {progress === 1 &&
          <>
            <ScheduleForm
              formData={scheduleState}
              setFormData={setScheduleState}
              isPrimarySchedule={false}
              detailedScheduleId={editScheduleIndex}
            />

            {isEditingScheduleDetail &&
              <button className="mt-[30px] w-full h-[60px] rounded-[10px] flex-center gap-[10px] bg-input" type="button"
                onClick={deleteScheduleDetail}>
                <p className="text-md text-red">일정 삭제</p>
              </button>
            }
          </>
        }

        {progress === 0 &&
          <>
            <ScheduleForm
              formData={scheduleState}
              setFormData={setScheduleState}
            />

            <div className={`mt-[30px] pb-[20px] flex flex-col gap-[15px] transition duration-300 ${startTime && endTime && new Date(startTime) <= new Date(endTime) ? "opacity-100" : "opacity-0"}`}>
              <h2 className="text-lg text-white">세부 일정</h2>

              {filteredData.map((scheduleDetail, index) =>
                scheduleDetail &&
                <ScheduleCardField key={index} label={formatDate(new Date(scheduleDetail.selectedDay), 5)} >
                  <ScheduleCard
                    data={scheduleDetail}
                    handleFunc={() => {
                      setIsEditingScheduleDetail(true)
                      setProgress(1)
                      setDirection("next")
                      setAddScheduleDate(scheduleDetail.selectedDay)
                      setScheduleState((Prev) => produce(Prev, (draft) => {
                        draft.inProgressFormNumber = index
                        draft.isAddingScheduleDetail = false
                        draft.scheduleDetailSnapshot = draft.scheduleDetails[index]
                      }))
                    }}
                    isSlideEnabled={false}
                    onAddress={true} />
                </ScheduleCardField>
              )}

              {getDatesBetween(startTime, endTime).map((time, index) => (
                <ScheduleCardField key={index} label={formatDate(time, 5)} >
                  <button className="w-full h-[70px] rounded-[10px] flex-center gap-[10px] bg-white" type="button"
                    onClick={() => { addScheduleDetailDefault(time) }}>
                    <IconCirclePlus width={20} height={20} fill={"var(--black)"} />
                    <p className="text-md text-black">일정 추가</p>
                  </button>
                </ScheduleCardField>
              ))}

              {!isAddSchedule &&
                <button className="mt-[30px] w-full h-[60px] rounded-[10px] flex-center gap-[10px] bg-input" type="button"
                  onClick={() => {
                    openModal("Alert", "일정을 삭제하시겠습니까?", ["취소", "확인"],
                      [null,
                        () => {
                          DeleteScheduleMutate()
                        }
                      ])
                  }}>
                  <p className="text-md text-red">일정 삭제</p>
                </button>
              }
            </div>
          </>
        }
      </SlideTransition >
    </>
  )
}

export default ScheduleUpdatePage