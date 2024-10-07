import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Login from './page/auth/Login';
import Auth from './Auth';
import ForgotPassword from './page/auth/ForgotPassword';
import ChangePassword from './page/auth/ChangePassword';
import ManageSite from './ManageSite';
import Dashboard from './page/common/Dashboard';
import TeacherList from './page/teacher/TeacherList';
import TeacherInformation from './page/teacher/TeacherInformation';
import { AuthWrapper } from './component/context/auth.context';
import PrivateRoute from './route/PrivateRoute';

import { StaffList } from './page/staff/StaffList';
import ClassList from './page/class/ClassList';
import StaffInformation from './page/staff/StaffInformation';

const router = createBrowserRouter([
  {
    path: "/pms/auth",
    element: (
      <AuthWrapper>
        <Auth />
      </AuthWrapper>
    ),
    children: [
      { index: true, path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "change-password", element: <ChangePassword /> },
    ],
  },
  {
    path: "/pms/manage",
    element: (
      <AuthWrapper>
        <PrivateRoute>
          <ManageSite />
        </PrivateRoute>
      </AuthWrapper>
    ),
    children: [
      { index: true, path: "dashboard", element: <Dashboard /> },
      { path: "teacher", element: <TeacherList /> },
      { path: "teacher/:id", element: <TeacherInformation /> },
      { path: "class", element: <ClassList /> },
      { path: "staff", element: <StaffList /> },
      { path: "staff/:id", element: <StaffInformation /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);