import React from 'react'; 
import { Link, useLocation } from 'react-router-dom';  

const Sidebar = () => {     
  const location = useLocation(); // Get the current location

  // Function to determine if the link is active
  const isActive = (path) => location.pathname.includes(path); 

  return (         
    <div className="">             
      <nav className="sidebar-custom vh-100">                 
        <div className="sidebar-fixed">                     
          <div className='sidebar-header d-flex flex-column align-items-center text-center'>                         
            <div className='sidebar-logo mb-2'>                             
              <img className='logo' src="/icon/logo.svg" alt="Logo" />                         
            </div>                         
            <p className='sidebar-title roboto-font mb-0'>PMS</p>                     
          </div>                      
          <div className="divider"></div>                      
          <ul className="nav flex-column align-items-center mt-4">                         
            <li className="nav-item w-100 d-flex justify-content-center">                             
              <Link                                 
                className={`nav-link ${isActive('/pms/manage/dashboard') ? 'active' : ''} d-flex align-items-center`}                                 
                to="/pms/manage/dashboard"                             
              >                                 
                <img className='sidebar-nav-icon flex-shrink-0' src="/icon/home-2.svg" alt="Home Icon" />                                 
                <div className='sidebar-nav-title roboto-font flex-grow-1 ms-2'>Trang chủ</div>                             
              </Link>                         
            </li>                          
            <li className="nav-item w-100 d-flex justify-content-center">                             
              <Link                                 
                className={`nav-link ${isActive('/pms/manage/teacher') ? 'active' : ''} d-flex align-items-center`}                                 
                to="/pms/manage/teacher"                             
              >                                 
                <img className='sidebar-nav-icon flex-shrink-0' src="/icon/teacher-icon.svg" alt="Profile Icon" />                                 
                <div className='sidebar-nav-title roboto-font flex-grow-1 ms-2'>Giáo viên</div>                             
              </Link>                         
            </li>                          
            <li className="nav-item w-100 d-flex justify-content-center">                             
              <Link                                 
                className={`nav-link ${isActive('/settings') ? 'active' : ''} d-flex align-items-center`}                                 
                to="/settings"                             
              >                                 
                <img className='sidebar-nav-icon flex-shrink-0' src="/icon/settings-icon.svg" alt="Settings Icon" />                                 
                <div className='sidebar-nav-title roboto-font flex-grow-1 ms-2'>Settings</div>                             
              </Link>                         
            </li>                     
          </ul>                  
        </div>             
      </nav>         
    </div>     
  ); 
};  

export default Sidebar;
