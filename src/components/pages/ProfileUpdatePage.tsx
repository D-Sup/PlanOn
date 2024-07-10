import { useState, useRef, useEffect } from "react"
import { useContext } from "react"
import { UserContext } from "../providers/UserInfoProvider"

import { useSetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import useModalStack from "@/hooks/useModalStack"
import usePhotoUpload from "@/hooks/usePhotoUpload"

import UserService from "@/services/userService"

import Header from "../organisms/Header"
import FixedTrigger from "../molecules/FixedTrigger"
import ProfileAvatar from "../atoms/ProfileAvatar"
import GenericInput from "../atoms/GenericInput"
import { Skeleton } from "../shadcnUIKit/skeleton"

import IconRecycle from "../../assets/images/icon-recycle.svg?react";

const ProfileUpdatePage = () => {

  const { data: userData, isLoading } = useContext(UserContext);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const [isDefaultImage, setIsDefaultImage] = useState<boolean>(false);
  const [accountImage, setAccountImage] = useState<File[]>([]);
  const [accountImagePreview, setAccountImagePreview] = useState<string[]>([userData?.data.accountImage as string]);
  const [accountName, setAccountName] = useState<string>(userData?.data.accountName as string);
  const [description, setDescription] = useState<string>(userData?.data.description as string);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const { openModal, closeModal, closeModalDirect } = useModalStack()

  const { isPhotoExtensionValid } = usePhotoUpload();

  const { ProfileUpdateHeader } = Header()
  const { UpdateUser } = UserService()
  const { mutate, isPending } = UpdateUser({ isDefaultImage, accountImage, accountName, description },
    () => {
      setTimeout(() => closeModal(), 0)
      setTimeout(() => {
        setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
        openModal("Toast", { message: "프로필 수정이 완료했습니다." });
      }, 800)
    }, () => {
      setTimeout(() => closeModal(), 0)
      setTimeout(() => {
        setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
        openModal("Toast", { message: "프로필 수정을 실패했습니다." });
      }, 800)
    }
  )

  useEffect(() => {
    if (userData) {
      setAccountImagePreview([userData?.data.accountImage])
      setAccountName(userData?.data.accountName)
      setDescription(userData?.data.description)
    }
  }, [isLoading])


  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const { isValid, fileArray, previewArray } = isPhotoExtensionValid(files)
      if (isValid && setAccountImage) {
        setAccountImage(fileArray)
        setAccountImagePreview(previewArray);
      } else {
        openModal("Alert", "유효하지 않은 파일입니다.", ["확인"], [null])
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  }

  if (isPending && isFetching) {
    closeModalDirect()
    openModal("Loading", { isLoader: true, message: "프로필 수정 중 ..." });
    setIsFetching(false)
  }

  return (
    <>
      <FixedTrigger className="top-0 w-full" height={40} enableAnimation={false}>
        <ProfileUpdateHeader isRequired={accountName !== ""} handleFunc={[
          () => {
            setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
          },
          () => {
            openModal("Alert", "프로필을 수정하시겠습니까?", ["취소", "확인"], [null, () => mutate()])
          }
        ]} />
      </FixedTrigger>

      <div className="flex flex-col gap-[20px] px-[30px] pt-[30px]">
        {userData
          ? (
            <div className="relative w-[150px]"
              onClick={handleUploadClick}>
              <ProfileAvatar
                className="w-[150px] h-[150px]"
                src={accountImagePreview[0] || ""}
                alt="profile-image"
              />
              {accountImage.length === 0 &&
                <div className="absolute top-0 w-[150px] h-[150px] rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
                  <span className="absolute-center text-[#FFF]">{accountImagePreview[0] === "" ? "프로필 추가" : "프로필 수정"}</span>
                </div>
              }
              {accountImagePreview[0] !== "" &&
                <button
                  className="z-50 absolute top-0 right-0 w-[40px] h-[40px] rounded-full bg-white bg-white"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setAccountImage([])
                    setAccountImagePreview([])
                    setIsDefaultImage(true)
                  }}
                >
                  <IconRecycle className="absolute-center" width={20} height={20} fill={"var(--black)"} />
                </button>
              }
            </div>
          ) : (
            <Skeleton className="w-[150px] h-[150px] rounded-full" />
          )
        }
        <label htmlFor="fileInput" className="a11y-hidden">fileInput</label>
        <input
          ref={fileInputRef}
          className="sr-only"
          onChange={handleImageChange}
          id="fileInput"
          type="file"
          accept="image/*"
        />

        <div>
          <div className="w-full flex justify-between pb-[10px]">
            <div>
              <p className="inline-block text-md text-white">이름</p>
              <p className="inline-block ml-[5px] text-md text-red">*</p>
            </div>
            <p className="text-md text-white">{accountName?.length}/20</p>
          </div>
          <GenericInput
            className="h-[40px] rounded-[10px]"
            id={"title-input"}
            type={"text"}
            placeholder={"입력"}
            value={accountName}
            handleInputChange={(value) => value.length <= 20 && setAccountName(value)}
            resetInputValue={() => setAccountName("")}
          />
        </div>

        <div>
          <div className="w-full flex justify-between pb-[10px]">
            <p className="text-md text-white">자기소개</p>
            <p className="text-md text-white">{description?.length}/100</p>
          </div>
          <GenericInput
            className="h-[190px] rounded-[10px]"
            id={"memo-input"}
            type={"textarea"}
            placeholder={"입력"}
            value={description}
            handleInputChange={(value) => value.length <= 100 && setDescription(value)}
            resetInputValue={() => setDescription("")}
          />
        </div>
      </div>


    </>
  )
}

export default ProfileUpdatePage