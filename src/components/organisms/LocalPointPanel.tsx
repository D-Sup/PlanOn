import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import useModalStack from "@/hooks/useModalStack";

import ImageFrame from "../atoms/ImageFrame"
import RateIndicator from "../atoms/RateIndicator"

import wordDataConverter from "@/utils/wordDataConverter";

import IconLocation from "../../assets/images/icon-location.svg?react";
import IconClock from "../../assets/images/icon-clock.svg?react";
import IconDirect from "../../assets/images/icon-direct.svg?react";

import IconPicture from "../../assets/images/icon-picture.svg?react";
import iconkakaoMap from "../../assets/images/icon-kakao-map.png";
import iconNaverMap from "../../assets/images/icon-naver-map.png";

const LocalPointPanel = ({ locationInfo }: { locationInfo: any }) => {

  const { photos, name, types, rating, user_ratings_total, formatted_address, opening_hours } = locationInfo

  const navigate = useNavigate();

  const formattedAddress = useRef<HTMLInputElement>(null);

  const { openModal } = useModalStack();

  const handleCopyClipBoard = () => {
    if (formattedAddress.current) {
      formattedAddress.current.select();
      document.execCommand("copy");
      openModal("Toast", { message: "복사완료" });
    }
  };

  return (
    <div className="flex w-full h-[160px] rounded-[10px] overflow-hidden bg-[#FFF] shadow-lg">
      <div className="relative flex-shrink-0 w-2/5 object-cover bg-input">
        {photos
          ? (
            <ImageFrame
              className="min-w-2/5 max-w-2/5"
              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
              alt={photos[0].photo_reference}
            />
          ) : (
            <IconPicture className="w-2/3 absolute-center" fill={"var(--white)"} />
          )
        }

      </div>

      <div className="relative w-3/5">
        <div className="px-[15px] py-[10px]">
          <strong className="text-lg text-[#000] reduce-words max-w-[80%]">{name}</strong>
          <span className="mb-[5px] block h-[15px] text-xsm text-gray-old">{wordDataConverter(types[0], 1)}</span>
          <RateIndicator rating={rating} reviews={user_ratings_total} />

          <div className="flex items-center my-[5px] text-xsm text-gray-old">
            <IconLocation width={17} height={17} fill={"var(--gray-old)"} />
            <span className="ml-[5px] reduce-words max-w-[70%]">{formatted_address.replace("대한민국 ", "")}</span>
            <input ref={formattedAddress} className="a11y-hidden" value={formatted_address.replace("대한민국 ", "")} readOnly />
            <button onClick={handleCopyClipBoard} className="ml-[5px] text-red" type="button">복사</button>
          </div>

          <div className="flex items-center text-xsm text-gray-old">
            <IconClock width={17} height={17} fill={"var(--gray-old)"} />
            {opening_hours ?
              <>
                <span className={`ml-[5px] reduce-words max-w-[70%] ${opening_hours.open_now ? "text-green" : "text-red"}`}>{opening_hours.open_now ? "영업중" : "영업 중이 아님"}</span>
                <span className="ml-[5px] reduce-words max-w-[70%]">{wordDataConverter(opening_hours, 3)}</span>
              </>
              : <span className="ml-[5px]">영업정보 없음</span>
            }
          </div>
        </div>

        <a href={`https://m.map.kakao.com/actions/searchView?q=${formatted_address}`} className="absolute bottom-0 flex-center gap-[5px] w-1/2 h-[30px]" type="button" style={{ boxShadow: "0.5px -1px var(--gray-light)" }} target="_blank">
          <img className="w-[15px] h-[15px]" src={iconkakaoMap} alt="kakaoMap-icon" />
          <span className="text-sm text-gray-old">카카오지도</span>
        </a>

        <a href={`https://m.map.naver.com/search2/search.naver?query=${formatted_address}`} className="absolute right-0 bottom-0 flex-center gap-[5px] w-1/2 h-[30px]" type="button" style={{ boxShadow: "-0.5px -1px var(--gray-light)" }} target="_blank">
          <img className="w-[15px] h-[15px]" src={iconNaverMap} alt="kakaoMap-icon" />
          <span className="text-sm text-gray-old">네이버지도</span>
        </a>

        <button
          className="absolute top-[15px] right-[15px]"
          type="button"
          onClick={() => {
            navigate("/map/details", {
              state: {
                locationInfo,
                direction: "up"
              }
            })
          }}
        >
          <IconDirect width={15} height={15} fill={"var(--gray-old)"} />
        </button>

      </div>
    </div >
  )
}

export default LocalPointPanel
