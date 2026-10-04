import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from '../components/Home'
import { SignUp } from '../pages/Auth/SignUp'
import { Login } from '../pages/Auth/Login'

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/login' element={<Login />} />
        </Routes>
    )
}
