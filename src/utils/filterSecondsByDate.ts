const filterSecondsByDate = (dataToFilter: any, selectedDate: string, unit: "month" | "day") => {
  const convertToSeconds = (selectedDate: string) => {
    const [year, month, day] = selectedDate.split("-").map(i => parseInt(i));
    const date = new Date(year, month - 1, unit === "day" ? day : 1);
    return Math.floor(date.getTime() / 1000);
  }

  const targetSeconds = convertToSeconds(selectedDate);
  const targetDate = new Date(targetSeconds * 1000);

  return dataToFilter.filter(item => {
    const startDate = new Date(item.data.startTime.seconds * 1000);
    const endDate = new Date(item.data.endTime.seconds * 1000);
    endDate.setHours(23, 59, 59, 999); 

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      if (unit === "day" && d.getDate() === targetDate.getDate() &&  d.getMonth() === targetDate.getMonth() && d.getFullYear() === targetDate.getFullYear()) {
        return true;
      } else if (unit === "month" && d.getMonth() === targetDate.getMonth() && d.getFullYear() === targetDate.getFullYear()) {
        return true;
      }
    }
    return false;
  })
}

export default filterSecondsByDate



