import { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useModalStack from "@/hooks/useModalStack";

import { useResetRecoilState, useRecoilState } from "recoil";
import { inputValue, routeDirectionValue } from "@/store";

import ImageSlider from "../mocules/ImageSlider";
import ProfileCard from "../mocules/ProfileCard";
import RateIndicator from "../atoms/RateIndicator"

import wordDataConverter from "@/utils/wordDataConverter";

import IconLocation from "../../assets/images/icon-location.svg?react";
import IconClock from "../../assets/images/icon-clock.svg?react";
import IconPhone from "../../assets/images/icon-phone.svg?react";
import IconCopy from "../../assets/images/icon-copy.svg?react";
import IconCheck from "../../assets/images/icon-check.svg?react";
import IconDiagonalArrow from "../../assets/images/icon-diagonal-arrow.svg?react";
import IconArrow from "../../assets/images/icon-arrow-bottom.svg?react";

import iconkakaoMap from "../../assets/images/icon-kakao-map.png";
import iconNaverMap from "../../assets/images/icon-naver-map.png";

const LocalPointDetailPage = () => {

  const resetInputValueState = useResetRecoilState(inputValue)
  const [routeDirectionValueState, setRouteDirectionValueState] = useRecoilState(routeDirectionValue)

  const navigate = useNavigate();
  const location = useLocation();
  const locationInfo = location.state?.locationInfo;

  const formattedAddress = useRef<HTMLInputElement>(null);
  const shareLink = useRef<HTMLInputElement>(null);

  const { openModal } = useModalStack();

  const handleCopyClipBoard = (type: boolean) => {
    if (type && formattedAddress.current) {
      formattedAddress.current.select();
    } else if (!type && shareLink.current) {
      shareLink.current.select();
    }
    document.execCommand("copy");
    openModal("Toast", { message: type ? "복사완료" : "공유 링크 복사 완료" });
  };

  const handleSubmit = (data) => {
    const { name, formatted_address, place_id, geometry } = data;
    navigate("/schedule/update", {
      state: {
        direction: "down",
        scheduleLocation: {
          placeName: name,
          placeAddress: formatted_address,
          placeId: place_id,
          lat: geometry.location.lat,
          lng: geometry.location.lng,
        }
      }
    })
    setRouteDirectionValueState(Prev => ({ ...Prev, direction: "down" }))
    resetInputValueState()
  }

  const { photos, name, types, rating, user_ratings_total, formatted_address, international_phone_number, opening_hours, reviews, place_id } = locationInfo

  const locationOptions = wordDataConverter(locationInfo, 2) as string[];

  return (
    <div className="min-h-dvh bg-background">
      <button
        onClick={() => {
          navigate("/map", {
            state: {
              locationInfo,
              direction: "down"
            }
          })
        }}
        className="fixed top-[10px] left-[15px] z-10 w-[40px] h-[40px] rounded-[10px] flex items-center gap-[10px] bg-white backdrop-blur-sm"
        style={{ backgroundColor: "rgba(26,26,26, 0.5)" }}
      >
        <IconArrow className="absolute-center" width={17} height={17} fill={"#FFF"} />
      </button>
      <ImageSlider
        data={{ locationInfo }}
        ratio={"16/10"}
        photos={
          photos
            ? photos.map((photo) => (`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`))
            : [""]
        }
      />

      <div className="relative mt-[-5px] px-[15px] py-[10px] rounded-t-[5px] bg-background overflow-hidden">

        <div className="absolute right-[15px] flex items-center gap-[10px]">
          <span className="text-sm text-white">{opening_hours ? opening_hours.open_now ? "영업중" : "영업 중이 아님" : "영업정보 없음"}</span>
          <div className={`w-[12px] h-[12px] rounded-full ${opening_hours ? opening_hours.open_now ? "bg-green" : "bg-red" : "bg-gray-old"}`}
            style={{ boxShadow: `0 0 4px ${opening_hours ? opening_hours.open_now ? "var(--green)" : "var(--red)" : "var(--gray-old)"}` }}></div>
        </div>

        <span className="text-md text-gray-old">{wordDataConverter(types[0], 1)}</span>
        <strong className="block mb-[5px] text-xlg text-white">{name}</strong>
        <RateIndicator rating={rating} reviews={user_ratings_total} />

        <section className="mt-[30px] flex flex-col gap-[15px]">
          <div className="flex items-center text-sm text-gray">
            <IconLocation width={17} height={17} fill={"var(--gray-old)"} className="min-w-[17px]" />
            <span className="ml-[10px]">{formatted_address.replace("대한민국 ", "")}</span>
            <button onClick={() => handleCopyClipBoard(true)} className="ml-[10px] text-red" type="button">
              <IconCopy width={12} height={12} fill={"var(--gray-old)"} />
            </button>
          </div>

          {international_phone_number &&
            <div className="flex items-center text-sm text-gray">
              <IconPhone width={17} height={17} fill={"var(--gray-old)"} />
              <span className="ml-[10px]">{international_phone_number}</span>
            </div>
          }

          <div className="flex text-sm text-gray leading-6">
            <IconClock className="mt-[3px]" width={17} height={17} fill={"var(--gray-old)"} />
            <span className="ml-[10px]">
              {opening_hours
                ? opening_hours.weekday_text.map((time: string) => (
                  <span>{time} <br /></span>
                ))
                : <span>영업정보 없음</span>
              }
            </span>
          </div>
        </section>

        <section className="my-[30px]">
          {locationOptions.length !== 0 &&
            <>
              <p className="text-lg text-white ">위치정보</p>
              <ul className="mt-[15px] w-9/12 grid grid-cols-2 gap-[10px]">
                {locationOptions.map(locationOption => (
                  <li className="flex items-end gap-[10px]">
                    <IconCheck className="mt-[3px]" width={17} height={17} fill={"var(--white)"} />
                    <span className="text-sm text-white">{locationOption}</span>
                  </li>
                ))}
              </ul>
            </>
          }
        </section>

        {reviews &&
          <section>
            <p className="text-lg text-white ">리뷰</p>
            <ul className="mt-[15px] pb-[20px] flex items-start gap-[15px] overflow-x-scroll" >
              {reviews.map((review) => (
                <li className="p-[10px] flex flex-col gap-[10px] min-w-[80%] rounded-[5px] bg-input">
                  <ProfileCard title={review.author_name} description={review.relative_time_description} src={review.profile_photo_url} />
                  <RateIndicator rating={review.rating} flexReverse={true} />
                  <span className="block text-sm text-gray">
                    {review.text}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        }

        <div className="mt-[10px] mb-[30px] flex">
          <a href={`https://m.map.kakao.com/actions/searchView?q=${formatted_address}`} className="flex-center gap-[10px] w-1/2 h-[30px]" type="button" target="_blank">
            <img className="w-[15px] h-[15px]" src={iconkakaoMap} alt="kakaoMap-icon" />
            <span className="text-lg text-white">카카오지도</span>
            <IconDiagonalArrow width={12} height={12} fill={"var(--white)"} />
          </a>

          <a href={`https://m.map.naver.com/search2/search.naver?query=${formatted_address}`} className="flex-center gap-[10px] w-1/2 h-[30px]" type="button" target="_blank">
            <img className="w-[15px] h-[15px]" src={iconNaverMap} alt="kakaoMap-icon" />
            <span className="text-lg text-white">네이버지도</span>
            <IconDiagonalArrow width={12} height={12} fill={"var(--white)"} />
          </a>
        </div>

        {routeDirectionValueState.previousPageUrl.includes("/schedule/update")
          ? <button onClick={() => handleSubmit(locationInfo)} className="w-full h-[50px] rounded-[5px] bg-white text-black font-bold" type="button">선택완료</button>
          : <button onClick={() => handleCopyClipBoard(false)} className="w-full h-[50px] rounded-[5px] bg-white text-black font-bold" type="button">위치공유</button>
        }
        <input ref={shareLink} className="a11y-hidden" value={`https://plan-on.vercel.app/map/${place_id}`} readOnly />
        <input ref={formattedAddress} className="a11y-hidden" value={formatted_address.replace("대한민국 ", "")} readOnly />
      </div>
    </div>
  )
}

export default LocalPointDetailPage
