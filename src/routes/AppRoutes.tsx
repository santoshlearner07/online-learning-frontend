import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from '../pages/Register'
import Login from '../pages/Login'
import MainPage from '../components/MainPage'
import Courses from '../pages/Courses'
import Support from '../pages/Support'
import AdminLogin from '../pages/AdminLogin'
import AdminRegister from '../pages/AdminRegister'
import AdminPage from '../components/AdminPage'
import Dashboard from '../pages/Dashboard'

function AppRoutes() {
    return (

        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<MainPage />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/main' element={<MainPage />} >
                        <Route index element={<Dashboard />} /> {/* Path: /main/ */}
                        <Route path="courses" element={<Courses />} /> {/* Path: /main/courses/ */}
                        <Route path="support" element={<Support />} /> {/* Path: /main/support/ */}
                    </Route>
                    <Route path='/admin' element={<AdminLogin />} />
                    <Route path='/adminregister' element={<AdminRegister />} />
                    <Route path='/admin/dashboard' element={<AdminPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}


export default AppRoutes