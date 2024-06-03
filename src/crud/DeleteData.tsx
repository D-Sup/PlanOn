import React, { useEffect } from "react"
import { useFirestoreDelete } from "@/hooks/useFirestoreDelete";

export const DeleteData = () => {
  const { deleteDocument, deleteFieldArray, deleteFieldObject } = useFirestoreDelete("posts");
  useEffect(() => {
    deleteDocument("OgrAA0o3nOVe7zXGz4H7");
    // deleteFieldByKey("dygTJcENwY6q35DyTNH0", "contents", {
    //   userId: "36x"
    // })
    // deleteFieldArray("ctXjOof22nhAFA9id63i", "likedUsers", "qweqwe")

    // deleteFieldArray("ctXjOof22nhAFA9id63i", "private", false)
  }, [])
  return (
    <div>DeleteData</div>
  )
}
// request.resource.data.diff(resource.data).affectedKeys().hasOnly(["update_requested_time"])

// Compare two Map objects and return whether the key "a" has been
// affected; that is, key "a" was added or removed, or its value was updated.
// request.resource.data.diff(resource.data).affectedKeys().hasOnly(["a"]);