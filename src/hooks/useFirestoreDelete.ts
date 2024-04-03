import { appFireStore } from "../firebase/config";
import { doc, deleteDoc, getDoc, updateDoc, arrayRemove, collection, query, getDocs } from "firebase/firestore";

import getAccountId from "@/utils/getAccountId";

import { DataModelType, ModelValue } from "@/types/dataModel.type";

const useFirestoreDelete = (collectionName: string) => {

  const accountId = getAccountId()

	const deleteDocument = async (documentId: string): Promise<undefined | string> => {
		try {
			if (accountId) {
				const docRef = doc(appFireStore, collectionName, documentId);
				await deleteDoc(docRef);
				console.log("데이터가 성공적으로 삭제되었습니다", docRef);
				return docRef.id;
			} else {
				console.error("토큰이 존재하지 않습니다");
			}
		} catch (error) {
			console.error("데이터 삭제를 실패했습니다:", error);
      throw error;
		}
	};

	const deleteFieldArray = async (documentId: string, fieldName: string, data: ModelValue): Promise<undefined | string> => {
    try {
      if (accountId) {
				const docRef = doc(appFireStore, collectionName, documentId);
				await updateDoc(docRef, {
					[fieldName]: arrayRemove(data)
				});
				console.log("데이터가 성공적으로 삭제되었습니다",  docRef.id);
				return docRef.id;
			} else {
				console.error("토큰이 존재하지 않습니다");
			}
    } catch (error) {
      console.error("데이터 삭제를 실패했습니다:", error);
      throw error;
    }
  }

	const	deleteFieldObject = async (documentId: string, fieldName: string, targetObject: DataModelType): Promise<undefined | string> => {
    try {
      if (accountId) {
			const docRef = doc(appFireStore, collectionName, documentId);
			const docSnapshot = await getDoc(docRef);
				if (docSnapshot.exists()) {
					const result = docSnapshot.data()[fieldName];
					for (let i = 0; i < result.length; i++) {
						const element = result[i];
						const isTargetObject = Object.keys(targetObject).every(key => element[key] === targetObject[key]);
						if (isTargetObject) {
							result.splice(i, 1);
							break;
						}
					}
					await updateDoc(docRef, {
						[fieldName]: result
					});
					console.log("데이터가 성공적으로 삭제되었습니다", docRef.id);
					return docRef.id;
				} else {
					console.error("해당 문서를 찾을 수 없습니다: ", documentId);
				}
			} else {
				console.error("토큰이 존재하지 않습니다");
			}
		} catch(error) {
			console.error("데이터 삭제를 실패했습니다:", error);
      throw error;
		}
	}

	const deleteSubcollection = async (documentId: string, subcollectionName: string): Promise<void> => {
		try {
			const subcollectionRef = collection(appFireStore, `${collectionName}/${documentId}/${subcollectionName}`);
			const q = query(subcollectionRef);
			const querySnapshot = await getDocs(q);
	
			const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
			await Promise.all(deletePromises);
	
			console.log("데이터가 성공적으로 삭제되었습니다", subcollectionName);
		} catch (error) {
      console.error("데이터 삭제를 실패했습니다:", error);
			throw error;
		}
	};

	return { deleteDocument, deleteFieldArray, deleteFieldObject, deleteSubcollection };
};

export default useFirestoreDelete;