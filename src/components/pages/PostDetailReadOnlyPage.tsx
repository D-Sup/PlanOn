import { useNavigate, useLocation } from "react-router-dom";

import PostService from "@/services/postService"

import Loader from "../organisms/Loader";
import { useEffect } from "react";

const PostDetailReadOnlyPage = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const { ReadOnlyPost } = PostService()
  const { data, isLoading } = ReadOnlyPost(location.pathname.split("/")[4])

  useEffect(() => {
    if (data) {
      navigate("/post/detail", { state: { direction: "fade", post: data, isReadOnly: true } })
    }
  }, [isLoading])


  return (
    <div className="absolute-center w-[150px]">
      <Loader />
    </div>
  )
}

export default PostDetailReadOnlyPage