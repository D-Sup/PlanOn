import { useEffect, useState, useContext } from "react"
import { UserContext } from "../organisms/UserInfoProvider"
import { useNavigate, useLocation } from "react-router-dom"
import useFirestoreUpdate from "@/hooks/useFirestoreUpdate"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../shadcnUIKit/input-otp"
import { useSetRecoilState } from "recoil"
import { isUnLockValue } from "@/store"

const SecurityUnlockPage = () => {

  const { updateField } = useFirestoreUpdate("users");

  const { data: userData } = useContext(UserContext);
  const [value, setValue] = useState<string>("")
  const setIsUnLockValueState = useSetRecoilState(isUnLockValue);

  const secureNumber = userData?.data.secureNumber

  const location = useLocation()
  const navigate = useNavigate()

  const { isSetPassword } = location.state || {};

  useEffect(() => {
    if (isSetPassword && value.length === 4) {
      updateField(userData.id, {
        secureNumber: value
      })
      navigate("/setting", { state: { direction: "down", updateOption: true } })
      setIsUnLockValueState(true)
    } else if (value.length === 4 && value === secureNumber) {
      setIsUnLockValueState(true)
      navigate("/post", { state: { direction: "down" } })
    } else if (value.length === 4 && value !== secureNumber) {
      setTimeout(() => setValue(""), 300)
    }
  }, [value])


  return (
    <div className="flex-center flex-col gap-[30px] w-full h-dvh bg-background">

      <h2 className="text-2xl text-white">{isSetPassword ? "암호를 설정해주세요" : "암호 입력"}</h2>

      <InputOTP maxLength={4} value={value} onChange={(value) => setValue(value)}>
        <InputOTPGroup className="w-screen px-[60px] ">
          <InputOTPSlot index={0} className={`transition duration-300 ${!isSetPassword && value.length === 4 && value !== secureNumber && "border-red"}`} />
          <InputOTPSlot index={1} className={`transition duration-300 ${!isSetPassword && value.length === 4 && value !== secureNumber && "border-red"}`} />
          <InputOTPSlot index={2} className={`transition duration-300 ${!isSetPassword && value.length === 4 && value !== secureNumber && "border-red"}`} />
          <InputOTPSlot index={3} className={`transition duration-300 ${!isSetPassword && value.length === 4 && value !== secureNumber && "border-red"}`} />
        </InputOTPGroup>
      </InputOTP>

      <ul className="grid grid-cols-3 w-full px-[50px] text-xsm text-gray text-center">
        {Array(10).fill(0).map((_, index) => (
          <>
            {index === 9 && <li></li>}
            <li className="aspect-square flex-center w-full">
              <button
                type="button"
                className="w-2/3 aspect-square rounded-full bg-input text-lg"
                onClick={() => value.length !== 4 && setValue(value + (index === 9 ? 0 : index + 1))}
              >
                {index === 9 ? 0 : index + 1}
              </button>
            </li>
          </>
        ))}
      </ul>
    </div>
  )
}

export default SecurityUnlockPage