import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from '../components/Home'
import { SignUp } from '../pages/Auth/SignUp'
import { Login } from '../pages/Auth/Login'
import { Discover } from '../components/Discover'
import { Reels } from '../components/Reels'
import { Messenger } from '../components/Messenger'
import SavedPosts from '../components/SavedPosts'
import CreatePost from '../components/CreatePost'
import { MyPosts } from '../components/MyPosts'
import { Pages } from '../components/Pages'
import { Groups } from '../components/Groups'
import { Profile } from '../components/Profile'
import { EditProfile } from '../components/EditProfile'
import { Settings } from '../components/Settings'

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/account/signup' element={<SignUp />} />
            <Route path='/account/login' element={<Login />} />
            <Route path='/search' element={<Discover />} />
            <Route path='/reels' element={<Reels />} />
            <Route path='/messenger' element={<Messenger />} />
            <Route path='/saved_posts' element={<SavedPosts />} />
            <Route path='/create_post' element={<CreatePost />} />
            <Route path='/myposts' element={<MyPosts />} />
            <Route path='/pages' element={<Pages />} />
            <Route path='/groups' element={<Groups />} />
            <Route path='/account/profile' element={<Profile />} />
            <Route path='/account/edit' element={<EditProfile />} />
            <Route path='/settings' element={<Settings />} />
        </Routes>
    )
}
