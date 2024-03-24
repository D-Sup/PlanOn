import { useState } from "react"

import DateDropdownSelector from "../mocules/DateDropdownSelector"

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
} from "date-fns"

const Calendar = () => {

  const colStartClasses = [
    "",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
  ]

  const classNames = (...classes: (string | undefined | null | boolean)[]): string => {
    return classes.filter(Boolean).join(" ");
  }

  const [selectedDateState, setSelectedDateState] = useState("")
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const firstDayCurrentMonth = parse(selectedDateState.length !== 10 ? selectedDateState : selectedDateState.slice(0, -3), "yyyy-MM", new Date())

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  })


  const previousMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setSelectedDateState(format(firstDayNextMonth, "yyyy-MM"))
  }

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setSelectedDateState(format(firstDayNextMonth, "yyyy-MM"))
  }

  return (
    <>
      <div className="fixed px-[30px] w-screen min-h-[450px] max-h-[450px]" onTouchEnd={() => {
        setSelectedDay(new Date())
        selectedDateState.length === 10 && setSelectedDateState(selectedDateState.slice(0, -3))
      }}>
        <div className="flex justify-between items-center">
          <div className="flex gap-[5px]">
            <DateDropdownSelector />
          </div>
          <div className="flex">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                previousMonth()
              }}
              className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray hover:text-gray-500"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextMonth()
              }}
              type="button"
              className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray hover:text-gray-500"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <ul className="grid grid-cols-7 mt-[30px] text-xsm text-gray leading-6 text-center text-gray">
          <li >일</li>
          <li >월</li>
          <li >화</li>
          <li >수</li>
          <li >목</li>
          <li >금</li>
          <li >토</li>
        </ul>
        <div className="grid grid-cols-7 mt-2 text-sm">
          {days.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={classNames(
                dayIdx === 0 && colStartClasses[getDay(day)],
                "py-1.5"
              )}
            >
              <button
                type="button"
                onTouchEnd={(e) => {
                  e.stopPropagation()
                  const formattedDay = format(new Date(day), "yyyy-MM-dd")
                  if (selectedDateState === formattedDay) {
                    setSelectedDay(new Date())
                    setSelectedDateState(format(new Date(day), "yyyy-MM"))
                  } else {
                    setSelectedDay(day)
                    setSelectedDateState(formattedDay)
                  }
                }}
                className={classNames(
                  !isEqual(day, selectedDay as Date) && "hover:bg-gray-heavy hover:text-white", // 선택되지 않은 날짜에 마우스를 올렸을 때의 배경색

                  isToday(day) && !isEqual(day, selectedDay as Date) && "text-red outline outline-2 outline-background outline-offset-[2px]", // 오늘 날짜이지만 선택되지 않았을 때 글자를 두껍고 빨간색으로

                  isEqual(day, selectedDay as Date) && isToday(day) && "bg-white text-black outline outline-2 outline-white outline-offset-[2px]", // 오늘 날짜이면서 선택된 날짜의 배경색과 글자색

                  !isEqual(day, selectedDay as Date) &&
                  !isEqual(day, selectedDay as Date) &&
                  !isToday(day) &&
                  isSameMonth(day, firstDayCurrentMonth) &&
                  "text-white outline outline-2 outline-background outline-offset-[2px]", // 현재 달에 속하지만 선택되지 않은 날짜의 글자색

                  isEqual(day, selectedDay as Date) &&
                  !isToday(day) &&
                  "bg-white text-black outline outline-2 outline-white outline-offset-[2px]", // 선택된 날짜이지만 오늘 날짜가 아닐 때의 배경색과 글자색

                  "mx-auto flex h-7 w-7 my-0 items-center justify-center rounded-full transition-all duration-300" // 공통 스타일
                )}
              >

                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </button>

              <div className="relative w-1 h-1 mx-auto mt-[10px] mb-1">
                {
                  //  추가
                }
              </div>
            </div>
          ))}
        </div>
      </div >
      <div className="w-screen min-h-[450px] max-h-[450px]"></div>
    </>
  )
}

export default Calendar