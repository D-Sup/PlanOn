import { Timestamp } from "firebase/firestore";

export interface SchedulesType {
  authorizationId?: string,
  createdAt?: Timestamp,
  private: boolean,
  startTime: Timestamp,
  endTime: Timestamp,
  scheduleName: string,
  scheduleLocation: ScheduleLocationType,
  scheduleDetails: ScheduleDetailsType[]
}

export interface ScheduleDetailsType {
  startTime: Timestamp,
  endTime: Timestamp,
  scheduleName: string,
  scheduleLocation: ScheduleLocationType,
  memoContent: string,
}

export interface ScheduleLocationType {
  placeName: string, 
  placeAddress: string,
  placeId: string, 
  lat: number, 
  lng: number,
}


