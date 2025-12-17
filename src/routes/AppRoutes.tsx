import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import Register from '../pages/Register'
import Login from '../pages/Login'
import MainPage from '../components/MainPage'
import Courses from '../pages/Courses'
import Support from '../pages/Support'

function AppRoutes() {
    return (

        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/main' element={<MainPage />} />
                    <Route path='/main/courses/' element={<Courses />} />
                    <Route path='/main/support/' element={<Support />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}


export default AppRoutes