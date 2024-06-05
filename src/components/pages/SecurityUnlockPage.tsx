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
import { isUnLockValue, routeDirectionValue } from "@/store"

const SecurityUnlockPage = () => {

  const { updateField } = useFirestoreUpdate("users");

  const { data: userData, isLoading } = useContext(UserContext);
  const [value, setValue] = useState<string>("")
  const setIsUnLockValueState = useSetRecoilState(isUnLockValue);
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const secureNumber = userData?.data.secureNumber;

  const location = useLocation()
  const navigate = useNavigate()

  const { isSetPassword } = location.state || {};

  useEffect(() => {
    if (isSetPassword && value.length === 4) {
      updateField(userData.id, {
        secureNumber: value
      })
      setIsUnLockValueState(true)
      navigate("/setting", { state: { direction: "down", updateOption: true } })
    } else if (value.length === 4 && value === secureNumber) {
      setIsUnLockValueState(true)
      // setRouteDirectionValueState(Prev => ({ ...Prev, direction: "down" }))
      navigate("/post", { state: { direction: "down" } })
    } else if (value.length === 4 && value !== secureNumber) {
      setTimeout(() => setValue(""), 300)
    }
  }, [value])


  return (
    <div className="flex-center flex-col gap-[30px] w-full h-dvh bg-background">

      <h2 className="text-2xl text-white">{isSetPassword ? "암호를 설정해주세요" : "암호 입력"}</h2>

      <InputOTP maxLength={4} value={value}>
        <InputOTPGroup className="w-screen px-[60px] ">
          <InputOTPSlot index={0} className={`transition duration-300 ${!isSetPassword && value.length === 4 && value !== secureNumber && "border-red"}`} readonly />
          <InputOTPSlot index={1} className={`transition duration-300 ${!isSetPassword && value.length === 4 && value !== secureNumber && "border-red"}`} readonly />
          <InputOTPSlot index={2} className={`transition duration-300 ${!isSetPassword && value.length === 4 && value !== secureNumber && "border-red"}`} readonly />
          <InputOTPSlot index={3} className={`transition duration-300 ${!isSetPassword && value.length === 4 && value !== secureNumber && "border-red"}`} readonly />
        </InputOTPGroup>
      </InputOTP>

      <ul className="grid grid-cols-3 w-full px-[50px] text-xsm text-gray text-center">
        {Array(10).fill(0).map((_, index) => (
          <>
            {index === 9 && <li></li>}
            <li className="aspect-square flex-center w-full">
              <button
                type="button"
                className="w-4/5 aspect-square rounded-full bg-input text-2xl hover:bg-white hover:text-black transition duration-300"
                onClick={() => {
                  secureNumber && !isLoading && value.length !== 4 && setValue(value + (index === 9 ? 0 : index + 1))
                }}
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