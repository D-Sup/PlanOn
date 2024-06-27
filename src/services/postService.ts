import usePhotoUpload from "@/hooks/usePhotoUpload";
import useFirestoreCreate from "@/hooks/useFirestoreCreate";
import useFirestoreRead from "@/hooks/useFirestoreRead";
import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";
import useFirestoreDelete from "@/hooks/useFirestoreDelete";
import notificationService from "./notificationService";

import useDataQuery from "@/hooks/useDataQuery";
import useDataMutation from "@/hooks/useDataMutation";
import { useQueryClient } from "@tanstack/react-query";

import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { postFormValue, paginationValue, isPaginationValueModifiedSelector } from "@/store";

import getAccountId from "@/utils/getAccountId";
import generateKeywordCombinations from "@/utils/generateKeywordCombinations";
import { v4 as uuidv4 } from "uuid";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { UsersType } from "@/types/users.type";
import { PostsType } from "@/types/posts.type";
import { SchedulesType } from "@/types/schedules.type";
import { DocumentData } from "firebase/firestore";
import { PostFormValueType } from "@/store";
import { HashtagsType } from "@/types/hashtags.type";

import { produce } from "immer"
import { LocationsType } from "@/types/locations.type";

export type PostMachinedType = ReadDocumentType<PostsType & {userInfo: UsersType, tagUserInfo: ReadDocumentType<UsersType>[], scheduleInfo: SchedulesType}>

const PostService =  () => {

  const accountId = getAccountId()
  const setPaginationValue = useSetRecoilState(paginationValue)
  
  const CreatePost = (userData: UsersType, onSuccess: () => void, onError: () => void) => {
    const postFormState = useRecoilValue(postFormValue);
    const { photoUpload } = usePhotoUpload();
    const { readDocumentSingle: readDocumentSingleUsers, readDocumentsSimplePaged } = useFirestoreRead("users");
    const { readDocumentSingle: readDocumentSingleSchedules } = useFirestoreRead("schedules");
    const { readDocumentSingle: readDocumentSingleLocations } = useFirestoreRead("locations");
    const { createDocumentManual: createDocumentManualHashtags, createFieldArray: createFieldArrayHashtags } = useFirestoreCreate("hashtags");
    const { createDocumentManual: createDocumentManualLocations, createFieldArray: createFieldArrayLocations } = useFirestoreCreate("locations");
    const { createDocumentManual: createDocumentManualPosts } = useFirestoreCreate("posts");
    const { createFieldObject } = useFirestoreCreate("users")

    const { mutate, isPending } = useDataMutation(
      ["all-posts", "following-posts", "like-posts", "tag-posts"],
      async () => {
        const uploadedPhotos =  await photoUpload("posts", postFormState.photos.checked.map(index => postFormState.photos.file[index]))
        
        const { filteredTags, remainingTags } = postFormState.hashtags.reduce((acc, item) => {
          if ("createTag" in item.data) {
            acc.filteredTags.push(item);
          } else {
            acc.remainingTags.push(item);
          }
          return acc;
        }, { filteredTags: [] as ReadDocumentType<HashtagsType>[], remainingTags: [] as ReadDocumentType<HashtagsType>[]});
        
        if (uploadedPhotos) {
          const postId = uuidv4() 
          const uploadedPost = await Promise.all([
            Promise.all(filteredTags.map((tag)=> (
              createDocumentManualHashtags(tag.id, {tagKeywords: generateKeywordCombinations(tag.id), taggedPostIds: [postId]})
            ))),
            Promise.all(remainingTags.map((tag) => {
              createFieldArrayHashtags(tag.id, "taggedPostIds", postId)
            })),
            (async () => {
              createDocumentManualPosts(postId, {
                private: postFormState.private,
                images: uploadedPhotos,
                content: postFormState.content,
                likedUsers: [],
                comments: [],
                hashtags: postFormState.hashtags.map(hashtag => hashtag.id),
                usertags: postFormState.usertags.map(usertag => usertag.id),
                scheduleId: postFormState.scheduleId
              })
            })(),
            (async () => {
              const readedSchedule = postFormState.scheduleId && await readDocumentSingleSchedules<SchedulesType>(postFormState.scheduleId)
              if (readedSchedule) {
                const placeName = readedSchedule.data.scheduleLocation.placeName
                const readedLocation = await readDocumentSingleLocations<LocationsType>(placeName)
                if (readedLocation.data) {
                  createFieldArrayLocations(placeName, "taggedPostIds", postId)
                } else {
                  createDocumentManualLocations(placeName, {locationKeywords: generateKeywordCombinations(placeName), taggedPostIds: [postId]})
                }
              }
            })(),
            (async () => {
              Promise.all(
                postFormState.usertags.map(async (usertag) => {
                  const readedUser = await readDocumentSingleUsers<UsersType>(usertag.id)
                  if (readedUser) {
                    createFieldObject(
                      usertag.id,
                      "notificationHistory",
                      {
                        type: "post",
                        notificationUrl: postId,
                        id: uuidv4(),
                        icon: `${userData.accountImage}`,
                        title: `${userData.accountName}님이 회원님을 태그했습니다.`,
                        body: `${postFormState.content}`,
                        createdAt: new Date(),
                      }
                    )
                    notificationService(
                      readedUser.data.deviceToken,
                      `post/detail/writable/${postId}`,
                      `${userData.accountName}님이 회원님을 태그했습니다.`,
                      `${postFormState.content}`,
                      `${userData.accountImage}`
                    );
                  }
                })
                )
            })()
          ])
          if (uploadedPost) {
            setPaginationValue(Prev => ({...Prev, 
              posts: {
                lastVisible: null,
                isDataEnd: false
              },
            }))
          const readedUsers = userData.followers.length !== 0 && await readDocumentsSimplePaged<UsersType>([], "authorizationId", "in", userData.followers, "createdAt", "desc", true, Infinity)
          if (readedUsers) {
            Promise.all(
              readedUsers.map(async (user) => {
                createFieldObject(
                  user.data.authorizationId,
                  "notificationHistory",
                  {
                    type: "post",
                    notificationUrl: postId,
                    id: uuidv4(),
                    icon: `${userData.accountImage}`,
                    title: `${userData.accountName}님이 게시물을 게시했습니다.`,
                    body: `${postFormState.content}`,
                    createdAt: new Date(),
                  }
                )
                notificationService(
                  user.data.deviceToken,
                  `post/detail/writable/${postId}`,
                  `${userData.accountName}님이 게시물을 게시했습니다.`,
                  `${postFormState.content}`,
                  `${userData.accountImage}`
                );
              })
            )
          }
          }
        }
      }, 
      onSuccess, 
      onError
    )
      
    return { mutate, isPending }
  }

  const ReadPostAll = () => {
    const { readDocumentQuery } = useFirestoreRead("posts")
    const accountId = getAccountId()
    const { data, isLoading, refetch } = useDataQuery<ReadDocumentType<PostsType>[], Error, ReadDocumentType<PostsType>[]>(
      "my-posts",
      ()=> readDocumentQuery<PostsType>("authorizationId", "==", accountId),
      (data) => data,
      {
        staleTime: Infinity,
        gcTime: Infinity,
      },
      false
    )
    return { data, isLoading, refetch }
  }

  const ReadPostAllOther = (id: string) => {
    const { readDocumentsSimplePaged } = useFirestoreRead("posts")
    const { data, isLoading, refetch } = useDataQuery<ReadDocumentType<PostsType>[], Error, ReadDocumentType<PostsType>[]>(
      "other-posts",
      () => readDocumentsSimplePaged<PostsType>([], "authorizationId", "in", [id], "createdAt", "desc", false, Infinity),
      (data) => data,
      {
        staleTime: 300000,
        gcTime: 600000,
      },
      false
    )
    return { data, isLoading, refetch }
  }

  const ReadPostAllSearch = (fieldName: string, ids: string[]) => {
    const { readDocumentsSimplePaged } = useFirestoreRead("posts")

    const { data, isLoading } = useDataQuery<ReadDocumentType<PostsType>[], Error, ReadDocumentType<PostsType>[]>(
      "search-posts",
      ()=> readDocumentsSimplePaged<PostsType>([], fieldName, "in", ids, "createdAt", "desc", false, Infinity),
      (data) => data,
      {
        staleTime: 0,
        gcTime: 0
      }
    )
    return { data, isLoading }
  }

  const ReadOnlyPost = (id: string) => {
    const { readDocumentSingle } = useFirestoreRead("posts")
    const { data, isLoading } = useDataQuery<ReadDocumentType<PostsType>, Error, ReadDocumentType<PostsType>>(
      "readonly-posts",
      () => readDocumentSingle<PostsType>(id),
      (data) => data,
      {
        staleTime: 0,
        gcTime: 0,
      },
    )
    return { data, isLoading }
  }

  const ReadPostSingle = (post: ReadDocumentType<PostsType>) => {
    const { readDocumentQuery  } = useFirestoreRead("users")
    const { readDocumentSingle } = useFirestoreRead("schedules")

    const { data, isLoading, refetch } = useDataQuery<PostMachinedType, Error, PostMachinedType>(
      "single-posts",
      async ()=> {
        const [readedUsers, readedTaggedUsers, schedule] = await Promise.all([
          readDocumentQuery<UsersType>("authorizationId", "==", post.data.authorizationId),
          (()=> {
            if (post.data.usertags.length !== 0) {
              return readDocumentQuery<UsersType>("authorizationId", "in", post.data.usertags)
            }
          })(),
          (()=> {
            if (post.data.scheduleId !== "") {
              return readDocumentSingle<SchedulesType>(post.data.scheduleId)
            }
          })()
        ])

        const updatedPost = produce(post, (draft: PostMachinedType ) => {
          if (readedUsers && readedTaggedUsers && schedule) {
              draft.data.userInfo = readedUsers[0].data;
              draft.data.tagUserInfo = readedTaggedUsers;
              draft.data.scheduleInfo = schedule.data;
            } else if (readedUsers && readedTaggedUsers && !schedule) {
              draft.data.userInfo = readedUsers[0].data;
              draft.data.tagUserInfo = readedTaggedUsers;
            } else if (readedUsers && !readedTaggedUsers && schedule) {
              draft.data.userInfo = readedUsers[0].data;
              draft.data.scheduleInfo = schedule.data;
            } else if (readedUsers && !readedTaggedUsers && !schedule)
              draft.data.userInfo = readedUsers[0].data;
          })
        return updatedPost;
      },
      (data) => data,
      {
        staleTime: 300000,
        gcTime: 600000
      }
    )
    return { data, isLoading, refetch }
  }

  const ReadPostAllPaged = () => {
    const { readDocumentsPaged } = useFirestoreRead("posts")
    const { readDocumentQuery  } = useFirestoreRead("users")
    const { readDocumentSingle } = useFirestoreRead("schedules")

    const queryClient = useQueryClient();

    const [paginationValueState, setPaginationValueState] = useRecoilState(paginationValue)
    const isPaginationValueModified = useRecoilValue(isPaginationValueModifiedSelector);

    const handlePaginationValueState = (data: DocumentData | boolean) => {
      setPaginationValueState((Prev) =>
        produce(Prev, (draft) => {
          if (typeof data === "boolean") {
            draft.posts.isDataEnd = data
          } else {
            draft.posts.lastVisible = data
          }
        })
      )
    }

    const { data, isFetching, isLoading, refetch } = useDataQuery<PostMachinedType[], Error, PostMachinedType[]>(
      "all-posts",
      async ()=> {
        const currentData = isPaginationValueModified ? queryClient.getQueryData<PostMachinedType[]>(["all-posts"]) || [] : [];
        const readedPosts = await readDocumentsPaged<PostsType>(
          currentData, 
          "createdAt", 
          "desc", 
          3, 
          handlePaginationValueState, 
          paginationValueState.posts.lastVisible, 
          paginationValueState.posts.isDataEnd
        )
        if (readedPosts) {
          const lastUpdatedPosts = readedPosts.slice(0,-3);
          const updatedPosts = await Promise.all(readedPosts.slice(-3).map(async post => {
            const [readedUsers, readedTaggedUsers, schedule] = await Promise.all([
              readDocumentQuery<UsersType>("authorizationId", "==", post.data.authorizationId),
              (()=> {
                if (post.data.usertags.length !== 0) {
                  return readDocumentQuery<UsersType>("authorizationId", "in", post.data.usertags)
                }
              })(),
              (()=> {
                if (post.data.scheduleId !== "") {
                  return readDocumentSingle<SchedulesType>(post.data.scheduleId)
                }
              })()
            ])

            const updatedPost = produce(post, (draft: PostMachinedType ) => {
              if (readedUsers && readedTaggedUsers && schedule) {
                  draft.data.userInfo = readedUsers[0].data;
                  draft.data.tagUserInfo = readedTaggedUsers;
                  draft.data.scheduleInfo = schedule.data;
                } else if (readedUsers && readedTaggedUsers && !schedule) {
                  draft.data.userInfo = readedUsers[0].data;
                  draft.data.tagUserInfo = readedTaggedUsers;
                } else if (readedUsers && !readedTaggedUsers && schedule) {
                  draft.data.userInfo = readedUsers[0].data;
                  draft.data.scheduleInfo = schedule.data;
                } else if (readedUsers && !readedTaggedUsers && !schedule)
                  draft.data.userInfo = readedUsers[0].data;
              })
            return updatedPost;
          }));

          if (readedPosts.length > 1 && updatedPosts) {
            return [...lastUpdatedPosts, ...updatedPosts]
          } else if (updatedPosts) {
            return updatedPosts
          }
        }
      },
      (data) => data,
      {
        staleTime: 26000000,
        gcTime: 520000000,
      },
      false
    )

    const reset = () => {
      queryClient.resetQueries({ queryKey: ["all-posts"], exact: true })
    }

    return { data, isFetching, isLoading, refetch, reset }
  }

  const ReadPostFollowPaged = () => {
    const { readDocumentsSimplePaged } = useFirestoreRead("posts")
    const { readDocumentSingle: readDocumentUsers, readDocumentQuery } = useFirestoreRead("users")
    const { readDocumentSingle: readDocumentSchedules } = useFirestoreRead("schedules")

    const queryClient = useQueryClient();
    
    const [paginationValueState, setPaginationValueState] = useRecoilState(paginationValue)
    const isPaginationValueModified = useRecoilValue(isPaginationValueModifiedSelector);

    const handlePaginationValueState = (data: DocumentData | boolean) => {
      setPaginationValueState((Prev) =>
        produce(Prev, (draft) => {
          if (typeof data === "boolean") {
            draft.posts.isDataEnd = data
          } else {
            draft.posts.lastVisible = data
          }
        })
      )
    }

    const { data, isFetching, isLoading, refetch } = useDataQuery<PostMachinedType[], Error, PostMachinedType[]>(
      "following-posts",
      async ()=> {
        const readedUser = await readDocumentUsers<UsersType>(accountId)
        if (readedUser) {
          const currentData = isPaginationValueModified ? queryClient.getQueryData<PostMachinedType[]>(["following-posts"]) || [] : [];
          const readedPosts = await readDocumentsSimplePaged<PostsType>(
            currentData, 
            "authorizationId", 
            "in",
            readedUser.data.followings, 
            "createdAt",
            "desc",
            false,
            3,
            handlePaginationValueState,
            paginationValueState.posts.lastVisible, 
            paginationValueState.posts.isDataEnd
          )
          if (readedPosts) {
            const lastUpdatedPosts = readedPosts.slice(0,-3);
            const updatedPosts = await Promise.all(readedPosts.slice(-3).map(async post => {
            const [readedUsers, readedTaggedUsers, schedule] = await Promise.all([
              readDocumentQuery<UsersType>("authorizationId", "==", post.data.authorizationId),
              (()=> {
                if (post.data.usertags.length !== 0) {
                  return readDocumentQuery<UsersType>("authorizationId", "in", post.data.usertags)
                }
              })(),
              (()=> {
                if (post.data.scheduleId !== "") {
                  return readDocumentSchedules<SchedulesType>(post.data.scheduleId)
                }
              })()
            ])

            const updatedPost = produce(post, (draft: PostMachinedType ) => {
              if (readedUsers && readedTaggedUsers && schedule) {
                  draft.data.userInfo = readedUsers[0].data;
                  draft.data.tagUserInfo = readedTaggedUsers;
                  draft.data.scheduleInfo = schedule.data;
                } else if (readedUsers && readedTaggedUsers && !schedule) {
                  draft.data.userInfo = readedUsers[0].data;
                  draft.data.tagUserInfo = readedTaggedUsers;
                } else if (readedUsers && !readedTaggedUsers && schedule) {
                  draft.data.userInfo = readedUsers[0].data;
                  draft.data.scheduleInfo = schedule.data;
                } else if (readedUsers && !readedTaggedUsers && !schedule)
                  draft.data.userInfo = readedUsers[0].data;
              })
            return updatedPost;
            }));
            if (readedPosts.length > 1 && updatedPosts) {
              return [...lastUpdatedPosts, ...updatedPosts]
            } else if (updatedPosts) {
              return updatedPosts
            }
          }
        }
      },
      (data) => data,
      {
        staleTime: 26000000,
        gcTime: 520000000,
      },
      false
    )

    const reset = () => {
      queryClient.resetQueries({ queryKey: ["following-posts"], exact: true })
    }

    return { data, isFetching, isLoading, refetch, reset }
  }

  const ReadPostLikePaged = () => {
    const { readDocumentsSimplePaged } = useFirestoreRead("posts")
    const { readDocumentQuery } = useFirestoreRead("users")
    const { readDocumentSingle: readDocumentSchedules } = useFirestoreRead("schedules")

    const queryClient = useQueryClient();
    
    const [paginationValueState, setPaginationValueState] = useRecoilState(paginationValue)
    const isPaginationValueModified = useRecoilValue(isPaginationValueModifiedSelector);

    const handlePaginationValueState = (data: DocumentData | boolean) => {
      setPaginationValueState((Prev) =>
        produce(Prev, (draft) => {
          if (typeof data === "boolean") {
            draft.posts.isDataEnd = data
          } else {
            draft.posts.lastVisible = data
          }
        })
      )
    }

    const { data, isFetching, isLoading, refetch } = useDataQuery<PostMachinedType[], Error, PostMachinedType[]>(
      "like-posts",
      async ()=> {
        const currentData = isPaginationValueModified ? queryClient.getQueryData<PostMachinedType[]>(["like-posts"]) || [] : [];
        const readedPosts = await readDocumentsSimplePaged<PostsType>(
          currentData, 
          "likedUsers", 
          "array-contains",
          accountId, 
          "createdAt",
          "desc",
          false,
          3,
          handlePaginationValueState,
          paginationValueState.posts.lastVisible, 
          paginationValueState.posts.isDataEnd
        )
        if (readedPosts) {
          const lastUpdatedPosts = readedPosts.slice(0,-3);
          const updatedPosts = await Promise.all(readedPosts.slice(-3).map(async post => {
          const [readedUsers, readedTaggedUsers, schedule] = await Promise.all([
            readDocumentQuery<UsersType>("authorizationId", "==", post.data.authorizationId),
            (()=> {
              if (post.data.usertags.length !== 0) {
                return readDocumentQuery<UsersType>("authorizationId", "in", post.data.usertags)
              }
            })(),
            (()=> {
              if (post.data.scheduleId !== "") {
                return readDocumentSchedules<SchedulesType>(post.data.scheduleId)
              }
            })()
          ])

          const updatedPost = produce(post, (draft: PostMachinedType ) => {
            if (readedUsers && readedTaggedUsers && schedule) {
                draft.data.userInfo = readedUsers[0].data;
                draft.data.tagUserInfo = readedTaggedUsers;
                draft.data.scheduleInfo = schedule.data;
              } else if (readedUsers && readedTaggedUsers && !schedule) {
                draft.data.userInfo = readedUsers[0].data;
                draft.data.tagUserInfo = readedTaggedUsers;
              } else if (readedUsers && !readedTaggedUsers && schedule) {
                draft.data.userInfo = readedUsers[0].data;
                draft.data.scheduleInfo = schedule.data;
              } else if (readedUsers && !readedTaggedUsers && !schedule)
                draft.data.userInfo = readedUsers[0].data;
            })
          return updatedPost;
          }));
          if (readedPosts.length > 1 && updatedPosts) {
            return [...lastUpdatedPosts, ...updatedPosts]
          } else if (updatedPosts) {
            return updatedPosts
          }
        }
      },
      (data) => data,
      {
        staleTime: 26000000,
        gcTime: 520000000,
      },
      false
    )

    const reset = () => {
      queryClient.resetQueries({ queryKey: ["like-posts"], exact: true })
    }

    return { data, isFetching, isLoading, refetch, reset }
  }

  const ReadPostTagPaged = (tags: string[]) => {
    const { readDocumentsSimplePaged } = useFirestoreRead("posts")
    const { readDocumentQuery } = useFirestoreRead("users")
    const { readDocumentSingle: readDocumentSchedules } = useFirestoreRead("schedules")

    const queryClient = useQueryClient();
    
    const [paginationValueState, setPaginationValueState] = useRecoilState(paginationValue)
    const isPaginationValueModified = useRecoilValue(isPaginationValueModifiedSelector);

    const handlePaginationValueState = (data: DocumentData | boolean) => {
      setPaginationValueState((Prev) =>
        produce(Prev, (draft) => {
          if (typeof data === "boolean") {
            draft.posts.isDataEnd = data
          } else {
            draft.posts.lastVisible = data
          }
        })
      )
    }

    const { data, isFetching, isLoading, refetch } = useDataQuery<PostMachinedType[], Error, PostMachinedType[]>(
      "tag-posts",
      async ()=> {
        const currentData = isPaginationValueModified ? queryClient.getQueryData<PostMachinedType[]>(["tag-posts"]) || [] : [];
        const readedPosts = await readDocumentsSimplePaged<PostsType>(
          currentData, 
          "hashtags",
          "array-contains-any",
          tags, 
          "createdAt",
          "desc",
          false,
          3,
          handlePaginationValueState,
          paginationValueState.posts.lastVisible, 
          paginationValueState.posts.isDataEnd
        )
        if (readedPosts) {
          const lastUpdatedPosts = readedPosts.slice(0,-3);
          const updatedPosts = await Promise.all(readedPosts.slice(-3).map(async post => {
          const [readedUsers, readedTaggedUsers, schedule] = await Promise.all([
            readDocumentQuery<UsersType>("authorizationId", "==", post.data.authorizationId),
            (()=> {
              if (post.data.usertags.length !== 0) {
                return readDocumentQuery<UsersType>("authorizationId", "in", post.data.usertags)
              }
            })(),
            (()=> {
              if (post.data.scheduleId !== "") {
                return readDocumentSchedules<SchedulesType>(post.data.scheduleId)
              }
            })()
          ])

          const updatedPost = produce(post, (draft: PostMachinedType ) => {
            if (readedUsers && readedTaggedUsers && schedule) {
                draft.data.userInfo = readedUsers[0].data;
                draft.data.tagUserInfo = readedTaggedUsers;
                draft.data.scheduleInfo = schedule.data;
              } else if (readedUsers && readedTaggedUsers && !schedule) {
                draft.data.userInfo = readedUsers[0].data;
                draft.data.tagUserInfo = readedTaggedUsers;
              } else if (readedUsers && !readedTaggedUsers && schedule) {
                draft.data.userInfo = readedUsers[0].data;
                draft.data.scheduleInfo = schedule.data;
              } else if (readedUsers && !readedTaggedUsers && !schedule)
                draft.data.userInfo = readedUsers[0].data;
            })
          return updatedPost;
          }));
          if (readedPosts.length > 1 && updatedPosts) {
            return [...lastUpdatedPosts, ...updatedPosts]
          } else if (updatedPosts) {
            return updatedPosts
          }
        }
      },
      (data) => data,
      {
        staleTime: 26000000,
        gcTime: 520000000,
      },
      false
    )

    const reset = () => {
      queryClient.resetQueries({ queryKey: ["tag-posts"], exact: true })
    }

    return { data, isFetching, isLoading, refetch, reset }
  }

  const UpdatePost = (id: string, data: PostFormValueType, onSuccess: () => void, onError: () => void) => {
    const { createDocumentManual: createDocumentManualHashtags, createFieldArray: createFieldArrayHashtags } = useFirestoreCreate("hashtags");
    const { createDocumentManual: createDocumentManualLocations, createFieldArray: createFieldArrayLocations } = useFirestoreCreate("locations")
    const { readDocumentQuery: readDocumentQueryHashtags } = useFirestoreRead("hashtags")
    const { readDocumentQuery: readDocumentQueryLocations, readDocumentSingle: readDocumentSingleLocations } = useFirestoreRead("locations")
    const { readDocumentSingle: readDocumentSingleSchedules } = useFirestoreRead("schedules");
    const { deleteFieldArray: deleteFieldArrayHashtags } = useFirestoreDelete("hashtags");
    const { deleteFieldArray: deleteFieldArrayLocations } = useFirestoreDelete("locations");
    const { updateField } = useFirestoreUpdate("posts");

    const { mutate, isPending } = useDataMutation(
      ["all-posts", "following-posts", "like-posts", "tag-posts"],
      async () => {
        const { filteredTags, remainingTags } = data.hashtags.reduce((acc, item) => {
          if ("createTag" in item.data) {
            acc.filteredTags.push(item);
          } else {
            acc.remainingTags.push(item);
          }
          return acc;
        }, { filteredTags: [] as ReadDocumentType<HashtagsType>[], remainingTags: [] as ReadDocumentType<HashtagsType>[]});

        const updatedPost = await Promise.all([
          (async () => {
            const readHashtagIds = await readDocumentQueryHashtags<HashtagsType>("taggedPostIds", "array-contains", id);
            if (readHashtagIds){
              const filtered = readHashtagIds.filter((tagId) => !data.hashtags.map(hashtag => hashtag.id).includes(tagId.id))
              await Promise.all(filtered.map((tag) =>
                deleteFieldArrayHashtags(tag.id, "taggedPostIds", id)
              ));
            }
          })(),
          Promise.all(filteredTags.map((tag)=> (
            createDocumentManualHashtags(tag.id, {tagKeywords: generateKeywordCombinations(tag.id), taggedPostIds: [id]})
          ))),
          Promise.all(remainingTags.map((tag) => {
            createFieldArrayHashtags(tag.id, "taggedPostIds", id)
          })),
          (async () => {
            updateField(id, {
              private: data.private,
              content: data.content,
              hashtags: data.hashtags.map(hashtag => hashtag.id),
              usertags: data.usertags.map(usertag => usertag.id),
              scheduleId: data.scheduleId
            })
          })(),
          (async () => {
            const readedSchedule = data.scheduleId && await readDocumentSingleSchedules<SchedulesType>(data.scheduleId)
            if (readedSchedule) {
              const placeName = readedSchedule.data.scheduleLocation.placeName
              const readedLocations = await readDocumentQueryLocations("taggedPostIds", "array-contains", id)
              const readedLocation = await readDocumentSingleLocations<LocationsType>(placeName)
              if (readedLocations){
                const filtered = readedLocations.filter((location) => location.id !== placeName)
                await Promise.all(filtered.map((location) =>
                  deleteFieldArrayLocations(location.id, "taggedPostIds", id)
                ));
              }
              if (readedLocation.data) {
                createFieldArrayLocations(placeName, "taggedPostIds", id)
              } else {
                createDocumentManualLocations(placeName, {locationKeywords: generateKeywordCombinations(placeName), taggedPostIds: [id]})
              }
            }
          })()
        ])
        if (updatedPost) {
          setPaginationValue(Prev => ({...Prev, 
            posts: {
              lastVisible: null,
              isDataEnd: false
            },
          }))
        }
      }, 
      onSuccess, 
      onError
    )
      
    return { mutate, isPending }
  }

  const DeletePost = (id: string, onSuccess: () => void, onError: () => void) => {
    const { deleteDocument } = useFirestoreDelete("posts");
    const { deleteFieldArray: deleteFieldArrayHashtags } = useFirestoreDelete("hashtags");
    const { deleteFieldArray: deleteFieldArrayLocations } = useFirestoreDelete("locations");
    const { readDocumentQuery: readDocumentQueryHashtags } = useFirestoreRead("hashtags")
    const { readDocumentQuery: readDocumentQueryLocations } = useFirestoreRead("locations")
    const { mutate, isPending } = useDataMutation(
      ["all-posts", "following-posts", "like-posts", "tag-posts"],
      async () => {
        const deleted = await Promise.all([
          deleteDocument(id),
          (async () => {
            const tagIdToDelete = await readDocumentQueryHashtags<HashtagsType>("taggedPostIds", "array-contains", id);
            if (tagIdToDelete) {
              await Promise.all(tagIdToDelete.map((tag) =>
                deleteFieldArrayHashtags(tag.id, "taggedPostIds", id)
              ));
            }
          })(),
          (async () => {
            const locationIdToDelete = await readDocumentQueryLocations<LocationsType>("taggedPostIds", "array-contains", id);
            if (locationIdToDelete) {
              await Promise.all(locationIdToDelete.map((tag) =>
                deleteFieldArrayLocations(tag.id, "taggedPostIds", id)
              ));
            }
          })()
        ]);
        
        if (deleted) {
          setPaginationValue(Prev => ({...Prev, 
            posts: {
              lastVisible: null,
              isDataEnd: false
            },
          }))
        }
      }, 
      onSuccess, 
      onError
    )
      
    return { mutate, isPending }
  }

  return { CreatePost, ReadPostAllPaged, ReadPostFollowPaged, ReadPostLikePaged, ReadPostTagPaged, ReadPostAll, ReadPostAllOther, ReadPostAllSearch, ReadOnlyPost, ReadPostSingle, UpdatePost, DeletePost }
}

export default PostService;