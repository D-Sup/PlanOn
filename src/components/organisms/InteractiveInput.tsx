import React, { useState, useRef, useEffect } from "react";

import ProfileAvatar from "../atoms/ProfileAvatar";

import IconSubmit from "../../assets/images/icon-submit.svg?react";
import iconSendPhoto from "../../assets/images/icon-send-photo.svg";

const InteractiveInput = () => {

  const [inptValue, setInptValue] = useState<string>("");
  const [prevInpt, setPrevInpt] = useState<string>("");
  // const [commentSectionHeight, setCommentSectionHeight] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isCommentPage = false;


  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInptValue(e.target.value);
    setPrevInpt(inptValue)
  };

  useEffect(() => {
    const textareaRefCurrent = textareaRef.current
    if (textareaRefCurrent) {
      if (inptValue.length < prevInpt.length) {
        textareaRefCurrent.style.height = "auto";
      }
      const newHeight = textareaRefCurrent.scrollHeight;
      // setCommentSectionHeight(newHeight)
      textareaRefCurrent.style.height = `${newHeight}px`;
      textareaRefCurrent.scrollTop = textareaRefCurrent.scrollHeight;
    }
  }, [inptValue])


  return (
    <>
      <div className="px-[15px] py-4 flex items-end justify-between w-full bg-background">
        <ProfileAvatar
          className="w-[37px] h-[37px]"
          alt="self-profile"
          src={isCommentPage ? "https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_1280.jpg" : iconSendPhoto} />
        <div className="relative min-h-10 w-[calc(100%-50px)] flex items-center">
          <label htmlFor="interactive-input" className="a11y-hidden">interactive-input</label>
          <textarea
            rows={1}
            name="productInfo"
            id="interactive-input"
            value={inptValue}
            onChange={handleTextareaChange}
            placeholder="입력"
            className="py-[6px] pl-[15px] pr-[40px] w-full h-[37px] max-h-[80px] box-border rounded-[10px] resize-none bg-input text-sm text-base text-white overflow-y-scroll scroll-hide"
            style={{ transition: "height .3s" }}
            ref={textareaRef}
          />
          <button className="absolute bottom-[5px] right-[15px] transform -translate-y-1/2">
            <IconSubmit width={15} height={15} fill={inptValue.length > 0 ? "var(--white)" : "var(--gray-heavy)"} />
          </button>
        </div>
      </div>
    </>
  )
}

export default InteractiveInput