import { useNavigate, useLocation } from "react-router-dom";

import PostService from "@/services/postService"

import { useEffect } from "react";

const PostDetailEditablePage = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const { ReadOnlyPost } = PostService()
  const { data, isLoading } = ReadOnlyPost(location.pathname.split("/")[4])

  useEffect(() => {
    if (data) {
      navigate("/post/detail", { state: { direction: "next", post: data } })
    }
  }, [isLoading])

  return (
    <></>
  )
}

export default PostDetailEditablePage