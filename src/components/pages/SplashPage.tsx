import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import getAccountId from "@/utils/getAccountId";

import IconLogo from "../../assets/images/icon-logo.svg?react";

const SplashPage = () => {

  const navigate = useNavigate()

  const accountId = getAccountId()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate(accountId ? "/post" : "/introduce", { state: { direction: "fade" } })
    }, 2000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="relative w-screen h-dvh">
      <IconLogo fill={"var(--white)"} className="absolute-center w-1/2 animate-fade-in" />
    </div >
  )
}

export default SplashPage