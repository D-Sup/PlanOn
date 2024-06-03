import React, { useEffect } from "react"
import { useFirestoreUpdate } from "@/hooks/useFirestoreUpdate";
import { arrayUnion } from "firebase/firestore";

export const UpdateData = () => {
  const { updateField, updateFieldObject } = useFirestoreUpdate("posts");

  useEffect(() => {

    // updateFieldByKey("L7LYUfncbLpcZB2zm6QO", "comment", { postId: "3" }, { content: "10123", name: "RjfRjf123123" });
    // updateFieldObject("dygTJcENwY6q35DyTNH0", "contents", { userId: "34" }, { like: [...comments] });
    // updateFieldObject("dygTJcENwY6q35DyTNH0", "contents", { userId: "34" }, { like: [...comments] });
    updateField("ctXjOof22nhAFA9id63i", { private: false })


    // updateField("L7LYUfncbLpcZB2zm6QO", {
    //   content: arrayUnion({
    //     userId: "4",
    //     content: "2",
    //     createdAt: "3",
    //   })
    // })
  }, [])
  return (
    <div>UpdateData</div>
  )
}