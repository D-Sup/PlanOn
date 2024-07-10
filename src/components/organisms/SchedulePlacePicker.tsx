import { useState } from "react"
import useModalStack from "@/hooks/useModalStack"

import { useResetRecoilState } from "recoil"
import { inputValue } from "@/store"

import LocationService from "@/services/locationService";

import SlideTransition from "../transitions/SlideTransition";
import LocationLinkList from "./LocationLinkList"
import MapOverview from "./MapOverview"
import Header from "./Header"
import ListUnitSkeleton from "../skeleton/ListUnitSkeleton"

import { produce } from "immer"

import { ScheduleFormValueType } from "@/store"

interface SchedulePlacePickerProps {
  props: React.Dispatch<React.SetStateAction<any>>
  closeModal: () => void,
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void,
  handleScrollLock: () => void,
}

const SchedulePlacePicker = ({ props, closeModal, handleScroll, handleScrollLock }: SchedulePlacePickerProps) => {

  const { openModal } = useModalStack();

  const resetInputValueState = useResetRecoilState(inputValue)

  const { readLocationDetail } = LocationService()

  const [progress, setProgress] = useState<number>(0)
  const [locationInfo, setLocationInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { MapViewHeaderForModal } = Header()

  const fetchLocationDetails = async (placeId: string) => {
    setLoading(true)
    try {
      const data = await readLocationDetail(placeId)
      if (data.status === "OK") {
        setLocationInfo(data.result);
        setLoading(false)
      } else {
        setLocationInfo(null);
        setLoading(false)
        setTimeout(() => openModal("Toast", { type: "fail", message: "위치정보가 없습니다." }), 100);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const handlePreviousProgress = () => {
    setProgress(0)
  }

  const handleNextProgress = (placeId: string) => {
    setProgress(1)
    fetchLocationDetails(placeId)
    handleScrollLock()
  }

  const handleSubmit = (data) => {
    const { name, formatted_address, place_id, geometry } = data;

    props((Prev: ScheduleFormValueType) =>
      produce(Prev, (draft) => {
        draft.scheduleLocation = {
          placeName: name,
          placeAddress: formatted_address,
          placeId: place_id,
          lat: geometry.location.lat,
          lng: geometry.location.lng,
        }
      }))
    closeModal()
    resetInputValueState()
  }


  return (
    <SlideTransition className="h-full" progress={progress} direction={"fade"}>
      {progress === 0 && <LocationLinkList handleFunc={[handleSubmit, handleNextProgress]} handleScroll={handleScroll} />}
      {progress === 1 &&
        <>
          <div className="px-[15px]">
            {loading
              ? (
                <ListUnitSkeleton className="pb-[10px]" />
              )
              : <MapViewHeaderForModal data={locationInfo} handleFunc={handlePreviousProgress} />
            }
          </div>
          <div className="relative h-[calc(100%-44px)]">
            <div className="w-full h-full">
              <MapOverview
                geometry={locationInfo?.geometry?.location}
                fetchLocationDetails={fetchLocationDetails}
              />
              <button onClick={() => handleSubmit(locationInfo)} className="absolute left-[20px] bottom-[15px] w-[calc(100%-40px)] h-[50px] rounded-[5px] bg-highlight text-black font-bold shadow-lg" type="button">
                선택완료
              </button>
            </div>
          </div>
        </>
      }
    </SlideTransition >
    // </div>
  )
}

export default SchedulePlacePicker;