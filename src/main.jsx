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
import ListTransportProvider from './page/supplier/transport-provider/ListTransportProvider';
import ListFoodProvider from './page/supplier/food-provider/ListFoodProvider';
import ClassInformation from './page/class/ClassInformation';
import FoodProviderInformation from './page/supplier/food-provider/FoodProviderInformation';
import TransportProviderInformation from './page/supplier/transport-provider/TransportProviderInformation';
import VehicleInformation from './page/vehicle/vehicleInformation';


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
      { path: "class/:id", element: <ClassInformation /> },
      { path: "staff", element: <StaffList /> },
      { path: "staff/:id", element: <StaffInformation /> },
      { path: "provider/transport", element: <ListTransportProvider /> },
      { path: "provider/food/:id", element: <FoodProviderInformation /> },
      { path: "provider/food", element: <ListFoodProvider /> },
      { path: "provider/transport/:id", element: <TransportProviderInformation /> },
      { path: "vehicle/:id", element: <VehicleInformation /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);