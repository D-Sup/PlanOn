import { appFireStore, timestamp } from "../firebase/config";
import { collection, doc, setDoc, addDoc, updateDoc, arrayUnion } from "firebase/firestore";

import getAccountId from "@/utils/getAccountId";

import { DataModelType, ModelValue } from "@/types/dataModel.type";

const useFirestoreCreate = (collectionName: string) => {

  const accountId = getAccountId()
  const createdAt = timestamp.fromDate(new Date());

  const createDocument = async (data: DataModelType): Promise<undefined | string> => {
    try {
      if (accountId) {
        const docRef = await addDoc(collection(appFireStore, collectionName), 
        { 
          ...data, 
          authorizationId: accountId,
          createdAt 
        });
        console.log("데이터가 성공적으로 생성되었습니다:", docRef.id);
        return docRef.id
      } else {
        console.error("토큰이 존재하지 않습니다");
      }
    } catch (error) {
      console.error("데이터 생성을 실패했습니다:", error);
      throw error;
    }
  }

  const createDocumentManual = async (documentId: string, data: DataModelType): Promise<undefined | string> => {
    try {
      if (accountId) {
        const docRef = doc(appFireStore, collectionName, documentId);
        await setDoc(docRef, {
          ...data, 
          authorizationId: accountId,
          createdAt 
        });
        console.log("데이터가 성공적으로 생성되었습니다:", docRef.id);
        return docRef.id;
      } else {
        console.error("토큰이 존재하지 않습니다");
      }
    } catch (error) {
      console.error("데이터 생성을 실패했습니다:", error);
      throw error;
    }
  }

  const createFieldArray = async (documentId: string, fieldName: string, data: ModelValue): Promise<undefined | string> => {
    try {
      if (accountId) {
        const docRef = doc(appFireStore, collectionName, documentId);
        await updateDoc(docRef, {
          [fieldName]: arrayUnion(data)
        });
        console.log("데이터가 성공적으로 추가되었습니다",  docRef.id);
        return docRef.id;
      } else {
        console.error("토큰이 존재하지 않습니다");
      }
    } catch (error) {
      console.error("데이터 생성을 실패했습니다:", error);
      throw error;
    }
  }
  
  const createFieldObject = async (documentId: string, fieldName: string , data: DataModelType): Promise<undefined | string> => {
		try {
			if (accountId) {
				const docRef = doc(appFireStore, collectionName, documentId);
        const createData = {
          [fieldName]: arrayUnion({...data, createdAt})
        };
        await updateDoc(docRef, createData);
        console.log("데이터가 성공적으로 추가되었습니다",  docRef.id);
        return docRef.id;
			} else {
				console.error("토큰이 존재하지 않습니다");
			}
		} catch (error) {
			console.error("데이터 생성을 실패했습니다:", error);
      throw error;
		}
  }

  const createSubcollection = async (documentId: string, subcollectionName: string, data: DataModelType): Promise<undefined | string> => {
    try {
      if (accountId) {
        const subcollectionRef = collection(appFireStore, `${collectionName}/${documentId}/${subcollectionName}`);
        const subDocRef = await addDoc(subcollectionRef, { 
          ...data, 
          createdAt 
        });
        console.log("서브컬렉션 내 문서가 성공적으로 생성되었습니다:", subDocRef.id);
        return subDocRef.id;
      } else {
        console.error("토큰이 존재하지 않습니다");
      }
    } catch (error) {
      console.error("서브컬렉션 내 문서 생성을 실패했습니다:", error);
      throw error;
    }
  }

  return { createDocument, createDocumentManual, createFieldArray, createFieldObject, createSubcollection };
}

export default useFirestoreCreate;
