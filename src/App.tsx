import { Footer } from './components/Footer'
import AppRoutes from './routes/AppRoutes'
import { useAuthStore } from './store/useAuthStore'

function App() {
const {user} = useAuthStore();
const showFooter = !user || user?.role === 'student';
  return (
    <>
      <div>
        <AppRoutes />
        {showFooter && <Footer />}
      </div>
    </>
  )
}

export default App
