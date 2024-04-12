import { selector, selectorFamily } from "recoil";

import { postFormValueDefault, postFormValue } from "../atoms/postFormValueAtom";
import { scheduleFormValueDefault, newScheduleFormValue, updateScheduleFormValueDefault, updateScheduleFormValue} from "../atoms/scheduleFormValueAtom";
import { modalStackDefault, modalStack } from "../atoms/modalStackAtom";
import { paginationValueDefault, paginationValue } from "../atoms/paginationValueAtoms";

type Params = {
  defaultValue: any;
  compareValue: any;
};

export const hasValueChangedSelector = selectorFamily<boolean, Params>({
  key: "hasValueChangedSelector",
  get: ({ defaultValue, compareValue }) => ({ get }) => {
    const currentValue = get(compareValue);
    return JSON.stringify(defaultValue) !== JSON.stringify(currentValue);
  },
});

export const isPostFormModifiedSelector = selector({
  key: "isPostFormModifiedSelector",
  get: ({get}) => {
    const hasChanged = get(hasValueChangedSelector({ defaultValue: postFormValueDefault, compareValue: postFormValue }));
    return hasChanged;
  },
});

export const isNewScheduleFormModifiedSelector = selector({
  key: "isNewScheduleFormModifiedSelector",
  get: ({get}) => {
    const hasChanged = get(hasValueChangedSelector({ defaultValue: scheduleFormValueDefault, compareValue: newScheduleFormValue }));
    return hasChanged;
  },
});

export const isUpdateScheduleFormModifiedSelector = selector({
  key: "isUpdateScheduleFormModifiedSelector",
  get: ({get}) => {
    const hasChanged = get(hasValueChangedSelector({ defaultValue: updateScheduleFormValueDefault, compareValue: updateScheduleFormValue }));
    return hasChanged;
  },
});

export const isModalStackModifiedSelector = selector({
  key: "isModalStackModifiedSelector",
  get: ({get}) => {
    const hasChanged = get(hasValueChangedSelector({ defaultValue: modalStackDefault, compareValue: modalStack }));
    return hasChanged;
  },
});

export const isPaginationValueModifiedSelector = selector({
  key: "isPaginationValueModifiedSelector",
  get: ({get}) => {
    const hasChanged = get(hasValueChangedSelector({ defaultValue: paginationValueDefault, compareValue: paginationValue }));
    return hasChanged;
  },
});
