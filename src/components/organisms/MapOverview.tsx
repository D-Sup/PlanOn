import { useEffect, useState, useCallback, memo, RefObject } from "react"
import { GoogleMap, useJsApiLoader, Marker, Polyline, MarkerF } from "@react-google-maps/api";

import IconShare from "../../assets/images/icon-share.svg?react";
import iconLocationPin from "../../assets/images/icon-location-pin.svg";

import { ScheduleDetails } from "@/store";

interface MapOverview {
  geometry?: {
    lat: number
    lng: number
  };
  currentLocationRef?: RefObject<HTMLButtonElement>,
  fetchLocationDetails?: (placeId: string) => void,
  points?: ScheduleDetails[],
  selectPoint?: number,
  setSelectPoint?: React.Dispatch<React.SetStateAction<number>>
}

const MapOverview = ({ geometry, currentLocationRef, fetchLocationDetails, points, selectPoint, setSelectPoint }: MapOverview) => {

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    language: "ko"
  })

  const containerStyle = {
    width: "100%",
    height: "100%"
  };

  const [map, setMap] = useState(null)
  const [markerPosition, setMarkerPosition] = useState(geometry || { lat: 37.55594599999999, lng: 126.972317 });

  const onMapClick = useCallback((event) => {
    if (event.placeId && fetchLocationDetails) {
      fetchLocationDetails(event.placeId)
      const position = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      setMarkerPosition(position);
    }
  }, []);

  const panToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.panTo(currentPos)
          map.setZoom(20);
        }
      );
    }
  };

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(markerPosition);
    map.fitBounds(bounds);
    map.addListener("click", (event) => {
      event.stop();
    })
    setMap(map)
    setTimeout(() => map.setZoom(18), 100)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  useEffect(() => {
    if (geometry) {
      setMarkerPosition(geometry)
    }
  }, [geometry])

  useEffect(() => {
    if (map && !geometry && currentLocationRef) {
      panToCurrentLocation()
    }
  }, [map])

  useEffect(() => {
    if (map) {
      map.panTo(markerPosition);
    }
  }, [markerPosition])

  useEffect(() => {
    if ((selectPoint === 0 || selectPoint) && points && points.length > 0 && map) {
      const { scheduleLocation } = points[selectPoint]
      map.panTo({ lat: scheduleLocation.lat, lng: scheduleLocation.lng });
    }
  }, [map, selectPoint])

  return isLoaded ? (
    <>
      <GoogleMap
        options={{ disableDefaultUI: true, zoomControl: false }}
        mapContainerStyle={containerStyle}
        zoom={18}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
      >

        {!points
          ? <Marker position={markerPosition} />
          :
          <>
            {points.map((point, index) => {
              return (
                <MarkerF
                  key={index}
                  onClick={() => {
                    // onMapClick(point)
                    setSelectPoint && setSelectPoint(index)
                  }}
                  position={{ lat: point.scheduleLocation.lat, lng: point.scheduleLocation.lng }}
                  label={{
                    text: `${index + 1}`,
                    color: "#D3FF63", // 원하는 색상으로 변경하세요.
                  }}
                  icon={{
                    url: iconLocationPin,
                    scaledSize: selectPoint === index ? new window.google.maps.Size(40, 40) : new window.google.maps.Size(30, 30),
                    anchor: selectPoint === index ? new window.google.maps.Point(20, 20) : new window.google.maps.Point(15, 15)
                  }}
                />
              );
            })}

            <Polyline
              path={points.map(point => ({ lat: point.scheduleLocation.lat, lng: point.scheduleLocation.lng }))}
              options={{
                strokeColor: "#D3FF63",
                strokeOpacity: 0,
                icons: [{
                  icon: {
                    path: "M 0,0,0,1",
                    strokeOpacity: 1,
                    scale: 5
                  },
                  repeat: "20px"
                }],
              }}
            />
          </>
        }

      </GoogleMap >
      <button
        ref={currentLocationRef}
        onClick={panToCurrentLocation}
        className={`absolute right-[20px] w-[38px] h-[38px] rounded-[10px] bg-white backdrop-blur-sm ${currentLocationRef ? "bottom-[20px]" : points ? "bottom-[20px]" : "bottom-[85px]"}`}
        type="button"
        style={{ transition: ".4s", backgroundColor: "rgba(26,26,26, 0.5)" }}
      >
        <IconShare className="absolute-center" width={15} height={15} fill={"#FFF"} />
      </button>
    </>
  ) : <></>
}

export default memo(MapOverview)
