import { useAuthStore } from '../store/useAuthStore';

function Courses() {
  const { user, token } = useAuthStore();

  return (
    <section style={{ padding: "20px" }}>
      {token ? (<p style={{ fontSize: "35px" }}> Your 1 hour class is <b>{user?.demoStatus}</b> on <b>{user?.demoSlot}</b> of <b>{user?.subject}</b> class. <br />Enjoy it.
      </p>) : (<span></span>)}
    </section>
  )
}

export default Courses