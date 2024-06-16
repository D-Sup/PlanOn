import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "@/hooks/useLogin";
import useModalStack from "@/hooks/useModalStack";

import AuthInput from "../atoms/AuthInput";
import Loader from "../organisms/Loader";
import { Checkbox } from "../shadcnUIKit/checkbox";

import IconGoogle from "../../assets/images/icon-google.svg?react";
import IconGithub from "../../assets/images/icon-github.svg?react";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState<boolean>(true);

  const navigate = useNavigate()

  const { error, isLoginSuccess, isSignupSuccess, isPending, login, googleLogin, gitHubLogin } = useLogin(isChecked);

  const { openModal } = useModalStack()

  useEffect(() => {
    if (error) {
      setIsError(false)
    }
  }, [error])

  useEffect(() => {
    if (isLoginSuccess) {
      openModal("Toast", { message: "로그인에 성공했습니다." })
    }
  }, [isLoginSuccess])

  useEffect(() => {
    if (isSignupSuccess) {
      openModal("Toast", { message: "회원가입에 성공했습니다." })
    }
  }, [isSignupSuccess])

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return (
    <div className="flex-center flex-col px-[30px] h-dvh">

      <h2 className="mt-[-110px] mb-[80px] text-center text-white text-xlg font-bold">로그인</h2>

      <div className="flex flex-col gap-[25px] w-full">
        <AuthInput
          value={email}
          handleInputChange={(value) => {
            setEmail(value)
            setIsError(true)
          }}
          id={"이메일 입력"}
          type={"email"}
          placeholder={"이메일 입력"}
          validation={(email === "" || emailPattern.test(email)) && isError}
          invalidMessage={
            !emailPattern.test(email) && "유효한 이메일 주소 형식이 아닙니다" ||
            error && error.includes("user-not-found") && "가입되어 있지 않은 이메일입니다" || ""
          }
        />
        <AuthInput
          value={password}
          handleInputChange={(value) => {
            setPassword(value)
            setIsError(true)
          }}
          id={"비밀번호 입력"}
          type={"password"}
          placeholder={"비밀번호 입력"}
          validation={isError}
          invalidMessage={
            error && error.includes("missing-password") && "비밀번호가 누락되어있습니다" ||
            error && error.includes("wrong-password") && "비밀번호가 일치하지 않습니다" || "로그인에 실패했습니다"
          }
        />
        <div className="flex items-center space-x-2">
          <Checkbox id="login-save" className="w-[20px] h-[20px] border-gray-old transition duration-100" onClick={() => setIsChecked(!isChecked)} />
          <label
            htmlFor="login-save"
            className="text-sm text-white"
          >
            로그인 상태 유지
          </label>
        </div>
        <button
          type="button"
          className="relative mt-[10px] w-full h-[50px] rounded-[10px] bg-white text-lg text-black font-bold"
          onClick={() => login({ email, password })}
        >
          {isPending ? (
            <div className="absolute-center w-[40px]">
              <Loader isSmallUse={true} color="black" />
            </div>
          ) : (
            <span>로그인</span>
          )}
        </button>

        <div className="m-auto">
          <span className="text-sm text-gray-old">계정이 없으신가요?</span>
          <button
            type="button"
            className="ml-[15px] font-bold text-sm text-white"
            onClick={() => {
              navigate("/signup", { state: { direction: "next" } })
            }}
          >
            회원가입
          </button>
        </div>
      </div>

      <div className="w-full px-[30px] absolute bottom-[40px]">
        <span className="mb-[15px] block text-center text-sm text-gray-old">SNS 계정으로 시작하기</span>
        <div className="w-full flex gap-[15px]">
          <button
            type="button"
            className="w-full h-[50px] rounded-[10px] bg-input relative"
            onClick={() => {
              googleLogin()
            }}
          >
            <IconGoogle width={20} height={20} fill={"var(--white)"} className="absolute-center" />
          </button>
          <button
            type="button"
            className="w-full h-[50px] rounded-[10px] bg-input relative"
            onClick={() => {
              gitHubLogin()
            }}
          >
            <IconGithub width={20} height={20} fill={"var(--white)"} className="absolute-center" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage