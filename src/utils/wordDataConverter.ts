const wordDataConverter = (data: any, selectCase: number) => {

  const translateLocationType = (word: string) => {
    const dictionary: { [key: string]: string } = {
      "airport": "공항",
      "amusement park": "놀이공원",
      "aquarium": "수족관",
      "art gallery": "미술관",
      "ATM": "현금자동입출금기",
      "bakery": "빵집",
      "bank": "은행",
      "bar": "술집",
      "beauty salon": "미용실",
      "bicycle store": "자전거점",
      "book store": "서점",
      "bowling alley": "볼링장",
      "bus station": "버스터미널",
      "cafe": "카페",
      "campground": "캠핑장",
      "car dealer": "자동차딜러",
      "car rental": "자동차대여소",
      "car repair": "자동차수리점",
      "car wash": "세차장",
      "cemetery": "묘지",
      "church": "교회",
      "city hall": "시청",
      "clothing store": "의류점",
      "convenience store": "편의점",
      "courthouse": "법원",
      "dentist": "치과",
      "department store": "백화점",
      "doctor": "의사",
      "drugstore": "약국",
      "electrician": "전기공",
      "electronics store": "전자제품점",
      "embassy": "대사관",
      "fire station": "소방서",
      "florist": "꽃집",
      "funeral home": "장례식장",
      "furniture store": "가구점",
      "gas station": "주유소",
      "gym": "체육관",
      "hair care": "미용실",
      "hardware store": "철물점",
      "hindu temple": "힌두사원",
      "home goods store": "가정용품점",
      "hospital": "병원",
      "insurance agency": "보험사",
      "jewelry store": "보석점",
      "laundry": "세탁소",
      "lawyer": "변호사",
      "library": "도서관",
      "light rail station": "경전철역",
      "liquor store": "주류점",
      "local government office": "지방정부사무소",
      "locksmith": "자물쇠수리점",
      "lodging": "숙박시설",
      "meal delivery": "배달음식",
      "meal takeaway": "테이크아웃",
      "movie theater": "영화관",
      "moving company": "이사회사",
      "museum": "박물관",
      "night club": "나이트클럽",
      "painter": "도장",
      "park": "공원",
      "parking": "주차장",
      "pet store": "애완동물점",
      "pharmacy": "약국",
      "physiotherapist": "물리치료사",
      "police": "경찰서",
      "post office": "우체국",
      "primary school": "초등학교",
      "real estate agency": "부동산중개사",
      "restaurant": "음식점",
      "school": "학교",
      "secondary school": "중학교",
      "shoe store": "신발점",
      "shopping mall": "쇼핑몰",
      "spa": "스파",
      "stadium": "경기장",
      "storage": "창고",
      "store": "상점",
      "subway station": "지하철역",
      "supermarket": "슈퍼마켓",
      "taxi stand": "택시승강장",
      "tourist attraction": "관광명소",
      "train station": "기차역",
      "transit station": "환승역",
      "travel agency": "여행사",
      "university": "대학교",
      "zoo": "동물원"
    }
    return dictionary[word] || "";
  }
  
  const translateLocationOption = (options: any) => {
    const dictionary: { [key: string]: string } = {
      "reservable": "예약가능",
      "delivery": "배달가능",
      "dine_in": "매장 내 식사",
      "curbside_pickup": "매장 밖 수령",
      "takeout": "매장 밖 수령",
      "serves_breakfast": "아침식사",
      "serves_lunch": "점심식사",
      "serves_dinner": "저녁식사",
      "serves_brunch": "브런치",
      "serves_beer": "주류 판매",
      "serves_wine": "주류 판매",
    }
    const result = [];
    for (const key in options) {
      if (options[key] === true && dictionary[key]) {
        result.push(dictionary[key]);
      }
    }
    return result;
  }

  const translateOperationInfo = (operationInfo: {weekday_text: string[]}) => {
    const days = [6, 0, 1, 2, 3, 4, 5];
    const today = new Date();
    const currentHours = today.getHours();
    const currentMinutes = today.getMinutes();
    const currentTime = currentHours * 60 + currentMinutes;
    const todayOperationInfo = operationInfo.weekday_text[days[today.getDay()]]
  
    const convertTo24Hours = (time) => {
      const match = time.match(/(오전|오후) (\d+):(\d+)/);
      if (!match) return null;
      let [_, period, hours, minutes] = match;
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);
      if (period === "오후" && hours !== 12) hours += 12;
      if (period === "오전" && hours === 12) hours = 0;

      return hours * 60 + minutes;
    }
  
    const times = todayOperationInfo.split(", ").map(time => time.replace(/.+?: /, ""));
    for (let i = 0; i < times.length; i++) {
      const time = times[i];
      if (time === "휴무일" || time === "24시간 영업") return time;
      const periods = time.split("~").map(t => t.trim()); // 영업시간 범위
      const start = convertTo24Hours(periods[0]);
      const end = periods[1] ? convertTo24Hours(periods[1]) : null;
      if (currentTime < start) return periods[0] + " 영업시작";
      if (end && currentTime >= start && currentTime < end) {
        return times.slice(i).join(", ").replace(periods[0] + " ~ ", "") + " 영업종료";
      }
    }

    return ""
  }
  
	switch(selectCase) {
		case 1:
			return translateLocationType(data);
		case 2:
			return translateLocationOption(data);
		case 3:
			return translateOperationInfo(data);
    default: 
			return "";
	}
}

export default wordDataConverter