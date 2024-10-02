import React from 'react';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';
import { Outlet } from 'react-router-dom';
const ManageSite = () => {
  return (
    <div className='d-flex'>
      <div className='col-2'>
        <Sidebar />
      </div>
      <div className='col-10'>
        <Navbar />
        <div className='mt-5'>
          <Outlet />
        </div>
      </div>
    </div>

  )
};

export default ManageSite;
