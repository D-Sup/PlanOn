const ScheduleCardField = ({ children, label }: { children: React.ReactNode, label: string }) => {

  const isDetail = true;

  return (
    <div className="flex gap-[15px]">
      {isDetail &&
        <div className="flex-center flex-col max-w-[35px] min-w-[35px]">
          <p className="font-bold text-white">{label.slice(1)}</p>
          <span className=" text-md text-white">{label.slice(0, 1)}</span>
        </div>
      }
      {children}
    </div>
  );
};

export default ScheduleCardField;