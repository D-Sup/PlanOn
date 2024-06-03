import Calendar from "../organisms/Calendar"
import ScheduleOverview from "../organisms/ScheduleOverview"

const SchedulePage = () => {

  return (
    <div className="pt-[30px]">
      <Calendar />
      <div className="relative px-[30px] pb-[20px] bg-background-light" style={{ boxShadow: "0 500px 0 500px var(--background-light )" }}>
        <ScheduleOverview isScheduleSelectable={false} onSelected={false} onAddress={false} />
      </div>
    </div>
  )
}

export default SchedulePage;