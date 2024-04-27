import { useEffect } from "react";
import { useRecoilValue } from "recoil"
import { inputValue, routeDirectionValue } from "@/store";
import useDebounce from "@/hooks/useDebounce";

import LocationService from "@/services/locationService";

import FixedTrigger from "../mocules/FixedTrigger";
import ProfileCard from "../mocules/ProfileCard";
import SearchBar from "../atoms/SearchBar";
import ListUnit from "./ListUnit";
import ListSkeleton from "../skeleton/ListSkeleton";

import IconLocation from "../../assets/images/icon-location.svg?react";
import IconArrow from "../../assets/images/icon-arrow-right.svg?react";

interface LocationLinkListProps {
  handleFunc: [(data: any) => void, (placeId: string) => void],
  handleScroll?: (e: React.UIEvent<HTMLDivElement>) => void,
  isSearchable?: boolean
}

const LocationLinkList = ({ handleFunc, handleScroll, isSearchable = true }: LocationLinkListProps) => {

  const inputValueState = useRecoilValue(inputValue)
  const routeDirectionValueState = useRecoilValue(routeDirectionValue)

  const { SearchLocation } = LocationService()
  const { data, isFetching: isFetchingSearchLocation, refetch } = SearchLocation()

  const { isInputDone, isFetching } = useDebounce(inputValueState, 500, isFetchingSearchLocation);

  const { LocationDetailLinkListUnit } = ListUnit()

  useEffect(() => {
    if (isInputDone) {
      refetch()
    }
  }, [isInputDone])

  return (
    <>
      {isSearchable &&
        <FixedTrigger height={58} className="border-b-[1px] border-gray-heavy" enableAnimation={false}>
          <header className="px-[30px] flex justify-center gap-[15px] w-screen min-h-[58px] ">
            <SearchBar />
          </header>
        </FixedTrigger>
      }

      {isFetching && inputValueState ? (
        <ListSkeleton className="py-[10px] px-[30px]" repeat={7} />
      ) : (
        <div className={`py-[10px] px-[30px] overflow-y-scroll ${isSearchable && "h-[calc(100%-58px)]"}`} onScroll={handleScroll}>
          {inputValueState && data?.map((singleLocation, index: number) => (
            routeDirectionValueState.previousPageUrl.includes("/schedule/update") || location.pathname === "/schedule/update"
              ? <LocationDetailLinkListUnit key={index} data={singleLocation} handleFunc={handleFunc} />
              : <li
                key={index}
                className="w-full flex items-center justify-between py-[10px]"
                style={{ boxShadow: "0 1px var(--gray-heavy)" }}
                onClick={() => handleFunc[1](singleLocation.place_id)}
              >
                <ProfileCard title={singleLocation.name} description={singleLocation.formatted_address} src={IconLocation} />
                <IconArrow width={7} height={12} fill={"var(--white)"} className="mr-[10px]" />
              </li>
          ))}
        </div>
      )}
    </>
  )
}

export default LocationLinkList