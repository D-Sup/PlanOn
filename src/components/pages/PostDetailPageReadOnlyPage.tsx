import { useNavigate, useLocation } from "react-router-dom";

import PostService from "@/services/postService"

import Loader from "../organisms/Loader";

const PostDetailPageReadOnlyPage = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const { ReadOnlyPost } = PostService()
  const { data, isLoading } = ReadOnlyPost(location.pathname.split("/")[4])

  if (!isLoading) navigate("/post/detail", { state: { direction: "fade", post: data, isReadOnly: true } })

  return (
    <div className="absolute-center w-[150px]">
      <Loader />
    </div>
  )
}

export default PostDetailPageReadOnlyPage