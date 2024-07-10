import { useNavigate } from "react-router-dom";
import useModalStack from "@/hooks/useModalStack";

import { useSetRecoilState } from "recoil";
import { routeDirectionValue } from "@/store";

import { SetterOrUpdater } from "recoil";

import SchedulePlacePicker from "./SchedulePlacePicker";
import FormField from "../molecules/FormField";
import GenericInput from "../atoms/GenericInput";

import { Switch } from "../shadcnUIKit/switch";

import { produce } from "immer"

import { scheduleFormValueDefault } from "@/store";
import { ScheduleFormValueType } from "@/store";

interface ScheduleFormProps {
  formData: ScheduleFormValueType,
  setFormData: SetterOrUpdater<ScheduleFormValueType> | React.Dispatch<React.SetStateAction<ScheduleFormValueType>>,
  isPrimarySchedule?: boolean,
  detailedScheduleId?: number,
}

const ScheduleForm = ({ formData, setFormData, isPrimarySchedule = true, detailedScheduleId }: ScheduleFormProps) => {

  const navigate = useNavigate()

  const { openModal } = useModalStack()
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  return (
    <div className="flex flex-col gap-[20px]">

      {isPrimarySchedule &&
        <FormField label={"공개"}>
          <Switch
            checked={!formData.private}
            onCheckedChange={() => {
              setFormData(Prev => ({ ...Prev, private: !Prev.private }))
            }}
          />
        </FormField>
      }

      <FormField label={"제목"}>
        <GenericInput
          className="h-[40px] rounded-[10px]"
          id={"title-input"}
          type={"text"}
          placeholder={"입력"}
          value={detailedScheduleId === 0 || detailedScheduleId
            ? formData.scheduleDetails[detailedScheduleId]?.scheduleName
            : formData.scheduleName}
          handleInputChange={(value: string) => {
            setFormData((Prev) =>
              produce(Prev, (draft) => {
                detailedScheduleId === 0 || detailedScheduleId
                  ? draft.scheduleDetails[detailedScheduleId].scheduleName = value
                  : draft.scheduleName = value
              })
            )
          }}
          resetInputValue={() => {
            setFormData((Prev) =>
              produce(Prev, (draft) => {
                detailedScheduleId === 0 || detailedScheduleId
                  ? draft.scheduleDetails[detailedScheduleId].scheduleName = ""
                  : draft.scheduleName = ""
              })
            )
          }}
        />
      </FormField>

      {!isPrimarySchedule && (detailedScheduleId === 0 || detailedScheduleId) ? (
        <div>
          <FormField label={"시작"}>
            <GenericInput
              className="h-[40px] rounded-t-[10px] border-b border-gray-heavy"
              id={"time-start-input"}
              type={"time"}
              placeholder={"00:00"}
              value={`${formData.scheduleDetails[detailedScheduleId]?.startTime}`}
              handleInputChange={(value: string) => {
                setFormData((Prev) =>
                  produce(Prev, (draft) => {
                    draft.scheduleDetails[detailedScheduleId].startTime = value;
                  })
                )
              }}
            />
          </FormField>

          <FormField label={"종료"}>
            <GenericInput
              className="h-[40px] rounded-b-[10px]"
              id={"time-end-input"}
              type={"time"}
              placeholder={"00:00"}
              value={`${formData.scheduleDetails[detailedScheduleId]?.endTime}`}
              handleInputChange={(value: string) => {
                setFormData((Prev) =>
                  produce(Prev, (draft) => {
                    draft.scheduleDetails[detailedScheduleId].endTime = value;
                  })
                )
              }}
            />
          </FormField>
        </div>
      ) : (
        <div>
          <FormField label={"시작"}>
            <GenericInput
              className="h-[40px] rounded-t-[10px] border-b border-gray-heavy"
              id={"memo-input"}
              type={"date"}
              placeholder={"날짜 선택"}
              value={`${formData.startTime}`}
              handleInputChange={(value: string) => {
                setFormData(Prev => ({ ...Prev, startTime: value }))
              }}
            />
          </FormField>

          <FormField label={"종료"}>
            <GenericInput
              className="h-[40px] rounded-b-[10px]"
              id={"memo-input"}
              type={"date"}
              placeholder={"날짜 선택"}
              value={`${formData.endTime}`}
              handleInputChange={(value: string) => {
                setFormData(Prev => ({ ...Prev, endTime: value }))
              }}
            />
          </FormField>
        </div>
      )}

      <FormField label={"위치"}>
        <GenericInput
          className="h-[40px] rounded-[10px]"
          id={"time-end-input"}
          type={"text"}
          placeholder={"위치추가..."}
          value={detailedScheduleId === 0 || detailedScheduleId ? formData.scheduleDetails[detailedScheduleId]?.scheduleLocation?.placeName : formData.scheduleLocation?.placeName}
          handleInputChange={(value: string) => {
            setFormData(Prev => ({ ...Prev, startTime: value }))
          }}
          resetInputValue={() => {
            setFormData((Prev) =>
              produce(Prev, (draft) => {
                detailedScheduleId === 0 || detailedScheduleId
                  ? draft.scheduleDetails[detailedScheduleId].scheduleLocation = scheduleFormValueDefault.scheduleLocation
                  : draft.scheduleLocation = scheduleFormValueDefault.scheduleLocation
              })
            )
          }}
          handleInputClick={() => {
            if (detailedScheduleId === 0 || detailedScheduleId) {
              setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
              navigate("/map", {
                state: {
                  direction: "up"
                }
              });
            } else {
              openModal(SchedulePlacePicker, setFormData)
            }
          }}
          readOnly={true}
        />
      </FormField>

      {!isPrimarySchedule && (detailedScheduleId === 0 || detailedScheduleId) &&
        <FormField label={"메모"}>
          <GenericInput
            className="h-[190px] rounded-[10px]"
            id={"memo-input"}
            type={"textarea"}
            placeholder={"입력"}
            value={formData.scheduleDetails[detailedScheduleId]?.memoContent}
            handleInputChange={(value: string) => {
              setFormData((Prev) =>
                produce(Prev, (draft) => {
                  draft.scheduleDetails[detailedScheduleId].memoContent = value;
                })
              )
            }}
            resetInputValue={() => {
              setFormData((Prev) =>
                produce(Prev, (draft) => { draft.scheduleDetails[detailedScheduleId].memoContent = "" }))
            }}
          />
        </FormField>
      }
    </div>
  )
}

export default ScheduleForm