import { atom } from "recoil";
import { recoilPersist } from "recoil-persist"

import { SchedulesType } from "@/types/schedules.type";
import { ScheduleDetailsType } from "@/types/schedules.type";

const sessionStorage = typeof window !== "undefined" ? window.sessionStorage : undefined

const { persistAtom } = recoilPersist(
  {
    key: "persistedScheduleFormValue",
    storage: sessionStorage,
  }
);

export type ScheduleFormValueType = Omit<SchedulesType, "startTime" | "endTime" | "scheduleDetails"> & {
  startTime: string;
  endTime: string;
  scheduleDetails: ScheduleDetails[];
  scheduleDetailSnapshot: ScheduleDetails | null
  inProgressFormNumber: number | null,
  isAddingScheduleDetail: boolean,
  isScheduleFormModified?: boolean,
  id?: string | null,
  scheduleFormSnapshot?: ScheduleFormValueType | null,
};

export type ScheduleDetails = Omit<ScheduleDetailsType, "startTime" | "endTime"> & {
  selectedDay: string;
  startTime: string;
  endTime: string;
};

export type ScheduleDetailsWithDate = Omit<ScheduleDetailsType, "startTime" | "endTime"> & {
  startTime: Date;
  endTime: Date;
};

export const scheduleFormValueDefault = {
  private: false,
  startTime: "",
  endTime: "",
  scheduleName: "",
  scheduleLocation: {
    placeName: "", 
    placeAddress: "",
    placeId: "", 
    lat: 0, 
    lng: 0,
  },
  scheduleDetails: [],
  scheduleDetailSnapshot: null,
  inProgressFormNumber: null,
  isAddingScheduleDetail: false,
}

export const updateScheduleFormValueDefault = {
  ...scheduleFormValueDefault,
  id: null,
  scheduleFormSnapshot: null,
  isScheduleFormModified: false,
}


export const newScheduleFormValue = atom<ScheduleFormValueType>({
  key: "newScheduleFormValue",
  default: scheduleFormValueDefault,
  effects_UNSTABLE: [persistAtom],
});

export const updateScheduleFormValue = atom<ScheduleFormValueType>({
  key: "updateScheduleFormValue",
  default: updateScheduleFormValueDefault,
  effects_UNSTABLE: [persistAtom],
});