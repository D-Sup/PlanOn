import { useNavigate } from "react-router-dom"

import { useSetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import UserLinkListUnit from "./UserLinkListUnit"

import { ReadDocumentType } from "@/hooks/useFirestoreRead"
import { UsersType } from "@/types/users.type"

interface TagUserOverviewProps {
  closeModal: () => void,
  props: ReadDocumentType<UsersType>[]
}

const TagUserOverview = ({ closeModal, props }: TagUserOverviewProps) => {

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const navigate = useNavigate()

  return (
    <div className="px-[15px]">
      {props.map(({ data }) => (
        <UserLinkListUnit data={data} handleFunc={() => {
          closeModal()
          setTimeout(() => {
            setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
            navigate(`/profile/${data.authorizationId}`, { state: { direction: "next" } })
          }, 400)
        }} />
      ))}
    </div>
  )
}

export default TagUserOverview