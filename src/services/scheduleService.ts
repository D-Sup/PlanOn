import useFirestoreCreate from "@/hooks/useFirestoreCreate";
import useFirestoreRead from "@/hooks/useFirestoreRead";
import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";
import useFirestoreDelete from "@/hooks/useFirestoreDelete";

import useDataQuery from "@/hooks/useDataQuery";
import useDataMutation from "@/hooks/useDataMutation";

import { useRecoilValue } from "recoil";
import { newScheduleFormValue } from "@/store";

import getAccountId from "@/utils/getAccountId";
import generateKeywordCombinations from "@/utils/generateKeywordCombinations";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { SchedulesType } from "@/types/schedules.type";
import { ScheduleFormValueType } from "@/store";

const ScheduleService = () => {

  const accountId = getAccountId()

  const CreateSchedule = (onSuccess: () => void, onError: () => void) => {
    const { createFieldArray } = useFirestoreCreate("users")
    const { createDocument } = useFirestoreCreate("schedules")
    const scheduleFormValueState = useRecoilValue(newScheduleFormValue)
    
    const { mutate, isPending } = useDataMutation(
      "schedules",
      async () => {
        const extractPlaceDetails = (data: ScheduleFormValueType) => {
          const result = [];
          if (data.scheduleLocation) {
            result.push(data.scheduleLocation.placeName, data.scheduleLocation.placeAddress);
          }
          if (Array.isArray(data.scheduleDetails)) {
            data.scheduleDetails.forEach(detail => {
              if (detail.scheduleLocation) {
                result.push(detail.scheduleLocation.placeName, detail.scheduleLocation.placeAddress);
              }
            });
          }
          return result;
        }

        const flattenArray = (arr: (string[])[]) => {
          return arr.reduce((acc, val) => acc.concat(val), []);
        }

        const uploadedScheduleId = await createDocument({
        private: scheduleFormValueState.private,
        startTime: new Date(scheduleFormValueState.startTime),
        endTime: new Date(scheduleFormValueState.endTime),
        scheduleName: scheduleFormValueState.scheduleName,
        scheduleLocation: scheduleFormValueState.scheduleLocation,
        locationKeywords: scheduleFormValueState.scheduleLocation.placeName ? flattenArray(extractPlaceDetails(scheduleFormValueState).map((extractPlaceDetail) => generateKeywordCombinations(extractPlaceDetail))) : [],
        scheduleDetails: scheduleFormValueState.scheduleDetails.map(({selectedDay, startTime, endTime, ...otherDetails})=> ({
          ...otherDetails,
          startTime: new Date(`${selectedDay} ${startTime}`),
          endTime: new Date(`${selectedDay} ${endTime}`)
        }))
        })
        if (uploadedScheduleId) {
          createFieldArray(accountId, "scheduleIds", uploadedScheduleId)
        }
      },
      onSuccess,
      onError
    )
  
    return { mutate, isPending }
  }

  // const ReadSchedule = () => {
  //   const { readDocumentSingle: readDocumentUsers } = useFirestoreRead("users")
  //   const { readDocumentSingle: readDocumentSchedules } = useFirestoreRead("schedules")
    
  //   const { data, isLoading } = useDependentDataQuery<ReadDocumentType<SchedulesType>[]>(
  //     "user", 
  //     "schedules", 
  //     ["data", "scheduleIds"], 
  //     [readDocumentUsers<UsersType>, readDocumentSchedules<SchedulesType>],
  //     [[accountId], [null]],
  //     {
  //       staleTime: Infinity,
  //       gcTime: Infinity,
  //     }
  //   );
  
  //   return { data, isLoading }
  // }

  const ReadOnlySchedule = (id: string) => {
    const { readDocumentSingle } = useFirestoreRead("schedules")
    const { data, isLoading } = useDataQuery<ReadDocumentType<SchedulesType>, Error, ReadDocumentType<SchedulesType>>(
      "readonly-schedules",
      () => readDocumentSingle<SchedulesType>(id),
      (data) => data,
      {
        staleTime: 0,
        gcTime: 0,
      },
    )
    return { data, isLoading }
  }

  const ReadSchedule = () => {
    const { readDocumentsSimplePaged } = useFirestoreRead("schedules")

    const { data, isLoading, refetch } = useDataQuery<ReadDocumentType<SchedulesType>[], Error, ReadDocumentType<SchedulesType>[]>(
      "schedules",
      ()=> readDocumentsSimplePaged<SchedulesType>([], "authorizationId", "in", [accountId], "startTime", "asc", Infinity),
      (data) => data,
      {
        staleTime: Infinity,
        gcTime: Infinity,
      },
    )
    return { data, isLoading, refetch }
  }

  const UpdateSchedule = (data: ReadDocumentType<ScheduleFormValueType> , onSuccess: () => void, onError: () => void) => {
    const { updateField } = useFirestoreUpdate("schedules")
    const { id: scheduleId, data: scheduleData } = data;

    const { mutate, isPending } = useDataMutation(
      "schedules",
      async () => {
        const extractPlaceDetails = (data: ScheduleFormValueType) => {
          const result = [];
          if (data.scheduleLocation) {
            result.push(data.scheduleLocation.placeName, data.scheduleLocation.placeAddress);
          }
          if (Array.isArray(data.scheduleDetails)) {
            data.scheduleDetails.forEach(detail => {
              if (detail.scheduleLocation) {
                result.push(detail.scheduleLocation.placeName, detail.scheduleLocation.placeAddress);
              }
            });
          }
          return result;
        }

        const flattenArray = (arr: (string[])[]) => {
          return arr.reduce((acc, val) => acc.concat(val), []);
        }

        await updateField(scheduleId, {
          private: scheduleData.private,
          startTime: new Date(scheduleData.startTime),
          endTime: new Date(scheduleData.endTime),
          scheduleName: scheduleData.scheduleName,
          scheduleLocation: scheduleData.scheduleLocation,
          locationKeywords: scheduleData.scheduleLocation.placeName ? flattenArray(extractPlaceDetails(scheduleData).map((extractPlaceDetail) => generateKeywordCombinations(extractPlaceDetail))) : [],
          scheduleDetails: scheduleData.scheduleDetails.map(({selectedDay, startTime, endTime, ...otherDetails})=> ({
            ...otherDetails,
            startTime: new Date(`${selectedDay} ${startTime}`),
            endTime: new Date(`${selectedDay} ${endTime}`)
          }))
        })
      },
      onSuccess,
      onError
    )
  
    return { mutate, isPending }
  }

  const DeleteSchedule = (id: string , onSuccess: () => void, onError: () => void) => {
    const { deleteFieldArray } = useFirestoreDelete("users")
    const { deleteDocument } = useFirestoreDelete("schedules")

    const { mutate, isPending } = useDataMutation(
      "schedules",
      async () => {
        const deletedScheduleId = await deleteDocument(id)
        if (deletedScheduleId) {
          deleteFieldArray(accountId, "scheduleIds", deletedScheduleId)
        }
      },
      onSuccess,
      onError
    )
  
    return { mutate, isPending }
  }

  return { CreateSchedule, ReadOnlySchedule, ReadSchedule, UpdateSchedule, DeleteSchedule }
}

export default ScheduleService