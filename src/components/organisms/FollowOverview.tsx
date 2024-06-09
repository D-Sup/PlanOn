import { useNavigate } from "react-router-dom"

import { useSetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import FollowService from "@/services/followService"

import Loader from "./Loader"
import ListUnit from "./ListUnit"
import UserLinkListUnit from "./UserLinkListUnit"

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

  const { UserFollowListUnit } = ListUnit()
  const { ReadFollow, UpdateFollow } = FollowService()
  const { mutate } = UpdateFollow()
  const { data, isLoading } = ReadFollow(users)

  const navigate = useNavigate()

  if (isLoading) return (
    <div className="absolute-center w-[100px]">
      <Loader />
    </div>
  )


  const goToProfile = (id: string) => {
    closeModal()
    setTimeout(() => {
      setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
      navigate(`/profile/${id}`, { state: { direction: "next" } })
    }, 400)
  }

  return (
    <div className="px-[15px] w-full">
      {data?.map((singleData) => {
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
                key={singleData.id}
                data={singleData}
                followed={!isFollow}
                handleFunc={[() => goToProfile(singleData.id), handleFollow]}
              />
            ) : (
              <UserLinkListUnit
                key={singleData.id}
                data={singleData.data}
                handleFunc={() => {
                  goToProfile(singleData.id)
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