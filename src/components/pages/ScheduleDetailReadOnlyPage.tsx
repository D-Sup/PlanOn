import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import ScheduleService from "@/services/scheduleService";

import Loader from "../organisms/Loader";

const ScheduleDetailReadOnlyPage = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const { ReadOnlySchedule } = ScheduleService()
  const { data, isLoading } = ReadOnlySchedule(location.pathname.split("/")[4])

  useEffect(() => {
    if (data) {
      navigate("/schedule/detail", { state: { direction: "fade", data: data?.data, isReadOnly: true } })
    }
  }, [isLoading])


  return (
    <div className="absolute-center w-[150px]">
      <Loader />
    </div>
  )
}

export default ScheduleDetailReadOnlyPage