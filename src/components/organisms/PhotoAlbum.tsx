import ImageFrame from "../atoms/ImageFrame";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { PostsType } from "@/types/posts.type";

const PhotoAlbum = ({ data, handleFunc }: { data: ReadDocumentType<PostsType>[], handleFunc: (post: ReadDocumentType<PostsType>) => void }) => {

  return (
    <ul className="m-auto grid grid-cols-3 gap-1">
      {data.map((singleData) => (
        <li
          key={singleData.id}
          className="relative aspect-square bg-background"
          onClick={() => {
            handleFunc(singleData)
          }}
        >
          <ImageFrame src={singleData.data.images[0]} alt={`photo-${singleData.id}`} />
        </li>
      ))}
    </ul>
  )
}

export default PhotoAlbum