import UserNavbar from './UserNavbar';
import { Outlet } from 'react-router-dom';
function MainPage() {

  return (
    <section style={{ padding: "20px" }}>
      <UserNavbar/>
      <main style={{ padding: '20px' }}>
        <Outlet /> 
      </main>
    </section>
  )
}

export default MainPage