import { useState } from 'react'
import { Navbar } from './layouts/Navbar'
import { AppRoutes } from './router/AppRoutes'
import { ToastProvider } from './hooks/ToastProvider'

function App() {

  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
