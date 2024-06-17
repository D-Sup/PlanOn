import { LinkType } from "@/types/messages.type";

const extractMetaTagService = async (url: string): Promise<LinkType> => {
  try {
    const response = await fetch(`${process.env.REACT_APP_META_TAGS_API_URL}?url=${url}`, {
      method: "GET",
    });
    const data = await response.json();
    return data
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default extractMetaTagService