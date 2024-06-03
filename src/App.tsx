
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import React, { useEffect, useState } from "react";

import { Link, Routes, Route, useLocation, Navigate, useNavigationType } from "react-router-dom";

import { TransitionGroup, CSSTransition } from "react-transition-group";

import RouteTransition from "./components/organisms/RouteTransition";

// import { useRecoilValue } from "recoil";
// import { inputValue } from "@/store";

import { ModalStack } from "./components/organisms/ModalStack";

import { useRecoilValue } from "recoil";
import { inputValueSelector } from "./store";
import useWindowSize from "./hooks/useWindowSize";

import Navbar from "./components/blocks/Navbar"

import PhotoAlbum from "./components/organisms/PhotoAlbum";
import Header from "./components/organisms/Header"
import ListUnit from "./components/organisms/ListUnit";
import NavigationMenu from "./components/organisms/NavigationMenu";
import ProfileCard from "./components/organisms/ProfileCard";
import ProfileOverview from "./components/organisms/ProfileOverview";
import PhotoSelector from "./components/organisms/PhotoSelector";

import AuthInput from "./components/atoms/AuthInput";

import PostProgressIndicator from "./components/organisms/PostProgressIndicator";

import InteractiveInput from "./components/organisms/InteractiveInput";

import GenericInput from "./components/atoms/GenericInput";

import { Switch } from "./components/shadcnUIKit/switch";

import SchedulerForm from "./components/organisms/SchedulerForm";

import PostForm from "./components/organisms/PostForm";

import ScheduleOverview from "./components/organisms/ScheduleOverview";

import SettingOverview from "./components/organisms/SettingOverview";

import ChatOptionOverview from "./components/organisms/ChatOptionOverview";

import TagSelectionPanel from "./components/organisms/TagSelectionPanel";

import PostCard from "./components/organisms/PostCard";

import ChatMessageBox from "./components/atoms/ChatMessageBox";

import RateIndicator from "./components/atoms/RateIndicator";

import LocalPointPanel from "./components/organisms/LocalPointPanel";

import LocalPointDetailPage from "./components/pages/LocalPointDetailPage";

import Alert from "./components/organisms/Alert";

import Modal from "./components/organisms/Modal";

import { CreateData } from "./crud/CreateData";

import { ReadData } from "./crud/ReadData";

import { UpdateData } from "./crud/UpdateData";

import { DeleteData } from "./crud/DeleteData";

import SignUpPage from "./components/pages/SignUpPage";

import LoginPage from "./components/pages/LoginPage";

import PostUpdatePage from "./components/pages/PostUpdatePage";

import PostPage from "./components/pages/PostPage";

import SchedulePage from "./components/pages/SchedulePage";

import ScheduleUpdatePage from "./components/pages/ScheduleUpdatePage";

import Loader from "./components/organisms/Loader";

import ToggleTagList from "./components/organisms/ToggleTagList";

import MapOverview from "./components/organisms/MapOverview";

import MapViewerPage from "./components/pages/MapViewerPage";

import ScheduleDetailPage from "./components/pages/ScheduleDetailPage";

import useFirestoreRead from "./hooks/useFirestoreRead";

import CommentOverView from "./components/organisms/CommentOverView";

import CategorySlider from "./components/organisms/CategorySlider";

import SearchPage from "./components/pages/SearchPage";

import ProfilePage from "./components/pages/ProfilePage";

import PostDetailPage from "./components/pages/PostDetailPage";

import PostCollectionPage from "./components/pages/PostCollectionPage";

import PostDetailPageReadOnlyPage from "./components/pages/PostDetailPageReadOnlyPage";

import ScheduleDetailReadOnlyPage from "./components/pages/ScheduleDetailReadOnlyPage";

import useModalStack from "./hooks/useModalStack";

import ListUnitSkeleton from "./components/skeleton/ListUnitSkeleton";

import PostCardSkeleton from "./components/skeleton/PostCardSkeleton";

import CalendarSkeleton from "./components/skeleton/CalendarSkeleton";

import ScheduleOverviewSkeleton from "./components/skeleton/ScheduleOverviewSkeleton";

import ProfilePageSkeleton from "./components/skeleton/ProfilePageSkeleton";

import PhotoAlbumSkeleton from "./components/skeleton/PhotoAlbumSkeleton";

import ChatPage from "./components/pages/ChatPage";

import ChatRoomPage from "./components/pages/ChatRoomPage";

import UserService from "./services/userService";

import PhotoHistoryCollectionPage from "./components/pages/PhotoHistoryCollectionPage";

import PhotoSingleViewer from "./components/pages/PhotoSingleViewer";

import PhotoCollectionPage from "./components/pages/PhotoCollectionPage";

import { UserInfoProvider } from "./components/organisms/UserInfoProvider";

import SettingPage from "./components/pages/SettingPage";

import ProfileUpdatePage from "./components/pages/ProfileUpdatePage";

export const queryClient = new QueryClient()

const App = () => {


  // const { SearchHeaderForModal, MapViewHeaderForModal, MapViewHeader, SearchHeader, FeedHeader, ChatHeader, ChatRoomHeader, PostDetailHeader, WritePostHeader, ManageSchedulesHeader } = Header();

  // const { PostAuthorListUnit, CommentListUnit, HashTagLinkListUnit, HashTagPickerListUnit, LocationLinkListUnit, LocationDetailLinkListUnit, LocationPickerListUnit, UserLinkListUnit, ChatMemberListUnit, ChatJoinableMemberItem } = ListUnit();

  // const selector = useRecoilValue(inputValueSelector);

  const { currentHeight } = useWindowSize();

  const func = () => {
  }

  // const rofetch = async () => {
  //   try {
  //     const encodedUrl = encodeURIComponent("https://www.naver.com");
  //     const response = await fetch(`https://03zvga0dr1.execute-api.ap-northeast-2.amazonaws.com/load2?url=${}`,
  //       {
  //         method: "GET",
  //       }
  //     )
  //     const data = await response.json();
  //     console.log(data);

  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }



  // }

  // rofetch()

  const location = useLocation();



  // const navigationType = useNavigationType()

  // let vh = window.innerHeight * 0.01
  // document.documentElement.style.setProperty('--vh', `${vh}px`)
  // window.addEventListener('resize', () => {
  //   let vh = window.innerHeight * 0.01
  //   document.documentElement.style.setProperty('--vh', `${vh}px`)
  // })

  // const { data: cachedData } = useQuery<any, Error, string[]>(["user"]);
  // if (cachedData) {
  //   // 캐시된 데이터가 있을 때 실행할 로직
  //   console.log("Cached data:", cachedData);
  // } else {
  //   // 캐시된 데이터가 없을 때 실행할 로직
  //   console.log("No cached data available.");
  // }

  // const { readDocumentQuery } = useFirestoreRead("posts")

  // useEffect(() => {
  //   const fetch = async () => {

  //     const result = await readDocumentQuery("authorizationId", "in", ["BqVl8y1YONc777JGwisfOcYucrZ2"])
  //     console.log("result", result);
  //   }
  //   fetch()
  // }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
      {/* <div className="flex flex-col bg-background overflow-x-clip"> */}
      <UserInfoProvider>
        <div id="wrapper" className="flex flex-col bg-background w-screen h-dvh">

          <RouteTransition location={location}>
            <Routes location={location}>
              <Route path="/signup/*" element={<SignUpPage />} />
              <Route path="/login/*" element={<LoginPage />} />
              <Route path="/post/*" element={<PostPage />} />
              <Route path="/post/update/*" element={<PostUpdatePage />} />
              <Route path="/post/detail/*" element={<PostDetailPage />} />
              <Route path="/post/detail/readonly/*" element={<PostDetailPageReadOnlyPage />} />
              <Route path="/search/*" element={<SearchPage />} />
              <Route path="/post/collection/*" element={<PostCollectionPage />} />
              <Route path="/schedule/*" element={<SchedulePage />} />
              <Route path="/schedule/update/*" element={<ScheduleUpdatePage />} />
              <Route path="/schedule/detail/*" element={<ScheduleDetailPage />} />
              <Route path="/schedule/detail/readonly/*" element={<ScheduleDetailReadOnlyPage />} />
              <Route path="/map/*" element={<MapViewerPage />} />
              <Route path="/map/details/*" element={<LocalPointDetailPage />} />
              <Route path="/profile/*" element={<ProfilePage />} />
              <Route path="/profile/update/*" element={<ProfileUpdatePage />} />
              <Route path="/chat/*" element={<ChatPage />} />
              <Route path="/chatroom/*" element={<ChatRoomPage />} />
              <Route path="/chatroom/gallery/*" element={<PhotoHistoryCollectionPage />} />
              <Route path="/gallery/*" element={<PhotoCollectionPage />} />
              <Route path="/photo/*" element={<PhotoSingleViewer />} />
              <Route path="/setting/*" element={<SettingPage />} />
            </Routes>
          </RouteTransition>
          <NavigationMenu />
          <ModalStack />
        </div >
      </UserInfoProvider>
    </QueryClientProvider >
  )
}

export default App

{/* <Routes>
        <Route path='/' element={<ListUnit />} />
      </Routes> */}

{/* <SearchHeaderForModal />
      <MapViewHeaderForModal data={""} handleFunc={func} />
      <MapViewHeader />
      <SearchHeader />
      <FeedHeader handleFunc={[func]} />
      <ChatHeader />
      <ChatRoomHeader data={""} handleFunc={[func]} />
      <PostDetailHeader title={"제목"} />
      <WritePostHeader handleFunc={func} />
      <ManageSchedulesHeader title={"제목"} handleFunc={func} /> */}

{/* <PostAuthorListUnit handleFunc={[func]} />
        <CommentListUnit data={""} handleFunc={func} />
        <HashTagLinkListUnit data={""} handleFunc={func} />
        <HashTagPickerListUnit data={""} handleFunc={func} />
        <LocationLinkListUnit data={""} handleFunc={func} />
        <LocationDetailLinkListUnit data={""} handleFunc={[func]} />
        <LocationPickerListUnit data={""} handleFunc={func} />
        <UserLinkListUnit data={""} handleFunc={func} />
        <ChatMemberListUnit data={""} handleFunc={[func]} />
        <ChatJoinableMemberItem data={""} handleFunc={func} /> */}

{/* <ProfileOverview data={""} /> */ }

{/* <PhotoSelector /> */ }

{/* <AuthInput id={"email"} type="text" placeholder={"이메일 입력"} validation={true} invalidMessage={"이메일 또는 비밀번호가 일치하지 않습니다."} /> */ }

{/* <PostProgressIndicator /> */ }

{/* <InteractiveInput /> */ }

{/* <SchedulerForm /> */ }

{/* <PostForm /> */ }

{/* <ScheduleOverview /> */ }

{/* <SettingOverview /> */ }

{/* <ChatOptionOverview /> */ }

{/* <TagSelectionPanel /> */ }

{/* <PostCard /> */ }

{/* <ChatMessageBox /> */ }

{/* <RateIndicator starAvg={4.2} /> */ }

{/* <LocalPointPanel /> */ }

{/* <LocalPointDetail /> */ }

{/* <Alert /> */ }

{/* <Modal /> */ }


{/* <SignUpPage /> */ }

{/* <CreateData /> */ }
{/* <ReadData /> */ }
{/* <UpdateData /> */ }
{/* <DeleteData /> */ }
{/* <PhotoAlbumSkeleton /> */ }
