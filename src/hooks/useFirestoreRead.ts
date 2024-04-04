import { appFireStore } from "../firebase/config";
import {
	collection,
	query,
	orderBy,
	where,
	getDocs,
	doc,
	getDoc,
	startAfter,
	limit,
	OrderByDirection,
	QueryConstraint,
	WhereFilterOp,
	DocumentData,
	Timestamp
} from "firebase/firestore";
import useModalStack from "./useModalStack";

export interface ReadDocumentType<T> {
	id: string;
	data: T;
}

const useFirestoreRead = (collectionName: string) => {

	const { openModal } = useModalStack()

	const readDocumentSingle = async <T>(documentId: string): Promise<undefined | ReadDocumentType<T>>=> {
		try {
			const docRef = doc(appFireStore, collectionName, documentId);
			const docSnapshot = await getDoc(docRef);
				const result = { id: docSnapshot.id, data: docSnapshot.data() as T};
				return result;
		} catch (error) {
			console.error("데이터 조회를 실패했습니다:", error);
      throw error;
		}
	};

	const readDocumentAll = async <T>(sortFieldName?: string, sortOrder: OrderByDirection = "desc"): Promise<undefined | ReadDocumentType<T>[]>  => {
		try{
			const collectionRef = collection(appFireStore, collectionName);
			const querySnapshot =
			sortFieldName !== undefined && sortOrder !== undefined ? 
			await getDocs(query(collectionRef, orderBy(sortFieldName, sortOrder))) :
			await getDocs(collectionRef)
			const result = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				data: doc.data() as T
			})) ;
			return result;
		} catch (error) {
			console.error("데이터 조회를 실패했습니다:", error);
      throw error;
		}
	};

const readDocumentsSimplePaged = async <T>(
    data: ReadDocumentType<T>[],
    fieldName: string,
    whereOperator: WhereFilterOp,
    filterValues: string[],
    sortFieldName: string,
    sortOrder: OrderByDirection = "desc",
		includePrivate: boolean,
    pageSize: number = 1,
    handleFunc?: (data: DocumentData | boolean) => void, 
    lastVisible?: null | DocumentData,
    isDataEnd?: boolean
): Promise<undefined | ReadDocumentType<T>[]> => {
    try {
			if (isDataEnd && lastVisible) {
				openModal("Toast", {type: "info", message: "데이터를 모두 불러왔습니다."});
				return data;
			}
			const collectionRef = collection(appFireStore, collectionName);
			const documents: ReadDocumentType<T>[] = data;
			if (fieldName === "id") {
				const docRefs = filterValues.map(id => doc(collectionRef, id));
				const documentSnapshots = await Promise.all(docRefs.map(docRef => getDoc(docRef)));
				documentSnapshots.forEach(doc => {
					if (doc.exists()) {
						documents.push({ id: doc.id, data: doc.data() as T });
					}
				});
				documents.sort((a, b) => {
					const aSeconds = (a.data as Record<string, Timestamp>)[sortFieldName].seconds;
					const bSeconds = (b.data as Record<string, Timestamp>)[sortFieldName].seconds;
			
					if (sortOrder === "asc") {
						return aSeconds - bSeconds;
					} else {
						return bSeconds - aSeconds;
					}
				});	
			} else {
				let q;
				if (!includePrivate) {
					if (lastVisible) {
						q = query(
							collectionRef,
							where(fieldName, whereOperator, filterValues.length === 0 ? [""] : filterValues),
							where("private", "==", false),
							orderBy(sortFieldName, sortOrder),
							startAfter(lastVisible),
							limit(pageSize)
						);
					} else {
						q = query(
							collectionRef,
							where(fieldName, whereOperator, filterValues.length === 0 ? [""] : filterValues),
							where("private", "==", false),
							orderBy(sortFieldName, sortOrder),
							limit(pageSize)
						);
					}
				} else {
					if (lastVisible) {
						q = query(
							collectionRef,
							where(fieldName, whereOperator, filterValues.length === 0 ? [""] : filterValues),
							orderBy(sortFieldName, sortOrder),
							startAfter(lastVisible),
							limit(pageSize)
						);
					} else {
						q = query(
							collectionRef,
							where(fieldName, whereOperator, filterValues.length === 0 ? [""] : filterValues),
							orderBy(sortFieldName, sortOrder),
							limit(pageSize)
						);
					}
				}

				const documentSnapshots = await getDocs(q);

				documentSnapshots.forEach((doc) => {
					documents.push({ id: doc.id, data: doc.data() as T });
				});

				if (documentSnapshots.size < pageSize) {
					isDataEnd = true;
					lastVisible && pageSize !== Infinity && openModal("Toast", {type: "info", message: "데이터를 모두 불러왔습니다."});
				}

				if (documentSnapshots.size > 0) {
					handleFunc && handleFunc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
				} else {
					handleFunc && handleFunc(true);
				}
			}
			return documents;
    } catch (error) {
			console.error("데이터 조회를 실패했습니다:", error);
			throw error;
    }
};

	const readDocumentsPaged = async <T>(
    data: ReadDocumentType<T>[], 
    sortFieldName: string, 
    sortOrder: OrderByDirection = "desc", 
    pageSize: number = 1, 
    handleFunc: (data: DocumentData | boolean) => void, 
    lastVisible: null | DocumentData,
    isDataEnd: boolean
): Promise<undefined | ReadDocumentType<T>[]> => {
    try {
			if (isDataEnd) {
				openModal("Toast", {type: "info", message: "데이터를 모두 불러왔습니다."});
				return data;
			}
			const collectionRef = collection(appFireStore, collectionName);
			let q;
			if (lastVisible) {
				q = query(
					collectionRef, 
					where("private", "==", false), 
					orderBy(sortFieldName, sortOrder), 
					startAfter(lastVisible), 
					limit(pageSize)
				);
			} else {
				q = query(
					collectionRef, 
					where("private", "==", false), 
					orderBy(sortFieldName, sortOrder), 
					limit(pageSize)
				);
			}
			const documentSnapshots = await getDocs(q);
			const lastDocs = documentSnapshots.docs[documentSnapshots.docs.length - 1];
			
			if (lastDocs) {
				handleFunc(lastDocs);
			} else {
				openModal("Toast", {type: "info", message: "데이터를 모두 불러왔습니다."});
				handleFunc(true);
			}
			const documents: ReadDocumentType<T>[] = data;
			documentSnapshots.forEach(doc => {
				documents.push({ id: doc.id, data: doc.data() as T });
			});
			return documents;
	} catch (error) {
			console.error("데이터 조회를 실패했습니다:", error);
			throw error;
	}
};


	const readDocumentQuery = async <T>(fieldName: string, operator: WhereFilterOp, value: string | string[]): Promise<undefined | ReadDocumentType<T>[]> => {
		try{
			const q = query(
				collection(appFireStore, collectionName),
				where(fieldName, operator, value)
			);
			const querySnapshot = await getDocs(q);
			const result = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				data: doc.data() as T,
			}));
			return result;
		} catch (error) {
			console.error("데이터 조회를 실패했습니다:", error);
      throw error;
		}
	};

	const readSubCollection = async <T>(
    documentId: string,
    subCollectionName: string,
    whereFieldName?: string,
    whereOperator?: WhereFilterOp,
    whereValue?: string | null
	): Promise<undefined | ReadDocumentType<T>[]> => {
		try {
			const subCollectionRef = collection(appFireStore, collectionName, documentId, subCollectionName);
			const queryConstraints: QueryConstraint[] = [];

			if (whereFieldName) {
				queryConstraints.push(where(whereFieldName, whereOperator, whereValue));
			}

			const q = query(subCollectionRef, ...queryConstraints);
			const querySnapshot = await getDocs(q);

			const result = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				data: doc.data() as T,
			}));

			return result;
		} catch (error) {
			console.error("서브 컬렉션 데이터 조회를 실패했습니다:", error);
			throw error;
		}
};

	return { readDocumentSingle, readDocumentAll, readDocumentsSimplePaged, readDocumentsPaged, readDocumentQuery, readSubCollection };
};

export default useFirestoreRead;