
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { Routes, Route, useLocation } from "react-router-dom";

import RouteTransition from "./components/organisms/RouteTransition";

import { ModalStack } from "./components/organisms/ModalStack";

import NavigationMenu from "./components/organisms/NavigationMenu";

import LocalPointDetailPage from "./components/pages/LocalPointDetailPage";

import SignUpPage from "./components/pages/SignUpPage";

import LoginPage from "./components/pages/LoginPage";

import PostUpdatePage from "./components/pages/PostUpdatePage";

import PostPage from "./components/pages/PostPage";

import SchedulePage from "./components/pages/SchedulePage";

import ScheduleUpdatePage from "./components/pages/ScheduleUpdatePage";


import MapViewerPage from "./components/pages/MapViewerPage";

import ScheduleDetailPage from "./components/pages/ScheduleDetailPage";

import SearchPage from "./components/pages/SearchPage";

import ProfilePage from "./components/pages/ProfilePage";

import PostDetailPage from "./components/pages/PostDetailPage";

import PostCollectionPage from "./components/pages/PostCollectionPage";

import PostDetailPageReadOnlyPage from "./components/pages/PostDetailPageReadOnlyPage";

import ScheduleDetailReadOnlyPage from "./components/pages/ScheduleDetailReadOnlyPage";

import ChatPage from "./components/pages/ChatPage";

import ChatRoomPage from "./components/pages/ChatRoomPage";

import PhotoHistoryCollectionPage from "./components/pages/PhotoHistoryCollectionPage";

import PhotoSingleViewer from "./components/pages/PhotoSingleViewer";

import PhotoCollectionPage from "./components/pages/PhotoCollectionPage";

import { UserInfoProvider } from "./components/organisms/UserInfoProvider";

import SettingPage from "./components/pages/SettingPage";

import ProfileUpdatePage from "./components/pages/ProfileUpdatePage";

export const queryClient = new QueryClient()

const App = () => {

  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
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