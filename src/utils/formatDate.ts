import { Timestamp } from "firebase/firestore";

const formatDate = (data: Timestamp | Date | string, selectCase: number) => {

	let date;
	try {
		date = typeof data === "string" 
		? new Date(data) 
		: data instanceof Date ? data 
		: data.toDate();
	} catch (error) {
		const NS_TO_MS_MULTIPLIER = 1/1000000
		const SEC_TO_MS_MULTIPLIER = 1000
		if (typeof data !== "string" && "seconds" in data && "nanoseconds" in data) {
			const timestampInMilliseconds = data.seconds * SEC_TO_MS_MULTIPLIER + data.nanoseconds * NS_TO_MS_MULTIPLIER
			date = new Date(timestampInMilliseconds)
		}
	}

	const days = ["일", "월", "화", "수", "목", "금", "토"];

	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const dayOfWeek = days[date.getDay()]
	
	const convertToHourDate = (isMilitaryTime: boolean) => {
		const hours = date.getHours()
		const minutes = date.getMinutes()

		if(isMilitaryTime) {
			const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
			const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
			return `${formattedHours}:${formattedMinutes}`;
		} else {
			let period = "오전";
			let hourToShow = hours;
			if (hours >= 12) {
				period = "오후";
				if (hours > 12) hourToShow = hours - 12;
			}
			return `${period} ${hourToShow}:${minutes < 10 ? "0" : ""}${minutes}`;
		}
	}

	const convertToRelativeDate = () => {
		const now = new Date();
		const diffTime = date.getTime() - now.getTime();
		const diffMinutes = Math.ceil(diffTime / (1000 * 60));
		const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	
		let relativeDate = "";
	
		if (diffDays === 0) {
			if (diffHours === 0) {
				if (diffMinutes === 0) {
					relativeDate = "방금 전";
				} else {
					relativeDate = `${Math.abs(diffMinutes)}분 전`;
				}
			} else {
				relativeDate = `${Math.abs(diffHours)}시간 전`;
			}
		} else if (diffDays === 1) {
			relativeDate = "내일";
		} else if (diffDays === -1) {
			relativeDate = "어제";
		} else if (diffDays > 1 && diffDays < 7) {
			relativeDate = `${diffDays}일 후`;
		} else if (diffDays < -1 && diffDays > -7) {
			relativeDate = `${Math.abs(diffDays)}일 전`;
		} else {
			const diffWeeks = Math.floor(diffDays / 7);
			if (diffDays > 0) {
				relativeDate = `${diffWeeks}주 후`;
			} else {
				relativeDate = `${Math.abs(diffWeeks)}주 전`;
			}
		}
		return `${relativeDate}`;
	}

	switch(selectCase) {
		case 1:
			return `${year - 2000}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
		case 2:
			return `${year}.${month}.${day}`;
		case 3:
			return `${month}.${day}`;
		case 4:
			return `${year}-${`${month}`.padStart(2, "0")}-${`${day}`.padStart(2, "0")}`;
		case 5:
			return `${dayOfWeek} ${month}/${day}`;
		case 6:
			return `${day}일 ${dayOfWeek}요일`;
		case 7:
			return convertToHourDate(false);
		case 8:
			return convertToHourDate(true);
		case 9:
			return convertToRelativeDate();
		default: 
			return "";
	}
}

export default formatDate