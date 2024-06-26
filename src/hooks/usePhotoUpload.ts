import { storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const usePhotoUpload = () => {

  const photoUpload = async (pathToSave: "posts" | "users" | "chats", selectedFiles: File[]): Promise<undefined | string[]> => {
    for (const file of selectedFiles) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise((resolve, reject) => {
          reader.onload = resolve;
          reader.onerror = reject;
        });
      } catch (error) {
        console.error("파일을 읽는데 실패했습니다:", error);
        throw error;
      }
    }

    const urls: string[] = [];
    await Promise.all(selectedFiles.map( async (file, index) => {
      const fileRef = ref(storage, `${pathToSave}/${uuidv4()}`);
      try {
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        urls[index] = downloadURL; // 인덱스를 사용하여 순서 보장
      } catch (error) {
        console.error("이미지 업로드를 실패했습니다:", error);
        throw error;
      }
    }));

    return urls;
  };

  const isPhotoExtensionValid = (files: FileList) => {
    const allowedExtensions = ["jpg", "gif", "png", "jpeg", "bmp", "tif", "heic", "webp"];
    const fileArray = Array.from(files);
    const previewArray = fileArray.map((file) => URL.createObjectURL(file));
    const isValid = fileArray.every(file => {
      const checkedExtension = file.name.split(".").pop()?.toLowerCase() || "";
      return allowedExtensions.includes(checkedExtension);
    });
    return { isValid, fileArray, previewArray };
  }

  return { photoUpload, isPhotoExtensionValid };
};

export default usePhotoUpload;