import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import useWindowSize from "@/hooks/useWindowSize"

import { useRecoilValue, useSetRecoilState, useResetRecoilState } from "recoil";
import { routeDirectionValue, updateScheduleFormValue } from "@/store";

import { Select, SelectTrigger, SelectContent, SelectItem } from "../shadcnUIKit/select";
import ScheduleCard from "../organisms/ScheduleCard";
import ScheduleCardField from "../molecules/ScheduleCardField"
import FixedTrigger from "../molecules/FixedTrigger"
import MapOverview from "../organisms/MapOverview"
import Header from "../organisms/Header";

import getAccountId from "@/utils/getAccountId";
import formatDate from "@/utils/formatDate"

import IconArrow from "../../assets/images/icon-arrow-left.svg?react";
import IconArrowBottom from "../../assets/images/icon-arrow-bottom.svg?react";

import { ScheduleFormValueType } from "@/store"
import { ScheduleDetails } from "@/store";
import { SchedulesType } from "@/types/schedules.type";

interface DataByDate {
  [key: string]: {
    label: string;
    value: ScheduleDetails[];
  };
}

const ScheduleDetailPage = () => {

  const accountId = getAccountId()

  const location = useLocation()
  const { data: schedules, isReadOnly } = location.state || []

  const { DownloadSuggestHeader } = Header()

  const formatSchedule = (data: SchedulesType) => {
    const result = {
      ...data,
      startTime: formatDate(data.startTime, 4),
      endTime: formatDate(data.endTime, 4),
      scheduleDetails: data.scheduleDetails.map(detail => ({
        ...detail,
        selectedDay: formatDate(detail.startTime, 4),
        startTime: formatDate(detail.startTime, 8),
        endTime: formatDate(detail.endTime, 8),
      }))
    }
    return result
  }

  const navigate = useNavigate()
  const resetUpdateScheduleFormValue = useResetRecoilState(updateScheduleFormValue);
  const updateScheduleFormValueState = useRecoilValue(updateScheduleFormValue);
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const { currentHeight } = useWindowSize()

  const { startTime, endTime, scheduleName, scheduleDetails } = (schedules ? formatSchedule(schedules) : updateScheduleFormValueState?.scheduleFormSnapshot) as ScheduleFormValueType;

  const scheduleDuration = `${formatDate(startTime, 2)} - ${formatDate(endTime, 3)}`

  const filteredScheduleOnlyMap = dataByDate(scheduleDetails, true)
  const filteredScheduleOnlyRead = dataByDate(scheduleDetails, false)

  const filteredData = scheduleDetails.slice().sort((a, b) => {
    if (a.selectedDay < b.selectedDay) return -1;
    if (a.selectedDay > b.selectedDay) return 1;
    if (a.startTime < b.startTime) return -1;
    if (a.startTime > b.startTime) return 1;
    return 0;
  });

  const noLocationSchedule = filteredData.filter(curr => curr.scheduleLocation.lat !== 0 || curr.scheduleLocation.lng !== 0);

  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState<number>(0);
  const [selectedDay, setSelectedDateState] = useState<string>(scheduleDuration);
  const [isLoadMap, setIsLoadMap] = useState<boolean>(false);
  const [isOverviewMap, setIsOverviewMap] = useState<boolean>(true);
  const scheduleForSelectedDay = isOverviewMap
    ? selectedDay === scheduleDuration
      ? noLocationSchedule
      : filteredScheduleOnlyMap.find(item => item.label === selectedDay)?.value as ScheduleDetails[]
    : selectedDay === scheduleDuration
      ? filteredData
      : filteredScheduleOnlyRead.find(item => item.label === selectedDay)?.value as ScheduleDetails[]

  const onDayChange = (newDay: string) => {
    setSelectedDateState(newDay);
    setIsLoadMap(false)
  };

  function dataByDate(data: ScheduleDetails[], filter: boolean) {
    const result = data.reduce<DataByDate>((acc, curr) => {
      if (!filter || (curr.scheduleLocation.lat !== 0 || curr.scheduleLocation.lng !== 0)) {
        if (!acc[curr.selectedDay]) {
          acc[curr.selectedDay] = {
            label: formatDate(curr.selectedDay, 2),
            value: []
          };
        }
        acc[curr.selectedDay].value.push(curr);
      }
      return acc;
    }, {});

    return Object.keys(result).map(key => result[key]);
  }

  useEffect(() => {
    setSelectedScheduleIndex(0)
  }, [selectedDay])

  useEffect(() => {
    setTimeout(() => setIsLoadMap(true), 100)
  }, [isLoadMap])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [isOverviewMap])

  return (
    <>
      {isReadOnly && !accountId &&
        <DownloadSuggestHeader />
      }
      {isOverviewMap &&
        <FixedTrigger className="z-20 top-0 w-full" height={currentHeight / 3} enableAnimation={false}>
          <div className="w-full bg-input h-[calc(100dvh/3)]">
            {isLoadMap && <MapOverview points={scheduleForSelectedDay} selectPoint={selectedScheduleIndex} setSelectPoint={setSelectedScheduleIndex} />}
          </div>

          {accountId &&
            <button className="absolute top-[20px] left-[20px] min-w-[38px] min-h-[38px] bg-white rounded-[10px] backdrop-blur-sm" style={{ backgroundColor: "rgba(26,26,26, 0.5)" }} type="button" onClick={() => {
              setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
              setTimeout(() => resetUpdateScheduleFormValue(), 500)
            }}>
              <IconArrow className="absolute-center" width={7} height={12} fill={"#FFF"} />
            </button>
          }
        </FixedTrigger>
      }

      <FixedTrigger className="z-20 px-[30px] w-full h-[55px] flex items-center justify-between" height={55} enableAnimation={false}>
        <div className="absolute left-0 bottom-0 w-full h-1" style={{ boxShadow: "0 2px var(--gray-heavy)" }}></div>

        {!isReadOnly && !isOverviewMap &&
          <button className="ml-[-10px] relative min-w-[30px] min-h-[30px] rounded-[10px]" type="button" onClick={() => {
            navigate("/schedule", {
              state: { direction: "prev" }
            })
            setTimeout(() => resetUpdateScheduleFormValue(), 500)
          }}>
            <IconArrow className="absolute-center" width={15} height={15} fill={"var(--white)"} />
          </button>}

        <div className="w-[180px]">
          <Select
            onValueChange={(newValue) => {
              onDayChange(newValue);
            }}
            value={selectedDay}
          >
            <SelectTrigger>
              {selectedDay}
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={scheduleDuration} value={scheduleDuration}>{scheduleDuration}</SelectItem>
              {isOverviewMap
                ? filteredScheduleOnlyMap.map((scheduleDetail) => (
                  <SelectItem key={scheduleDetail.label} value={scheduleDetail.label}>
                    {scheduleDetail.label}
                  </SelectItem>
                ))
                : filteredScheduleOnlyRead.map((scheduleDetail) => (
                  <SelectItem key={scheduleDetail.label} value={scheduleDetail.label}>
                    {scheduleDetail.label}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>

        <button className="relative min-w-[40px] min-h-[40px] bg-input rounded-full" type="button" onClick={() => {
          setIsOverviewMap(Prev => !Prev)
        }}>
          <IconArrowBottom className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition duration-300 ${isOverviewMap ? "rotate-180" : "rotate-0"}`} width={15} height={15} fill={"var(--white)"} />
        </button>

        {!isReadOnly &&
          <button onClick={() => {
            navigate("/schedule/update", {
              state: {
                direction: "next"
              },
            })
          }} className="text-red" type="button">
            편집
          </button>
        }
      </FixedTrigger>

      <div className="px-[30px]">
        <div className="flex flex-col gap-[15px]">
          <FixedTrigger className="w-full" height={45} enableAnimation={true} threshold={50}>
            <div className="flex gap-[20px] items-center">
              <strong className="py-[15px] block text-xlg text-white">{scheduleName}</strong>
            </div>
          </FixedTrigger>

          {scheduleForSelectedDay.map((scheduleDetail, index) =>
            <ScheduleCardField key={index} label={formatDate(scheduleDetail.selectedDay, 3) !== formatDate(index === 0 ? new Date(0) : scheduleForSelectedDay[index - 1].selectedDay, 3) ? formatDate(scheduleDetail.selectedDay, 5) : ""} memoContent={scheduleDetail.memoContent}>
              <ScheduleCard
                index={index + 1}
                data={scheduleDetail}
                handleFunc={() => {
                  isOverviewMap && setSelectedScheduleIndex(index)
                }}
                selected={isOverviewMap ? selectedScheduleIndex === index : false}
                isSlideEnabled={false}
                onAddress={true}
                schedulerDetail={isOverviewMap ? "sequenceNumber" : "timeOffset"}
              />
            </ScheduleCardField>
          )}
        </div>

      </div>
    </>
  )
}

export default ScheduleDetailPage