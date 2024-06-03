import React, { useEffect } from "react"
import useFirestoreRead from "@/hooks/useFirestoreRead";

export const ReadData = () => {
  const { readDocumentSingle, readDocumentQuery, readSubCollection } = useFirestoreRead("chats");
  useEffect(() => {
    const fetchData = async () => {
      // const response = await readAllDocument("createdAt", "desc");
      // const response = await readDocumentSingle("ctXjOof22nhAFA9id63i");
      // const response = await readField("content", "==", "aaa");
      // const response = await readDocumentQuery("authorizationId", "in", ["BqVl8y1YONc777JGwisfOcYucrZ2", "slAeoXqXoae5x7UAWBUjZUULcnm2"]);
      const response = await readSubCollection("messages", "message-6TH4LJn9lGl7P3ngwR05", "createdAt")
      console.log(response);
    }
    fetchData();
  }, [])
  return (
    <div>GetData</div>
  )
}