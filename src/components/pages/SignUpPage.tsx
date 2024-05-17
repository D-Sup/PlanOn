import { useState, useEffect } from "react";
import useSignUp from "@/hooks/useSignUp";
import { useNavigate } from "react-router-dom";
import useModalStack from "@/hooks/useModalStack";

import Loader from "../organisms/Loader";
import AuthInput from "../atoms/AuthInput";

const SignUpPage = () => {
  const { error, isPending, signUp, isSuccess } = useSignUp();

  const navigate = useNavigate();
  const { openModal } = useModalStack()

  const [accountName, setAccountName] = useState<string>("");
  const [accountEmail, setAccountEmail] = useState<string>("");
  const [accountPassword, setAccountPassword] = useState<string>("");
  const [accountPasswordConfirm, setAccountPasswordConfirm] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(true);

  const accountNamePattern = /^[a-zA-Z0-9가-힣ㅏ-ㅣㄱ-ㅎ]+$/;
  const accountEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const accountPasswordPattern = /^(?=.*[a-zA-Z]{6,})(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

  const isRequire = accountNamePattern.test(accountName) &&
    accountEmailPattern.test(accountEmail) &&
    accountPasswordPattern.test(accountPassword) &&
    accountPassword === accountPasswordConfirm

  if (isSuccess) {
    setTimeout(() => {
      navigate("/login", { state: { direction: "prev" } })
      openModal("Toast", { message: "회원가입에 성공했습니다." })
    }, 100)
  }

  useEffect(() => {
    if (error) {
      setIsError(false)
    }
  }, [error])

  return (
    <div className="flex-center flex-col px-[30px] h-dvh">

      <h2 className="mt-[-70px] mb-[40px] text-center text-white text-xlg font-bold">회원가입</h2>

      <div className="flex flex-col gap-[25px] w-full">
        <AuthInput
          value={accountName}
          handleInputChange={(value) => {
            setAccountName(value)
            setIsError(true)
          }}
          id={"이름 입력"}
          type={"email"}
          placeholder={"이름 입력"}
          validation={(accountName === "" || accountNamePattern.test(accountName)) && isError}
          invalidMessage={isError ? "이름에 특수문자가 포함되면 안됩니다." : ""}
        />
        <AuthInput
          value={accountEmail}
          handleInputChange={(value) => {
            setAccountEmail(value)
            setIsError(true)
          }}
          id={"이메일 입력"}
          type={"email"}
          placeholder={"이메일 입력"}
          validation={(accountEmail === "" || accountEmailPattern.test(accountEmail)) && isError}
          invalidMessage={
            isError
              ? "유효한 이메일 주소 형식이 아닙니다"
              : error && error.includes("invalid-email") && "유효하지 않은 이메일입니다." ||
              error && error.includes("email-already-in-use") && "이미 존재하는 이메일입니다." ||
              ""
          }
        />
        <AuthInput
          value={accountPassword}
          handleInputChange={(value) => {
            setAccountPassword(value)
            setIsError(true)
          }}
          id={"비밀번호 입력"}
          type={"password"}
          placeholder={"비밀번호 입력"}
          validation={(accountPassword === "" || accountPasswordPattern.test(accountPassword)) && isError}
          invalidMessage={isError ? "최소 하나의 숫자, 특수문자와 6개의 영문자를 포함해야합니다" : ""}
        />
        <AuthInput
          value={accountPasswordConfirm}
          handleInputChange={(value) => {
            setAccountPasswordConfirm(value)
            setIsError(true)
          }}
          id={"비밀번호 확인"}
          type={"password"}
          placeholder={"비밀번호 확인"}
          validation={(accountPasswordConfirm === "" || accountPassword === accountPasswordConfirm) && isError}
          invalidMessage={
            isError
              ? "비밀번호가 일치하지않습니다."
              : "회원가입에 실패했습니다"
          }
        />
        <button
          type="button"
          className={`relative mt-[10px] w-full h-[50px] rounded-[10px]  text-lg font-bold transition duration-300 ${isRequire ? "bg-white text-black" : "bg-input text-gray-old"}`}
          onClick={() => {
            if (isRequire) {
              signUp({
                accountEmail,
                accountPassword,
                accountName
              });
            }
          }}
        >
          {isPending ? (
            <div className="absolute-center w-[40px]">
              <Loader isSmallUse={true} color="black" />
            </div>
          ) : (
            <span>계정 만들기</span>
          )}
        </button>

        <div className="m-auto">
          <span className="text-sm text-gray-old">이미 계정이 있으신가요?</span>
          <button
            type="button"
            className="ml-[15px] font-bold text-sm text-white"
            onClick={() => {
              navigate("/login", { state: { direction: "prev" } })
            }}
          >
            로그인
          </button>
        </div>
      </div>


    </div>
  );
};

export default SignUpPage