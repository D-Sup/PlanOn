import useModalStack from "@/hooks/useModalStack";

import { SetterOrUpdater } from "recoil";

import FormField from "../mocules/FormField";
import GenericInput from "../atoms/GenericInput";

import { Switch } from "../shadcnUIKit/switch";

import ToggleTagList from "./ToggleTagList";

import { PostFormValueType } from "@/store";

interface PostFormProps {
  postFormState: PostFormValueType,
  setPostFormState: SetterOrUpdater<PostFormValueType> | React.Dispatch<React.SetStateAction<PostFormValueType>>,
}

const PostForm = ({ postFormState, setPostFormState }: PostFormProps) => {

  const { openModal } = useModalStack();


  return (
    <div className="flex flex-col gap-[20px]">
      <FormField label={"공개"}>
        <Switch
          checked={!postFormState.private}
          onCheckedChange={() => {
            setPostFormState(Prev => ({ ...Prev, private: !Prev.private }))
          }}
        />
      </FormField>

      <FormField label={"태그"}>
        <GenericInput
          className="h-[40px] rounded-[10px]"
          id={"hashtag-input"}
          type={"text"}
          placeholder={"해시태그 추가..."}
          value={
            postFormState.hashtags.length === 0
              ? ""
              : postFormState.hashtags.map(hashtag => `@${hashtag.id}`).join(" ")
          }
          resetInputValue={() => setPostFormState(Prev => ({ ...Prev, hashtags: [] }))}
          handleInputClick={() => openModal(ToggleTagList, {
            type: "hashtagSearch",
            postFormState,
            setPostFormState
          })}
          readOnly={true}
        />
      </FormField>

      <FormField label={""}>
        <GenericInput
          className="h-[40px] rounded-[10px]"
          id={"usertag-input"}
          type={"text"}
          placeholder={"유저태그..."}
          value={
            postFormState.usertags.length === 0
              ? ""
              : postFormState.usertags.map(usertag => `@${usertag.data.accountName}`).join(" ")
          }
          resetInputValue={() => setPostFormState(Prev => ({ ...Prev, usertags: [] }))}
          handleInputClick={() => openModal(ToggleTagList, {
            type: "userSearch",
            postFormState,
            setPostFormState
          })}
          readOnly={true}
        />
      </FormField>

      <FormField label={"문구"}>
        <GenericInput
          className="h-[190px] rounded-[10px]"
          id={"memo-input"}
          type={"textarea"}
          placeholder={"입력"}
          value={postFormState.content}
          handleInputChange={(value: string) => {
            setPostFormState(Prev => ({ ...Prev, content: value }))
          }}
        />
      </FormField>
    </div>
  )
}

export default PostForm