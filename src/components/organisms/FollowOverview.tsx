import { useNavigate } from "react-router-dom"

import { useSetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import FollowService from "@/services/followService"

import Loader from "./Loader"
import ListUnit from "./ListUnit"

interface FollowOverview {
  closeModal: () => void,
  props: {
    data: string[],
    type: "followers" | "followings"
    isMyProfile: boolean
  }
}

const FollowOverview = ({ closeModal, props }: FollowOverview) => {

  const { data: users, type, isMyProfile } = props

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const { UserFollowListUnit, UserLinkListUnit } = ListUnit()
  const { ReadFollow, UpdateFollow } = FollowService()
  const { mutate } = UpdateFollow()
  const { data, isLoading } = ReadFollow(users)

  const navigate = useNavigate()

  if (isLoading) return (
    <div className="absolute-center w-[100px]">
      <Loader />
    </div>
  )


  return (
    <div className="px-[15px] w-full">
      {data?.map((singleData, index) => {
        const isFollow = singleData.data.isFollow
        const handleFollow = () => {
          if (type === "followings" && isFollow) {
            mutate({ type: "create", id: singleData.id });
          } else if (type === "followings" && !isFollow) {
            mutate({ type: "delete", id: singleData.id });
          }
        };

        return (
          <>
            {isMyProfile && type === "followings" ? (
              <UserFollowListUnit
                key={index}
                data={singleData}
                followed={!isFollow}
                handleFunc={handleFollow}
              />
            ) : (
              <UserLinkListUnit
                key={index}
                data={singleData.data}
                handleFunc={() => {
                  closeModal()
                  setTimeout(() => {
                    setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
                    navigate("/profile", { state: { direction: "next", id: singleData.id } })
                  }, 200)
                }}
              />
            )
            }
          </>
        );
      })}
    </div>
  );

}

export default FollowOverview