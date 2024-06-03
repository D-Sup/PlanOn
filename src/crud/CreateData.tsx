import React, { useEffect } from "react"
import useFirestoreCreate from "@/hooks/useFirestoreCreate";


export const CreateData = () => {
  const { createDocument, createDocumentManual, createField, createSubcollectionDocument } = useFirestoreCreate("chats");
  useEffect(() => {
    // const now = new Date("2024-04-10 14:10");
    // createDocument({
    //   roro: now
    // })
    createSubcollectionDocument("messages", "message-6TH4LJn9lGl7P3ngwR05", { text: "배고파" })
    // createField("dygTJcENwY6q35DyTNH0", "roro", "d");

    // console.log(result);

  }, [])

  return (
    <div className="text-black">CreateData</div>
  )
}