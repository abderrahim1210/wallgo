import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from '../components/Home'
import { SignUp } from '../components/SignUp'

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<SignUp />} />
        </Routes>
    )
}
