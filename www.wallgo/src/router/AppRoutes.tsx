import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home'
import { SignUp } from '../pages/Auth/SignUp'
import { Login } from '../pages/Auth/Login'
import { Discover } from '../pages/Discover'
import { Reels } from '../pages/Reels'
import { Messenger } from '../pages/Messenger/Messenger'
import SavedPosts from '../pages/SavedPosts'
import CreatePost from '../pages/CreatePost'
import { Pages } from '../pages/Pages'
import { Groups } from '../pages/Groups'
import { EditProfile } from '../pages/EditProfile'
import { Settings } from '../pages/Settings'
import { Profile } from '../pages/Profile'
import { CreatePage } from '../pages/CreatePage'
import { PageProfile } from '../pages/PageProfile'
import { EditPage } from '../pages/EditPage'
import { ErrorPage } from '../components/ErrorPage'
import { GroupeProfile } from '../pages/GroupeProfile'
import { PostPreview } from '../pages/PostPreview'
import { CreateReel } from '../pages/CreateReel'
import ReelPreview from '../pages/ReelPreview'
import NotificationsView from '../pages/NotificationsView'
import JoinGroupRequests from '../pages/JoinGroupRequests'
import ForgotPassword from '../pages/Auth/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import About from '../pages/About'
import Privacy from '../pages/Privacy'
import Terms from '../pages/Terms'
import Support from '../pages/Support'

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/account/signup' element={<SignUp />} />
            <Route path='/account/login' element={<Login />} />
            <Route path='/search' element={<Discover />} />
            <Route path='/reels' element={<Reels />} />
            <Route path='/messenger' element={<Messenger />} />
            <Route path='/messenger/:userId' element={<Messenger />} />
            <Route path='/saved_posts' element={<SavedPosts />} />
            <Route path='/create_post' element={<CreatePost />} />
            {/* <Route path='/myposts' element={<MyPosts />} /> */}
            <Route path='/pages' element={<Pages />} />
            <Route path='/groups' element={<Groups />} />
            <Route path='/account/profile' element={<Profile />} />
            <Route path='/account/edit' element={<EditProfile />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/post/:id/edit' element={<CreatePost />} />
            <Route path='/profile/:id/:username' element={<Profile />} />
            <Route path='/:branch/create' element={<CreatePage />} />
            <Route path='/pages/:id' element={<PageProfile />} />
            <Route path='/groups/:id' element={<GroupeProfile />} />
            <Route path='/:type/:id/edit' element={<EditPage />} />
            <Route path='/:type/:id/edit' element={<EditPage />} />
            <Route path='/error/:code' element={<ErrorPage />} />
            <Route path='*' element={<ErrorPage />} />
            <Route path='/post/:id' element={<PostPreview />} />
            <Route path='/create_reel' element={<CreateReel />} />
            <Route path='/reel/:reel_id/edit' element={<CreateReel />} />
            <Route path='/reel/:id' element={<ReelPreview />} />
            <Route path='/notifications/all' element={<NotificationsView />} />
            <Route path='/groups_requests' element={<JoinGroupRequests />} />
            <Route path='/forgot_password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/wallgo/about' element={<About />} />
            <Route path='/wallgo/privacy' element={<Privacy />} />
            <Route path='/wallgo/terms' element={<Terms />} />
            <Route path='/wallgo/support' element={<Support />} />
        </Routes>
    )
}
