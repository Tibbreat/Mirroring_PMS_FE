import { createRoot } from 'react-dom/client';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import Login from './page/auth/Login';
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
import ChildrenInformation from './page/children/ChildrenInformation';

import Attendance from './page/attendance/Attendance';

import Error403 from './page/errors/Error403';
import Error404 from './page/errors/Error404';
import Error500 from './page/errors/Error500';
import ChildrenList from './page/children/ChildrenList';
import AddChildren from './page/children/AddChildren';

import AddTransportProvider from './page/supplier/transport-provider/AddTransportProvider';


const App = () => (
  <Router>
    <Routes>
      <Route path="/pms/auth/login" element={<Login />} />
      <Route path="/pms/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/pms/auth/change-password" element={<ChangePassword />} />
      <Route path="/pms/manage" element={
        <AuthWrapper>
          <PrivateRoute>
            <ManageSite />
          </PrivateRoute>
        </AuthWrapper>
      }>
        <Route index path="dashboard" element={<Dashboard />}/>
        <Route path="teacher" element={<TeacherList />} />
        <Route path="teacher/:id" element={<TeacherInformation />} />
        <Route path="class" element={<ClassList />} />
        <Route path="class/:id" element={<ClassInformation />} />
        <Route path="staff" element={<StaffList />} />
        <Route path="staff/:id" element={<StaffInformation />} />
        <Route path="provider/transport" element={<ListTransportProvider />} />
        <Route path="provider/transport/:id" element={<TransportProviderInformation />} />
        <Route path="provider/transport/new-provider" element={<AddTransportProvider />} />
        <Route path="provider/food/:id" element={<FoodProviderInformation />} />
        <Route path="provider/food" element={<ListFoodProvider />} />
        <Route path="class/attendance/:id" element={<Attendance />} />
        <Route path="children/:id" element={<ChildrenInformation />} />

        <Route path="children" element={<ChildrenList />} />
        <Route path="children/add-children" element={<AddChildren />} />

        {/* <Route path="settings" element={<SchoolInformation />} /> */}

      </Route>

      <Route path="/403" element={<Error403 />} />
      <Route path="/500" element={<Error500 />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  </Router>
);

createRoot(document.getElementById('root')).render(<App />);
