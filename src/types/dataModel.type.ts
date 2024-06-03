import { Timestamp } from "firebase/firestore"
import { ScheduleDetails } from "@/store";
import { ScheduleDetailsWithDate } from "@/store";
import { ScheduleFormValueType } from "@/store";
import { ScheduleLocationType } from "./schedules.type";
import { CommentsType } from "./posts.type";

// export type ModelValue =  string[] | string | boolean | Timestamp | Date | ScheduleFormValueType | ScheduleLocationType | ScheduleDetails[] | ScheduleDetailsWithDate[] | CommentsType;

export type ModelValue = any

export interface DataModelType {
  [key: string]: ModelValue;
}

