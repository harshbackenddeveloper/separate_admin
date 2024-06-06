import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '../Pages/Index';
import AllUserList from '../Pages/AllUserList';
import Login from '../Common/Login';
import Department from '../Pages/Department';
import Create_Edit_form from '../Pages/Create_Edit_form';
import GuestRoute from '../Common/GuestRoute/GuestRoute';
import PrivateRoute from '../Common/PrivateRoute/PrivateRoute';
import AllLinkDetails from '../Component/AllLinkDetails';
import ForgetPassword from '../Pages/ForgetPassword';
import Conframp from '../Pages/Conframp';

export default function Routing() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<GuestRoute> <Login /> </GuestRoute>} />
          <Route path='/dashboard' element={<PrivateRoute> <Index /> </PrivateRoute>} />
          <Route path='/alluserlist' element={<PrivateRoute> <AllUserList /> </PrivateRoute>} />
          <Route path='/department' element={<PrivateRoute> <Department /> </PrivateRoute>} />
          <Route path='/form/:names' element={<PrivateRoute> <Create_Edit_form /> </PrivateRoute>} />
          <Route path='/link/:userid' element={<PrivateRoute> <AllLinkDetails /> </PrivateRoute>} />

          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/confirmpassword/:token" element={<Conframp />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}