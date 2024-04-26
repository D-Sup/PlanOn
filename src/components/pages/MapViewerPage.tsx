import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useModalStack from "@/hooks/useModalStack";

import { useResetRecoilState, useSetRecoilState } from "recoil";
import { inputValue, routeDirectionValue } from "@/store";

import LocationService from "@/services/locationService";

import MapOverview from "../organisms/MapOverview"
import LocationLinkList from "../organisms/LocationLinkList";
import LocalPointPanel from "../organisms/LocalPointPanel";
import Header from "../organisms/Header";

import { Skeleton } from "../shadcnUIKit/skeleton";

const MapViewerPage = () => {

  const { openModal } = useModalStack();

  const location = useLocation();
  const navigate = useNavigate()

  const { readLocationDetail } = LocationService()

  const resetInputValueState = useResetRecoilState(inputValue)
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const [locationInfo, setLocationInfo] = useState<any>(location.state?.locationInfo);
  const [loading, setLoading] = useState<boolean>(false);

  const currentLocationRef = useRef<HTMLButtonElement | null>(null);
  const locationLinkListRef = useRef<HTMLDivElement | null>(null);

  const { MapViewHeader } = Header()

  const onLocationLinkList = () => {
    if (locationLinkListRef.current && currentLocationRef.current) {
      locationLinkListRef.current.style.transform = "translateY(0)";
      currentLocationRef.current.style.bottom = "63%"
    }
  }

  const offLocationLinkList = () => {
    if (locationLinkListRef.current && currentLocationRef.current) {
      locationLinkListRef.current.style.transform = "translateY(100%)";
    }
  }

  const fetchLocationDetails = async (placeId: string) => {
    if (currentLocationRef.current) {
      currentLocationRef.current.style.bottom = "200px"
    }
    offLocationLinkList()
    setLoading(true)
    try {
      const data = await readLocationDetail(placeId)
      if (data.status === "OK") {
        setLocationInfo(data.result);
        setLoading(false)
        if (currentLocationRef.current) {
          currentLocationRef.current.style.bottom = "200px"
        }
      } else {
        setLocationInfo(null);
        setLoading(false)
        setTimeout(() => openModal("Toast", { type: "fail", message: "위치정보가 없습니다." }), 100);
        if (currentLocationRef.current) {
          currentLocationRef.current.style.bottom = "20px"
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleGoBack = () => {
    setRouteDirectionValueState(Prev => ({ ...Prev, direction: Prev.previousPageUrl.includes("/post/update") ? "down" : "fade" }))
    resetInputValueState()
  }

  const handleSubmitForList = (data) => {
    const { name, formatted_address, place_id, geometry } = data;

    setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
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
    resetInputValueState()
  }

  useEffect(() => {
    if (!location.state?.locationInfo) {
      const placeId = location.pathname.split("/")[2]
      typeof placeId === "string" && fetchLocationDetails(placeId)
    }
  }, [])

  return (
    <div className="w-screen h-dvh">

      <div className="relative w-full h-full" onClick={() => {
        offLocationLinkList()
        if (currentLocationRef.current) {
          if (locationInfo) {
            currentLocationRef.current.style.bottom = "200px"
          } else {
            currentLocationRef.current.style.bottom = "20px"
          }
        }
      }}>
        <MapOverview
          geometry={locationInfo?.geometry?.location || location.state?.locationInfo?.geometry?.location}
          currentLocationRef={currentLocationRef}
          fetchLocationDetails={fetchLocationDetails}
        />
      </div>

      <div className="fixed top-0">
        <MapViewHeader handleFunc={[handleGoBack, onLocationLinkList]} />
      </div>

      <div ref={locationLinkListRef} className="z-20 fixed bottom-0 w-screen h-3/5 overflow-y-scroll bg-background translate-y-full" style={{ transition: ".4s" }}>
        <LocationLinkList isSearchable={false} handleFunc={[handleSubmitForList, fetchLocationDetails]} />
      </div>

      <div className="fixed bottom-[20px] w-screen px-[20px]">
        {locationInfo
          ? !loading && <LocalPointPanel locationInfo={locationInfo} />
          : null
        }
        {loading && <Skeleton className="w-full h-[160px]" />}
      </div>
    </div>
  )
}

export default MapViewerPage