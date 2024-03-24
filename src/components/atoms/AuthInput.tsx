import { useState } from "react"

import IconEye from "../../assets/images/icon-eye.svg?react";
import IconInfo from "../../assets/images/icon-info.svg?react";

const AuthInput = ({ id, type, placeholder, validation, invalidMessage }: { id: string, type: string, placeholder: string, validation: boolean, invalidMessage: string }) => {

  const [input, setInput] = useState<string>("");

  return (
    <>
      <div className={`px-[15px] flex items-center w-full h-[50px] rounded-[10px] border transition duration-300 ${validation ? "border-gray-old" : "border-red"}`}>
        <label htmlFor={id} className="a11y-hidden">{id}</label>
        <input className="w-full text-md text-white" type={type} id={id} placeholder={placeholder} value={input} onChange={((e) => setInput(e.target.value))} autoComplete="off" />
        <IconEye className={`ml-auto ${type === "password" ? "block" : "hidden"}`} width={20} height={15} fill={"var(--input)"} />
      </div>
      <div className={`mt-[5px] flex items-center justify-end gap-[5px] transition duration-300 ${validation ? "hidden" : "block"}`}>
        <IconInfo width={12} height={12} fill={"var(--red)"} />
        <span className="text-xsm text-red">{invalidMessage}</span>
      </div>
    </>
  )
}

export default AuthInput