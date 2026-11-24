import { AppRoutes } from './router/AppRoutes'
import { useAuth } from './hooks/AuthProvider'
import { usePresence } from './hooks/usePresence'

function App() {
  const { user } = useAuth()!;
  usePresence(user?.id ?? null);
  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
