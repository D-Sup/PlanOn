const data = [
  {
    endTime: "16:00",
    memoContent: "헤헤",
    scheduleLocation: {
      lat: 37.54601289999999,
      placeId: 'ChIJ0ZINxtukfDURildN0FW56mk',
      lng: 127.076516,
      placeAddress: '대한민국 서울특별시 광진구 광나루로 424',
      placeName: '래빗홀 버거 Rabbithole Burger'
    },
    scheduleName: "레빗홀",
    selectedDay: "2024-05-21",
    startTime: "15:00"
  },
  {
    endTime: "00:00",
    memoContent: "",
    scheduleLocation: {
      placeAddress: '대한민국 서울특별시 광진구 구의동 232-83',
      placeId: 'ChIJ0VZGQSalfDURFRc2lSmncFg',
      lng: 127.0866982,
      lat: 37.5438865,
      placeName: '가현스시'
    },
    scheduleName: "스파게티",
    selectedDay: "2024-05-22",
    startTime: "00:00"
  }
];

const result = data.reduce((acc, curr) => {
  // selectedDay를 기준으로 객체를 분류
  if (!acc[curr.selectedDay]) {
    acc[curr.selectedDay] = {
      label: curr.selectedDay,
      value: []
    };
  }
  // 해당 일자의 배열에 현재 객체를 추가
  acc[curr.selectedDay].value.push(curr);
  return acc;
}, {});

// 객체 형태를 배열로 변환
const finalResult = Object.keys(result).map(key => result[key]);

console.log(finalResult);
