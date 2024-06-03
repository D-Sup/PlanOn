import { useNavigate } from "react-router-dom"

import { useSetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import ListUnit from "./ListUnit"

import { ReadDocumentType } from "@/hooks/useFirestoreRead"
import { UsersType } from "@/types/users.type"

interface TagUserOverviewProps {
  closeModal: () => void,
  props: ReadDocumentType<UsersType>[]
}

const TagUserOverview = ({ closeModal, props }: TagUserOverviewProps) => {
  const { UserLinkListUnit } = ListUnit()

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const navigate = useNavigate()

  return (
    <div className="px-[15px]">
      {props.map(({ data }) => (
        <UserLinkListUnit data={data} handleFunc={() => {
          closeModal()
          setTimeout(() => {
            setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
            navigate("/profile", { state: { direction: "next", id: data.authorizationId } })
          }, 200)
        }} />
      ))}
    </div>
  )
}

export default TagUserOverview