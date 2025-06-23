
import React, { useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import Header from "../components/header";
import Footer from "../components/footer";
import ServicesPage from "../pages/ServicesPage";
import DoctorsPage from "../pages/DoctorsPage";
import ServiceDetailPage from "../pages/ServiceDetailPage";
import DoctorDetailPage from "../pages/DoctorDetailPage";
import BlogPage from "../pages/BlogPage";
import BlogDetailPage from "../pages/BlogDetailPage";
import BookingPage from "../pages/BookingPage";
import PatientDashboard from "../pages/patient/Dashboard";
import PatientAppointments from "../pages/patient/Appointments";
import PatientTreatments from "../pages/patient/Treatments";
import PatientProfile from "../pages/patient/Profile";
import PatientFeedback from "../pages/patient/Feedback";
import PatientPayments from "../pages/patient/Payments";
import DoctorDashboard from "../pages/doctor/Dashboard";
import DoctorAppointments from "../pages/doctor/Appointments";
import DoctorPatients from "../pages/doctor/Patients";
import DoctorTreatmentRecords from "../pages/doctor/TreatmentRecords";
import AdminDashboard from "../pages/admin/Dashboard";
// import AdminServices from "../pages/admin/Services";
import AdminDoctors from "../pages/admin/Doctors";
import AdminPatients from "../pages/admin/Patients";
import AdminFeedbacks from "../pages/admin/Feedbacks";
import NotFoundPage from "../pages/NotFoundPage";

import ProtectedRoute from "./ProtectedRouter";
import RegisterSuccess from "../components/registerSuccess";




const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main className="min-h-screen pt-16">{children}</main>
    <Footer />
  </>
);

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole || '')) {
    // Redirect to homepage if authenticated but not authorized for this role
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const PatientRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['patient']}>{children}</ProtectedRoute>
);

const DoctorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['doctor']}>{children}</ProtectedRoute>
);

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>
);

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

         <Route path="/success" element={<RegisterSuccess />} />
        <Route
          path="/services"
          element={
            <MainLayout>
              <ServicesPage />
            </MainLayout>
          }
        />
        <Route
          path="/services/:id"
          element={
            <MainLayout>
              <ServiceDetailPage />
            </MainLayout>
          }
        />
        <Route
          path="/doctors"
          element={
            <MainLayout>
              <DoctorsPage />
            </MainLayout>
          }
        />
        <Route
          path="/doctors/:id"
          element={
            <MainLayout>
              <DoctorDetailPage />
            </MainLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <MainLayout>
              <BlogPage />
            </MainLayout>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <MainLayout>
              <BlogDetailPage />
            </MainLayout>
          }
        />
        <Route
          path="/booking"
          element={
            <MainLayout>
              <BookingPage />
            </MainLayout>
          }
        />
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Patient"]}>
              <MainLayout>
                <PatientDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["Patient"]}>
              <MainLayout>
                <PatientAppointments />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/treatments"
          element={
            <ProtectedRoute allowedRoles={["Patient"]}>
              <MainLayout>
                <PatientTreatments />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute allowedRoles={["Patient"]}>
              <MainLayout>
                <PatientProfile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/feedback"
          element={
            <ProtectedRoute allowedRoles={["Patient"]}>
              <MainLayout>
                <PatientFeedback />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/payments"
          element={
            <ProtectedRoute allowedRoles={["Patient"]}>
              <MainLayout>
                <PatientPayments />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        {/* Doctor */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Doctor"]}>
              <MainLayout>
                <DoctorDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute allowedRoles={["Doctor"]}>
              <MainLayout>
                <DoctorAppointments />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute allowedRoles={["Doctor"]}>
              <MainLayout>
                <DoctorPatients />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/treatment-records"
          element={
            <ProtectedRoute allowedRoles={["Doctor"]}>
              <MainLayout>
                <DoctorTreatmentRecords />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <MainLayout>
                <AdminDoctors />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <MainLayout>
                <AdminPatients />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/feedbacks"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <MainLayout>
                <AdminFeedbacks />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <MainLayout>
              <NotFoundPage />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
