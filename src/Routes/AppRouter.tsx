import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate, useLocation } from "react-router-dom";
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
import { useAuth } from "../contexts/AuthContext";


const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main className="min-h-screen pt-16">
      {children}
    </main>
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
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/services" element={<MainLayout><ServicesPage /></MainLayout>} />
        <Route path="/services/:id" element={<MainLayout><ServiceDetailPage /></MainLayout>} />
        <Route path="/doctors" element={<MainLayout><DoctorsPage /></MainLayout>} />
        <Route path="/doctors/:id" element={<MainLayout><DoctorDetailPage /></MainLayout>} />
        <Route path="/blog" element={<MainLayout><BlogPage /></MainLayout>} />
        <Route path="/blog/:id" element={<MainLayout><BlogDetailPage /></MainLayout>} />
        <Route path="/booking" element={<MainLayout><BookingPage /></MainLayout>} />
        
        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={
            <MainLayout>
              <PatientRoute>
                <PatientDashboard />
              </PatientRoute>
            </MainLayout>
        } />
        <Route path="/patient/appointments" element={
            <MainLayout>
              <PatientRoute>
                <PatientAppointments />
              </PatientRoute>
            </MainLayout>
        } />
        <Route path="/patient/treatments" element={
            <MainLayout>
              <PatientRoute>
                <PatientTreatments />
              </PatientRoute>
            </MainLayout>
        } />
        <Route path="/patient/profile" element={
            <MainLayout>
              <PatientRoute>
                <PatientProfile />
              </PatientRoute>
            </MainLayout>
        } />
        <Route path="/patient/feedback" element={
            <MainLayout>
              <PatientRoute>
                <PatientFeedback />
              </PatientRoute>
            </MainLayout>
        } />
        <Route path="/patient/payments" element={
            <MainLayout>
              <PatientRoute>
                <PatientPayments />
              </PatientRoute>
            </MainLayout>
        } />
        
        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={
            <MainLayout>
              <DoctorRoute>
                <DoctorDashboard />
              </DoctorRoute>
            </MainLayout>
        } />
        <Route path="/doctor/appointments" element={
            <MainLayout>
              <DoctorRoute>
                <DoctorAppointments />
              </DoctorRoute>
            </MainLayout>
        } />
        <Route path="/doctor/patients" element={
            <MainLayout>
              <DoctorRoute>
                <DoctorPatients />
              </DoctorRoute>
            </MainLayout>
        } />
        <Route path="/doctor/treatment-records" element={
            <MainLayout>
              <DoctorRoute>
                <DoctorTreatmentRecords />
              </DoctorRoute>
            </MainLayout>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
            <MainLayout>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </MainLayout>
        } />
        <Route path="/admin/doctors" element={
            <MainLayout>
              <AdminRoute>
                <AdminDoctors />
              </AdminRoute>
            </MainLayout>
        } />
        <Route path="/admin/patients" element={
            <MainLayout>
              <AdminRoute>
                <AdminPatients />
              </AdminRoute>
            </MainLayout>
        } />
        <Route path="/admin/feedbacks" element={
            <MainLayout>
              <AdminRoute>
                <AdminFeedbacks />
              </AdminRoute>
            </MainLayout>
        } />
        
        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
