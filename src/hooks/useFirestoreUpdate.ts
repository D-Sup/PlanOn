import { appFireStore } from "../firebase/config";
import { doc, updateDoc, getDoc } from "firebase/firestore";

import getAccountId from "@/utils/getAccountId";

import { DataModelType } from "@/types/dataModel.type";


const useFirestoreUpdate = (collectionName: string) => {

  const accountId = getAccountId()

  const updateField = async (documentId: string, data: DataModelType): Promise< undefined | string>  => {
    try {
      if (accountId) {
        const docRef = doc(appFireStore, collectionName, documentId);
				const updateData: DataModelType = {};
				for (const [key, value] of Object.entries(data)) {
					updateData[key] = value;
				}
				await updateDoc(docRef, updateData);
				console.log("데이터가 성공적으로 수정되었습니다", docRef.id);
				return docRef.id;
      } else {
        console.error("토큰이 존재하지 않습니다");
      }
    } catch (error) {
      console.error("데이터 수정을 실패했습니다:", error);
      throw error;
    }
  };

	const updateFieldObject = async (
		documentId: string,
		fieldName: string,
		targetObject: DataModelType,
		updateAttributes: DataModelType
	): Promise< undefined | string> => {
		try {
			const docRef = doc(appFireStore, collectionName, documentId);
			const docSnapshot = await getDoc(docRef);
			if (docSnapshot.exists()) {
				const result = docSnapshot.data()[fieldName];
				for (let i = 0; i < result.length; i++) {
					const element = result[i];
					const isTargetObject = Object.keys(targetObject).every(key => element[key] === targetObject[key]);
					if (isTargetObject) {
						result[i] = { ...element, ...updateAttributes };
						break;
					}
				}
				await updateDoc(docRef, {
					[fieldName]: result
				});
				console.log("데이터가 성공적으로 수정되었습니다", docRef.id);
				return docRef.id;
			} else {
				console.error("해당 문서를 찾을 수 없습니다: ", documentId);
				throw new Error(`해당 문서를 찾을 수 없습니다: ${documentId}`);
			}
		} catch (error) {
			console.error("데이터 수정을 실패했습니다:", error);
      throw error;
		}
	};

	return { updateField, updateFieldObject };
};

export default useFirestoreUpdate;