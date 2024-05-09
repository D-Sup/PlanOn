import { useEffect, useState, useContext } from "react"
import { UserContext } from "../organisms/UserInfoProvider"
import { useNavigate, useLocation } from "react-router-dom"
import useFirestoreUpdate from "@/hooks/useFirestoreUpdate"
import { useSetRecoilState } from "recoil"
import { isUnLockValue, routeDirectionValue } from "@/store"

const SecurityUnlockPage = () => {

  const { updateField } = useFirestoreUpdate("users");

  const { data: userData } = useContext(UserContext);
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
      navigate("/setting", { state: { direction: "down" } })
    } else if (value.length === 4 && value === secureNumber) {
      setIsUnLockValueState(true)
      setRouteDirectionValueState(Prev => ({ ...Prev, direction: "down" }))
    } else if (value.length === 4 && value !== secureNumber) {
      setTimeout(() => setValue(""), 300)
    }
  }, [value])


  return (
    <div className="flex-center flex-col gap-[30px] w-full h-dvh bg-background">

      <h2 className="text-2xl text-white">{isSetPassword ? "암호를 설정해주세요" : "암호 입력"}</h2>

      <div className="flex justify-between w-full px-[120px]">
        <div className={`w-3 h-3 rounded-full border transition duration-300 ${value.length === 4 && value !== secureNumber ? "bg-red border-red" : value.length >= 1 && "bg-white"}`}></div>
        <div className={`w-3 h-3 rounded-full border transition duration-300 ${value.length === 4 && value !== secureNumber ? "bg-red border-red" : value.length >= 2 && "bg-white"}`}></div>
        <div className={`w-3 h-3 rounded-full border transition duration-300 ${value.length === 4 && value !== secureNumber ? "bg-red border-red" : value.length >= 3 && "bg-white"}`}></div>
        <div className={`w-3 h-3 rounded-full border transition duration-300 ${value.length === 4 && value !== secureNumber ? "bg-red border-red" : value.length >= 4 && "bg-white"}`}></div>
      </div>

      <ul className="grid grid-cols-3 w-full px-[50px] text-xsm text-gray text-center">
        {Array(10).fill(0).map((_, index) => (
          <>
            {index === 9 && <li></li>}
            <li className="aspect-square flex-center w-full">
              <button
                type="button"
                className="w-4/5 aspect-square rounded-full bg-input text-2xl hover:bg-white hover:text-black transition duration-300"
                onClick={() => {
                  value.length !== 4 && setValue(value + (index === 9 ? 0 : index + 1))
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