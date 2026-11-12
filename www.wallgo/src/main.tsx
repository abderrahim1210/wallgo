import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
const App = React.lazy(() => import('./App.tsx'));
import './index.css';
import './i18n.ts';
import { BrowserRouter } from 'react-router-dom'
import { ModalProvider } from './hooks/ModalProvider.tsx'
import { AuthProvider } from './hooks/AuthProvider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Spinner from './templates/Spinner.tsx'
import { useTranslation } from 'react-i18next'
import { ThemeProvider } from './hooks/useDarkMode'
const queryClient = new QueryClient();

const LoadingFallback = () => {
  const { t } = useTranslation();
  return (
    <div className='flex justify-center items-center min-h-[100vh] w-full'>
      <Spinner text={t('common.loading')} type='large' />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ModalProvider>
              <Suspense fallback={<LoadingFallback />}>
                <App />
              </Suspense>
            </ModalProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </>,
)
