import { useNavigate } from "react-router-dom"

import IconLogo from "../../assets/images/icon-logo.svg?react";

import IconArrow from "../../assets/images/icon-arrow-left.svg?react";
import IconArrowBottom from "../../assets/images/icon-arrow-bottom.svg?react";

import guidePhotoFirst from "../../assets/images/guide-1.png";
import guidePhotoSecond from "../../assets/images/guide-2.png";


const DownloadGuidePage = () => {
  const navigate = useNavigate()

  return (
    <div className="p-[30px] flex flex-col gap-[30px]">


      <button
        className="relative mr-auto min-w-[38px] min-h-[38px] bg-white rounded-[10px]"
        type="button" onClick={() => {
          navigate(-1)
        }}>
        <IconArrow className="absolute-center" width={7} height={12} fill={"var(--black)"} />
      </button>

      <div className="opacity-0 animate-show-content-2">
        <span className="text-white text-sm font-bold">앱 스토어 다운로드 없이</span>
        <p className="text-white text-2xl font-bold">앱을 설치하세요!</p>
      </div>

      <div className="px-[15px] py-[15px] bg-input rounded-lg opacity-0 animate-quick-show-content-1">
        <div className="flex items-center gap-[10px] mb-[15px]">
          <div
            className={`relative h-[20px] w-[20px] rounded-full transition duration-300 border text-md text-center text-highlight border-highlight`}
            style={{ backgroundColor: "rgba(211,255,99,0.2)" }}
          >
            <span className={`absolute-center "text-highlight text-xsm`}>{1}</span>
          </div>
          <span className="text-sm text-white">브라우저 하단 <strong className="text-highlight">공유 버튼탭 </strong>누르기</span>
        </div>
        <div className="relative p-[10px] rounded-lg" style={{ backgroundColor: "rgb(40,40,40)" }}>
          <img className="w-full" src={guidePhotoFirst} alt={"first-guide"} />
          <div className="absolute-center  w-[40px] h-[40px] rounded-[5px]" style={{ backgroundColor: "rgba(211,255,99,0.2)" }}></div>
        </div>
      </div>

      <div className="px-[15px] py-[15px] bg-input rounded-lg opacity-0 animate-quick-show-content-2">
        <div className="flex items-center gap-[10px] mb-[15px]">
          <div
            className={`relative h-[20px] w-[20px] rounded-full transition duration-300 border text-md text-center text-highlight border-highlight`}
            style={{ backgroundColor: "rgba(211,255,99,0.2)" }}
          >
            <span className={`absolute-center "text-highlight text-xsm`}>{2}</span>
          </div>
          <span className="text-sm text-white"><strong className="text-highlight">홈화면에 추가</strong> 누르기</span>
        </div>
        <div className="relative p-[10px] rounded-lg" style={{ backgroundColor: "rgb(60,61,63)" }}>
          <img className="w-full" src={guidePhotoSecond} alt={"first-guide"} />
          <div className="absolute-center w-[calc(100%-20px)] h-[calc(100%-20px)] rounded-[5px]" style={{ backgroundColor: "rgba(211,255,99,0.2)" }}></div>
        </div>
      </div>

      <div className="px-[15px] py-[15px] bg-input rounded-lg opacity-0 animate-quick-show-content-3">
        <div className="flex items-center gap-[10px] mb-[15px]">
          <div
            className={`relative h-[20px] w-[20px] rounded-full transition duration-300 border text-md text-center text-highlight border-highlight`}
            style={{ backgroundColor: "rgba(211,255,99,0.2)" }}
          >
            <span className={`absolute-center "text-highlight text-xsm`}>{3}</span>
          </div>
          <span className="text-sm text-white">추가된 <strong className="text-highlight">앱 실행</strong></span>
        </div>
        <div className="relative p-[10px] rounded-lg bg-white">
          <div className="bg-white w-full h-[50px]">
          </div>
          <div className="absolute-center flex-center flex-col gap-[1px]">
            <div className="bg-background p-[8px] rounded-[5px]">
              <IconLogo fill={"var(--white)"} width={20} height={20} />
            </div>
            <span className="text-sm">플랜온</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-[10px] left-1/2 -translate-x-1/2 opacity-0 animate-infinite-down">
        <IconArrowBottom width={20} height={20} fill={"var(--white)"} className="absolute-center" />
      </div>

    </div>
  )
}

export default DownloadGuidePage