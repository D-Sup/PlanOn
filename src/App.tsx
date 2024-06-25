import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import RouteTransition from "./components/organisms/RouteTransition";
import { ModalStack } from "./components/organisms/ModalStack";
import { NonLoginProtectedRoute, LoginProtectedRoute } from "./routes/ProtectedRoute";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
import PostDetailReadOnlyPage from "./components/pages/PostDetailReadOnlyPage";
import PostDetailEditablePage from "./components/pages/PostDetailEditablePage";
import ScheduleDetailReadOnlyPage from "./components/pages/ScheduleDetailReadOnlyPage";
import ChatPage from "./components/pages/ChatPage";
import ChatRoomPage from "./components/pages/ChatRoomPage";
import PhotoHistoryCollectionPage from "./components/pages/PhotoHistoryCollectionPage";
import PhotoCollectionPage from "./components/pages/PhotoCollectionPage";
import { UserInfoProvider } from "./components/organisms/UserInfoProvider";
import SettingPage from "./components/pages/SettingPage";
import ProfileUpdatePage from "./components/pages/ProfileUpdatePage";
import SplashPage from "./components/pages/SplashPage";
import IntroducePage from "./components/pages/IntroducePage";
import DownloadGuidePage from "./components/pages/DownloadGuidePage";
import SecurityUnlockPage from "./components/pages/SecurityUnlockPage";
import LinkHistoryCollectionPage from "./components/pages/LinkHistoryCollectionPage";
import TutorialPage from "./components/pages/TutorialPage";
import NotificationPage from "./components/pages/NotificationPage";

export const queryClient = new QueryClient()

const App = () => {

  const location = useLocation();

  return (
    <>

      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <UserInfoProvider>
          <RouteTransition location={location}>
            <Routes location={location}>

              <Route path="/*" element={<Navigate to='/splash' replace />} />

              <Route element={<NonLoginProtectedRoute />}>
                <Route path="/introduce/*" element={<IntroducePage />} />
                <Route path="/login/*" element={<LoginPage />} />
                <Route path="/signup/*" element={<SignUpPage />} />
              </Route>

              <Route element={<LoginProtectedRoute />}>
                <Route path="/post/*" element={<PostPage />} />
                <Route path="/post/update/*" element={<PostUpdatePage />} />
                <Route path="/search/*" element={<SearchPage />} />
                <Route path="/notification/*" element={<NotificationPage />} />
                <Route path="/post/collection/*" element={<PostCollectionPage />} />
                <Route path="/schedule/*" element={<SchedulePage />} />
                <Route path="/schedule/update/*" element={<ScheduleUpdatePage />} />
                <Route path="/profile/*" element={<ProfilePage />} />
                <Route path="/profile/update/*" element={<ProfileUpdatePage />} />
                <Route path="/chat/*" element={<ChatPage />} />
                <Route path="/chatroom/*" element={<ChatRoomPage />} />
                <Route path="/chatroom/gallery/*" element={<PhotoHistoryCollectionPage />} />
                <Route path="/chatroom/link/*" element={<LinkHistoryCollectionPage />} />
                <Route path="/gallery/*" element={<PhotoCollectionPage />} />
                <Route path="/setting/*" element={<SettingPage />} />
                <Route path="/security/*" element={<SecurityUnlockPage />} />
                <Route path="/tutorial/*" element={<TutorialPage />} />
              </Route>

              <Route path="/splash/*" element={<SplashPage />} />
              <Route path="/download/*" element={<DownloadGuidePage />} />
              <Route path="/post/detail/*" element={<PostDetailPage />} />
              <Route path="/post/detail/readonly/*" element={<PostDetailReadOnlyPage />} />
              <Route path="/post/detail/writable/*" element={<PostDetailEditablePage />} />
              <Route path="/schedule/detail/*" element={<ScheduleDetailPage />} />
              <Route path="/schedule/detail/readonly/*" element={<ScheduleDetailReadOnlyPage />} />
              <Route path="/map/*" element={<MapViewerPage />} />
              <Route path="/map/details/*" element={<LocalPointDetailPage />} />

            </Routes>
          </RouteTransition>
          <NavigationMenu />
          <ModalStack />
        </UserInfoProvider>
      </QueryClientProvider >
    </>
  )
}

export default App