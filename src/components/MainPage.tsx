export interface UserDetails {
  firstName: string; lastName: string; email: string; number: number; userAddress?: string; country: string; age: number;
}
import React, { useEffect, useState } from 'react'
import PhotoUpload from './PhotoUpload';
import UserNavbar from './UserNavbar';
import { Button, Modal, Typography, Box } from '@mui/material';
function MainPage() {

  const [user, setUser] = useState<UserDetails | null>(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    const storageData = localStorage.getItem('data')

    if (storageData) {
      try {
        const parsedUser = JSON.parse(storageData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data: ', error);
        localStorage.removeItem('data');
      }
    }

  }, []);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <section style={{ padding: "20px" }}>
      <UserNavbar handleOpen = {handleOpen}/>
      <h1>Dashboard</h1>
      <div style={{ border: "1px solid grey", borderRadius: "10px" }}>
        {
          user ? (
            <div>
              <PhotoUpload />
              <h3>Welcome, {user.firstName}!</h3>
            </div>
          ) : (
            <div></div>
          )
        }
      </div>
      <div style={{ marginTop: "10px" }}>
        <h2>Empower Your Child’s Future with 1:1 Expert Mentorship.</h2>
        <div style={
          { display: "flex" }
        }>
          <div>
            Unlock your child's potential with a free <b>1-hour demo class</b> tailored to their interests and skill level. Whether they want to master industry-leading technologies like <b>React, Angular, Python, or MongoDB</b>, or start with the essential building blocks of the web like <b>HTML and CSS</b>, our expert instructors are here to guide them. This no-obligation session is the perfect way to experience our interactive teaching style and see how quickly your child can start building their own digital future. <b>Book your free demo today</b> and let’s start coding!
            <br /><br />
            <p>
              ⭐ No credit/Debit card or Cash required for the demo session.
            </p>
            <p>
              <Button color='warning' variant='contained' onClick={handleOpen}>Book a Free Trial</Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Text in a modal
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                  </Typography>
                </Box>
              </Modal>
            </p>
          </div>
          <div>
            Unlock your child's potential with a free 1-hour demo class tailored to their interests and skill level. Whether they want to master industry-leading technologies like React, Angular, Python, or MongoDB, or start with the essential building blocks of the web like HTML and CSS, our expert instructors are here to guide them. This no-obligation session is the perfect way to experience our interactive teaching style and see how quickly your child can start building their own digital future. Book your free demo today and let’s start coding!
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainPage