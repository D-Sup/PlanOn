import Dropdown from "../atoms/Dropdown";

import { useRecoilState } from "recoil";
import { selectedDateValue } from "@/store";

import { format, setMonth, parse } from "date-fns"


const DateDropdownSelector = () => {

  const [selectedDateState, setSelectedDateState] = useRecoilState(selectedDateValue)

  const firstDayCurrentMonth = parse(selectedDateState.length !== 10 ? selectedDateState : selectedDateState.slice(0, -3), "yyyy-MM", new Date())

  const onYearChange = (newYear: number) => {
    const updatedDate = new Date(firstDayCurrentMonth.setFullYear(newYear));
    setSelectedDateState(format(updatedDate, "yyyy-MM"));
  };

  const onMonthChange = (newMonth: number) => {
    const updatedDate = setMonth(firstDayCurrentMonth, newMonth);
    setSelectedDateState(format(updatedDate, "yyyy-MM"));
  };


  return (
    <>
      <Dropdown name={"years"} value={firstDayCurrentMonth} onDateChange={onYearChange} />
      <Dropdown name={"months"} value={firstDayCurrentMonth} onDateChange={onMonthChange} />
    </>
  )
}

export default DateDropdownSelector
