export interface UserDetails {
  firstName: string; lastName: string; email: string; number: number; userAddress?: string; country: string; age: number; demoStatus: string
}
export interface DemoBookingData {
  subject: string;
  preferredDate: string;
  preferredTime: string;
}
import React, { useEffect, useState } from 'react'
import PhotoUpload from './PhotoUpload';
import UserNavbar from './UserNavbar';
import { Button, Modal, Typography, Box, TextField, Select, MenuItem } from '@mui/material';
import axios from 'axios';
function MainPage() {
  const API_URL = 'http://localhost:5000/api/demo-booking';
  const [user, setUser] = useState<UserDetails | null>(null);
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState<DemoBookingData>({
    subject: '',
    preferredDate: '',
    preferredTime: ''
  });
  const subjects = ['Coding', 'Math', 'Web Development', 'React.js', 'Python', 'Other'];
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const token = localStorage.getItem('token');
  // console.log(token)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`);
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    if (selectedDateTime < twentyFourHoursFromNow) {
      alert("Please schedule your demo at least 24 hours in advance to allow our mentors to prepare.");
      return;
    }

    try {
      const combinedDateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(API_URL, {
        subject: formData.subject,
        demoSlot: combinedDateTime
      }, config);
      alert('Demo Booked Successfully!');
      handleClose();
    } catch (err) {
      console.error('Booking failed', err);
    }
  };

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
      <UserNavbar handleOpen={handleOpen} />
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
            You have got a 1 Free schdeule left book it as early as possible with your convient time and date.
            Change this <b>{user?.demoStatus}</b> to Schedule

            <p>
              <Button color='warning' variant='contained' onClick={handleOpen}>Book a Free Trial</Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <h3>Demo details</h3>
                  <form onSubmit={handleSubmit} className="booking-form">
                    {/* Subject of Interest */}
                    <label>Subject of Interest</label>
                    <Select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="">Select a Subject</option>
                      {subjects.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                    <br /><br />

                    <label>Preferred Date</label>
                    <TextField
                      size='small'
                      type="date"
                      required
                      inputProps={{ min: minDate }}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    />

                    <br /><br />
                    <label>Preferred Time</label>
                    <TextField
                      size='small'
                      type="time"
                      required
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    />

                    <button type="submit">Confirm Demo Session</button>
                  </form>
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