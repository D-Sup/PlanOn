import { useState, useEffect, useContext } from "react"
import { UserContext } from "../organisms/UserInfoProvider"
import { useNavigate } from "react-router-dom"
import useDebounce from "@/hooks/useDebounce"

import { useRecoilState, useResetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"
import { inputValue } from "@/store"

import UserService from "@/services/userService"
import LocationService from "@/services/locationService"
import HashtagService from "@/services/hashtagService"
import SearchHistoryService from "@/services/searchHistoryService"

import SlideTransition from "../organisms/SlideTransition"
import CategorySlider from "../organisms/CategorySlider"
import ListUnit from "../organisms/ListUnit"
import UserLinkListUnit from "../organisms/UserLinkListUnit"
import FixedTrigger from "../mocules/FixedTrigger"
import SearchBar from "../atoms/SearchBar"
import ListSkeleton from "../skeleton/ListSkeleton"

import { v4 as uuidv4 } from "uuid";

import { ReadDocumentType } from "@/hooks/useFirestoreRead"
import { UsersType } from "@/types/users.type"
import { HashtagsType } from "@/types/hashtags.type"

const SearchPage = () => {

  const navigate = useNavigate()

  const [inputValueState, setInputValueState] = useRecoilState(inputValue);
  const resetInputValue = useResetRecoilState(inputValue)
  const [routeDirectionValueState, setRouteDirectionValueState] = useRecoilState(routeDirectionValue)
  const lastRouteDirectionValueState = routeDirectionValueState.data[routeDirectionValueState.data.length - 1]
  const [progress, setProgress] = useState<number>(
    lastRouteDirectionValueState === "usertag" && 1 ||
    lastRouteDirectionValueState === "location" && 2 ||
    lastRouteDirectionValueState === "hashtag" && 3 || 0
  );

  const [direction, setDirection] = useState<"next" | "prev">("next");

  const { mutate } = SearchHistoryService()
  const { SearchUser } = UserService()
  const { data: userSearchData, isFetching: isUserFetching, refetch: refetchUser } = SearchUser()
  const { data: userData, isLoading } = useContext(UserContext);

  const { SearchPostLocation } = LocationService()
  const { data: LocationSearchData, isFetching: isLocationFetching, refetch: refetchLocation } = SearchPostLocation()

  const { SearchHashTag } = HashtagService()
  const { data: tagSearchData, isFetching: isTagFetching, refetch: refetchTag } = SearchHashTag()

  const { isInputDone, isFetching } = useDebounce(inputValueState, 500, progress === 1 && isUserFetching || progress === 2 && isLocationFetching || progress === 3 && isTagFetching);

  const { HistoryUnit, LocationLinkListUnit, HashTagLinkListUnit } = ListUnit();

  useEffect(() => {
    if (isInputDone) {
      if (progress === 1) {
        refetchUser()
      } else if (progress === 2) {
        refetchLocation();
      } else if (progress === 3) {
        refetchTag()
      }
    }
  }, [isInputDone, progress])

  const handleProgress = (index: number) => {
    if (index > progress) {
      setDirection("next")
    } else {
      setDirection("prev")
    }
    setProgress(index)
  }

  const data =
    progress === 1 && userSearchData
    || progress === 2 && LocationSearchData
    || progress === 3 && tagSearchData
    || []


  return (
    <>
      <FixedTrigger height={88} enableAnimation={false}>
        <div style={{ boxShadow: "0 1px var(--gray-heavy)" }}>
          <header className="pl-[15px] pr-[15px] flex items-center justify-center gap-[15px] w-screen min-h-[58px]">
            <div className="w-full"
              onFocus={() => {
                if (progress === 0 && inputValueState === "") {
                  setProgress(1)
                }
              }}>
              <SearchBar />
            </div>
            <button type="button" onClick={() => {
              setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev", data: [] }))
              resetInputValue()
            }}>
              <p className="w-[30px] text-md text-white">취소</p>
            </button>
          </header>
        </div>
        <div className="mt-[2px]">
          <CategorySlider progress={progress} handleProgress={handleProgress} />
        </div>
      </FixedTrigger>

      <SlideTransition className="px-[20px] py-[20px]" progress={progress} direction={direction} >

        {progress === 0 &&
          <>
            <span className="block text-lg text-white mb-[10px]">검색기록</span>
            {isLoading &&
              <ListSkeleton repeat={8} />
            }

            {userData?.data.searchHistory.length === 0 &&
              <span className="mt-[150px] block text-center text-nowrap text-md text-white">검색기록이 없습니다.</span>
            }
            {userData?.data.searchHistory.slice().reverse().map((history) => (
              <HistoryUnit key={history.id} data={history} handleFunc={[
                () => {
                  if (history.title) {
                    setProgress(history.type === "usertag" && 1 || history.type === "location" && 2 || history.type === "hashtag" && 3 || 0)
                    setInputValueState(history.title)
                  }
                },
                () => {
                  mutate({ type: "delete", searchHistory: history })
                }
              ]} />
            ))}
          </>
        }
        {isFetching && inputValueState ? (
          <ListSkeleton repeat={8} />
        ) : (
          <>
            {inputValueState && data?.map((singleData) => (
              progress === 1 &&
              <UserLinkListUnit key={singleData.id} data={singleData.data as UsersType}
                handleFunc={() => {
                  mutate({ type: "create", searchHistory: { id: uuidv4(), type: "usertag", title: inputValueState, createdAt: new Date() } })
                  setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, "usertag"] }))
                  navigate(`/profile/${singleData.data.authorizationId}`, { state: { direction: "next" } })
                }} /> ||
              progress === 2 &&
              <LocationLinkListUnit key={singleData.id} data={singleData as ReadDocumentType<HashtagsType>}
                handleFunc={() => {
                  mutate({ type: "create", searchHistory: { id: uuidv4(), type: "location", title: inputValueState, createdAt: new Date() } })
                  setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, "location"] }))
                  navigate("/post/collection", { state: { direction: "next", type: "location", data: singleData.data, title: singleData.id } })
                }} /> ||
              progress === 3 &&
              <HashTagLinkListUnit key={singleData.id} data={singleData as ReadDocumentType<HashtagsType>}
                handleFunc={() => {
                  mutate({ type: "create", searchHistory: { id: uuidv4(), type: "hashtag", title: inputValueState, createdAt: new Date() } })
                  setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, "hashtag"] }))
                  navigate("/post/collection", { state: { direction: "next", type: "hashtag", data: singleData.data, title: singleData.id } })
                }} />
            ))}
            {inputValueState && data?.length === 0 &&
              <span className="mt-[150px] block text-center text-nowrap text-md text-white">{`검색어와 일치하는 ${progress === 1 && "유저" || progress === 2 && "장소" || progress === 3 && "태그"}가 없습니다.`}</span>
            }
          </>
        )}
      </SlideTransition>
    </>
  )
}

export default SearchPage


