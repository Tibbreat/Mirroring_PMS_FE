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

import Error403 from './page/errors/Error403';
import Error404 from './page/errors/Error404';
import Error500 from './page/errors/Error500';
import ChildrenList from './page/children/ChildrenList';
import AddChildren from './page/children/AddChildren';

import AddTransportProvider from './page/supplier/transport-provider/AddTransportProvider';
import { SchoolInformation } from './page/school/SchoolInformation';
import MenuCalendar from './page/kitchen/MenuCalendar';
import RouteList from './page/route/RouteList';
import RouteInformation from './page/route/RouteInformation';
import Attendance from './page/attendance/Attendance';
import ImportExcelChildren from './page/children/ImportExcelChildren';
import { Landing } from './page/landing/Landing';
import { RouteSubmitedApplication } from './page/route/RouteSubmitedApplication';


const App = () => (
  <Router>
    <Routes>
      <Route path="/pms/auth/login" element={<Login />} />
      <Route path="/pms/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/pms/auth/change-password" element={<ChangePassword />} />
      <Route path="/tuyen-sinh/nam-hoc/:academicYear" element={<Landing />} />
      <Route path="/pms/manage" element={
        <AuthWrapper>
          <PrivateRoute>
            <ManageSite />
          </PrivateRoute>
        </AuthWrapper>
      }>
        <Route index path="dashboard" element={<Dashboard />} />
        <Route path="teacher" element={<TeacherList />} />
        <Route path="teacher/:id" element={<TeacherInformation />} />
        <Route path="class" element={<ClassList />} />
        <Route path="class/:id" element={<ClassInformation />} />
        <Route path="staff" element={<StaffList />} />
        <Route path="staff/:id" element={<StaffInformation />} />

        {/* Transport */}
        <Route path="transport/provider" element={<ListTransportProvider />} />
        <Route path="transport/provider/:id" element={<TransportProviderInformation />} />
        <Route path="transport/provider/new-provider" element={<AddTransportProvider />} />
        <Route path="transport/route" element={<RouteList />} />
        <Route path="transport/route/:id" element={<RouteInformation />} />
        <Route path="transport/submited-application" element={<RouteSubmitedApplication />} />


        {/* Kitchen */}
        <Route path="kitchen/provider/:id" element={<FoodProviderInformation />} />
        <Route path="kitchen/provider" element={<ListFoodProvider />} />

        {/* Attendance */}
        <Route path="class/attendance/:id" element={<Attendance />} />

        {/* Children */}
        <Route path="children" element={<ChildrenList />} />
        <Route path="children/:id" element={<ChildrenInformation />} />
        <Route path="children/add-children" element={<AddChildren />} />
        <Route path="children/import-children" element={<ImportExcelChildren />} />

        {/* Kitchen */}
        <Route path="kitchen/menu/calendar" element={<MenuCalendar />} />
        <Route path="settings" element={<SchoolInformation />} />

      </Route>

      <Route path="/403" element={<Error403 />} />
      <Route path="/500" element={<Error500 />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  </Router>
);

createRoot(document.getElementById('root')).render(<App />);
