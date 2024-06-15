import { useState } from "react"

import useFirestoreUpdate from "@/hooks/useFirestoreUpdate"

import getAccountId from "@/utils/getAccountId"

interface FontOverViewProps {
  closeModal: () => void,
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void
  props: { selectedFont: string },
}

const FontOverView = ({ closeModal, handleScroll, props }: FontOverViewProps) => {

  const [selectedFont, setSelectedFont] = useState<string>(props.selectedFont || "프리텐다드체")

  const { updateField } = useFirestoreUpdate("users")

  const accountId = getAccountId()

  const textKr = "당신의 하루를 계획하고, 공유하세요."
  const textEN = "Plan your day, share it."

  const fontData = [
    { fontFamily: "var(--Pretendard-Regular)", fontName: "프리텐다드체" },
    { fontFamily: "var(--Ownglyph-meetme-Rg)", fontName: "밑미체" },
    { fontFamily: "var(--omyu-pretty)", fontName: "오뮤 다예쁨체" },
    { fontFamily: "var(--GangwonEdu-OTFBoldA)", fontName: "강원교육모두체" },
    { fontFamily: "var(--ONE-Mobile-POP)", fontName: "모바일POP체" },
    { fontFamily: "var(--HSSanTokki20-Regular)", fontName: "산토끼체" },
  ];

  return (
    <>
      <div className="px-[10px] py-[20px] grid grid-cols-2 gap-2 overflow-y-scroll" onScroll={handleScroll}>
        {fontData.map((font, index) => (
          <li
            key={index}
            className="py-[20px] px-[10px] flex flex-col gap-[10px] justify-between w-full rounded-lg bg-input"
            style={{ fontFamily: font.fontFamily }}
            onClick={() => {
              setSelectedFont(font.fontName)
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xlg text-white">{font.fontName}</p>
              <div className={`w-5 h-5 rounded-full border border-[4px] border-gray transition duration-300 ${selectedFont === font.fontName ? "bg-red" : "bg-gray"}`}>
              </div>
            </div>
            <div>
              <span className="block text-xsm text-gray-old">{textKr}</span>
              <span className="block text-xsm text-gray-old">{textEN}</span>
              <span className="block text-xsm text-gray-old">{"0 1 2 3 4 5 6 7 8 9"}</span>
            </div>
          </li>
        ))}
      </div>

      <div className="fixed left-0 bottom-0 p-[10px] w-screen bg-background">
        <button className="w-full min-h-[50px] rounded-[5px] bg-white text-lg font-bold text-black" type="button" onClick={async () => {
          await updateField(accountId, { selectedFont })
          closeModal()
        }}>선택완료</button>
      </div>
      <div className="w-full min-h-[70px]"></div>
    </>
  )
}

export default FontOverView