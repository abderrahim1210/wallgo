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
        </Routes>
    )
}
