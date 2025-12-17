export interface UserDetails {
  firstName: string; lastName: string; email: string; number: number; userAddress?: string; country: string; age: number;
}
import React, { use, useEffect, useState } from 'react'
import PhotoUpload from './PhotoUpload';
import UserNavbar from './UserNavbar';

function MainPage() {

  const [user, setUser] = useState<UserDetails | null>(null);

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

  return (
    <section style={{ padding:"20px"}}>
      <UserNavbar />
      <h1>Dashboard</h1>
      <div style={{ border: "1px solid grey", borderRadius: "10px" }}>
        {
          user ? (
            <div>
              <PhotoUpload />
              <h3>Welcome, {user.firstName}!</h3>
              {/* <ul>
                <li><strong>First Name:</strong> {user.firstName}</li>
                <li><strong>Last Name:</strong> {user.lastName}</li>
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Phone:</strong> {user.number}</li>
                <li><strong>Age:</strong> {user.age}</li>
                <li><strong>Country:</strong> {user.country}</li>
                {user.userAddress &&
                  <li><strong>Address:</strong> {user.userAddress}</li>
                }
              </ul> */}
            </div>
          ) : (
            <div></div>
          )
        }
      </div>
      Coding stuff
    </section>
  )
}

export default MainPage