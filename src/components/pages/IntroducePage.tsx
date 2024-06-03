import { useNavigate } from "react-router-dom";

import IconLogo from "../../assets/images/icon-logo.svg?react";

const IntroducePage = () => {

  const navigate = useNavigate()

  return (
    <>
      <div className="relative flex-center flex-col h-dvh">
        <IconLogo fill={"var(--white)"} className="mt-[-100px] w-1/4 h-1/4 opacity-0 animate-show-content-1" />

        <h2 className="text-white text-2xl opacity-0 animate-show-content-2">플랫온</h2>
        <p className="mt-[10px] text-white text-md opacity-0 animate-show-content-3">당신의 하루를 계획하고, 공유하세요</p>

        <div className="absolute bottom-[30px] px-[30px] w-full opacity-0 animate-show-content-4">
          <button
            type="button"
            className="w-full h-[50px] rounded-[10px] bg-white text-lg text-black font-bold"
            onClick={() => navigate("/login", { state: { direction: "next" } })}

          >
            시작하기
          </button>
          <span className="mt-[10px] block text-gray-old text-center text-sm">회원가입 후 언제든지 간편하게 탈퇴하실 수 있습니다. 😊</span>
        </div>
      </div>

    </>
  )
}

export default IntroducePage