import { useState, useEffect } from "react";

import { useSetRecoilState } from "recoil";
import { routeDirectionValue, paginationValue } from "@/store";

import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";
import getAccountId from "@/utils/getAccountId";

import PostProgressIndicator from "../organisms/PostProgressIndicator"
import SlideTransition from "../transitions/SlideTransition";

import IconLogo from "../../assets/images/icon-logo.svg?react";
import IconHome from "../../assets/images/icon-edit.svg?react";
import IconClock from "../../assets/images/icon-clock.svg?react";
import IconMessage from "../../assets/images/icon-message.svg?react";
import IconLocation from "../../assets/images/icon-location.svg?react";
import IconMap from "../../assets/images/icon-map.svg?react";
import IconHeart from "../../assets/images/icon-fill-heart.svg?react";
import IconShare from "../../assets/images/icon-share.svg?react";
import IconSearch from "../../assets/images/icon-search.svg?react";
import IconSetting from "../../assets/images/icon-setting.svg?react";

import guidePhotoFirst from "../../assets/images/guide-1.png";
import guidePhotoSecond from "../../assets/images/guide-2.png";


const TutorialPage = () => {
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)
  const setPaginationValueState = useSetRecoilState(paginationValue)
  const [progress, setProgress] = useState<number>(0);
  const [isWait, setIsWait] = useState<boolean>(true);

  const { updateField } = useFirestoreUpdate("users")

  const accountId = getAccountId()

  const steps = [
    { progressCheck: 0, description: "" },
    { progressCheck: 1, description: "" },
    { progressCheck: 2, description: "" },
    { progressCheck: 3, description: "" },
  ];
  const [filterTags, setFilterTags] = useState<string[]>([]);

  const hashtags = ["영화", "드라마", "웹툰", "만화", "게임", "스포츠", "뮤지컬", "연극", "요리", "맛집", "카페", "커피", "와인", "쇼핑", "메이크업", "스킨케어", "다이어트", "필라테스", "헬스", "요가", "강아지", "고양이", "뉴스"]

  useEffect(() => {
    setTimeout(() => setIsWait(false), 500)
  }, [])

  if (isWait) return <div className="w-full h-dvh bg-background"></div>

  return (
    <>
      <IconLogo width={40} height={40} fill={"var(--white)"} className="absolute top-[30px] right-[20px] opacity-0 animate-show-content-1" />
      <div className="w-1/2 mt-[30px] ml-[15px] opacity-0 animate-show-content-1 bg-background">
        <PostProgressIndicator progress={progress} steps={steps} />
      </div>

      <SlideTransition className="px-[20px] bg-background" progress={progress} direction={"next"} >

        {progress === 0 &&
          <div className="flex flex-col gap-[10px] pb-[10px]">
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
                  <span className="text-sm text-black">플랜온</span>
                </div>
              </div>
            </div>
          </div>
        }

        {progress === 1 &&
          <div className="flex flex-col">
            <div className="mb-[20px] opacity-0 animate-show-content-2">
              <span className="text-white text-lg font-bold">플랜온은</span>
              <p className="text-white text-2xl font-bold">이런 기능이 유용해요</p>
            </div>

            <ul className="grid grid-cols-3 gap-2 w-full">
              <li className="w-full flex-center flex-col gap-[10px] aspect-square bg-white rounded-lg text-black text-md opacity-0 animate-quick-show-content-1">
                <IconHome width={20} height={20} fill={"var(--black)"} />
                게시글 작성
              </li>
              <li className="w-full flex-center flex-col gap-[10px] aspect-square bg-white rounded-lg text-black text-md opacity-0 animate-quick-show-content-1">
                <IconClock width={20} height={20} fill={"var(--black)"} />
                일정관리
              </li>
              <li className="w-full flex-center flex-col gap-[10px] aspect-square bg-white rounded-lg text-black text-md opacity-0 animate-quick-show-content-1">
                <IconMessage width={20} height={20} fill={"var(--black)"} />
                소통
              </li>
              <li className="w-full flex-center flex-col gap-[10px] aspect-square bg-white rounded-lg text-black text-md opacity-0 animate-quick-show-content-2">
                <IconMap width={20} height={20} fill={"var(--black)"} />
                로드맵
              </li>
              <li className="w-full flex-center flex-col gap-[10px] aspect-square bg-input rounded-lg text-white text-md opacity-0 animate-quick-show-content-2">
                <IconShare width={20} height={20} fill={"var(--white)"} />
                공유
              </li>
              <li className="w-full flex-center flex-col gap-[10px] aspect-square bg-input rounded-lg text-white text-md opacity-0 animate-quick-show-content-2">
                <IconHeart width={20} height={20} fill={"var(--white)"} />
                좋아요
              </li>
              <li className="w-full flex-center flex-col gap-[10px] aspect-square bg-white rounded-lg text-black text-md opacity-0 animate-quick-show-content-3">
                <IconLocation width={20} height={20} fill={"var(--black)"} />
                위치정보
              </li>
              <li className="w-full flex-center flex-col gap-[10px] aspect-square bg-input rounded-lg text-white text-md opacity-0 animate-quick-show-content-3">
                <IconSearch width={20} height={20} fill={"var(--white)"} />
                검색
              </li>
              <li className="w-full flex-center flex-col gap-[10px] aspect-square bg-white rounded-lg text-black text-md opacity-0 animate-quick-show-content-3">
                <IconSetting width={20} height={20} fill={"var(--black)"} />
                커스텀 설정
              </li>
            </ul>
          </div>
        }

        {progress === 2 &&
          <>
            <div className="mb-[20px] opacity-0 animate-show-content-2">
              <p className="text-white text-2xl font-bold">관심사가 무엇인가요?</p>
              <span className="text-white text-sm font-bold">선택 후 주제별 게시글을 모아볼 수 있어요.</span>
            </div>

            <ul className="flex flex-wrap gap-[10px] mt-[10px] pb-[5px] w-full opacity-0 animate-show-content-3">
              {hashtags.map((hashtag) => (
                <button
                  key={hashtag}
                  type="button"
                  className={`px-[15px] py-[5px] text-md rounded-md transition duration-100 ${filterTags.includes(hashtag) ? "bg-white text-black" : "bg-input text-white"}`}
                  onClick={() => {
                    setFilterTags(Prev => {
                      if (filterTags.includes(hashtag)) {
                        return Prev.filter(tag => tag !== hashtag)
                      } else {
                        return [...Prev, hashtag]
                      }
                    })
                  }}
                >
                  <span>{`# ${hashtag}`}</span>
                </button>
              ))}
            </ul>
          </>
        }

        {progress === 3 &&
          <div className="relative flex-center flex-col h-[calc(100dvh-195px)]">
            <IconLogo fill={"var(--white)"} className="w-3/4 h-3/4 opacity-0 animate-show-content-2 blur-3xl blur-effect" />
            <div className="absolute-center">
              <h2 className="text-[#FFF] text-lg opacity-0 animate-show-content-3 text-nowrap font-bold">당신의 하루를 계획하고, 공유하세요!</h2>
            </div>
          </div>
        }

      </SlideTransition>


      <div className="fixed left-0 bottom-0 px-[20px] pt-[10px] pb-[20px] w-full opacity-0 animate-quick-show-content-4 bg-background">
        <button
          type="button"
          className="w-full h-[50px] rounded-[10px] bg-white text-lg text-black font-bold"
          onClick={() => {
            if (progress === 3) {
              if (filterTags.length !== 0) {
                (async () => {
                  const updated = await updateField(accountId, { isFirstEntry: false, filterTags: filterTags });
                  if (updated) {
                    setPaginationValueState({
                      currentCategory: "tag-posts",
                      posts: {
                        lastVisible: null,
                        isDataEnd: false
                      },
                    })
                    setRouteDirectionValueState(Prev => ({ ...Prev, direction: "down" }))
                  }
                })()
              }
            } else {
              setProgress(Prev => Prev + 1)
            }
          }}
        >
          {progress === 3 ? "시작하기" : "계속하기"}
        </button>
        <span className="mt-[10px] block text-gray-old text-center text-sm" onClick={() => {
          setRouteDirectionValueState(Prev => ({ ...Prev, direction: "down" }))
          updateField(accountId, { isFirstEntry: false })
        }}>{"건너뛰기 >"}</span>
      </div>
      <div className="w-screen min-h-[108px]"></div>
    </>
  )
}

export default TutorialPage