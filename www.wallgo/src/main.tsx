import React, { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
const App = React.lazy(() => import('./App.tsx'));
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ModalProvider } from './hooks/ModalProvider.tsx'
import { AuthProvider } from './hooks/AuthProvider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Spinner from './templates/Spinner.tsx'
const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ModalProvider>
            <Suspense fallback={<div className='flex justify-center items-center min-h-[100vh] w-full'><Spinner text='Wait a few seconds ...' type='large' /></div>}>
              <App />
            </Suspense>
          </ModalProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </>,
)
