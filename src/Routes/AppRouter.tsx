import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
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
import AdminServices from "../pages/admin/Services";
import AdminDoctors from "../pages/admin/Doctors";
import AdminPatients from "../pages/admin/Patients";
import AdminFeedbacks from "../pages/admin/Feedbacks";
import NotFoundPage from "../pages/NotFoundPage";

// Kiểm tra xem người dùng đã đăng nhập hay chưa
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Kiểm tra vai trò của người dùng
const getUserRole = () => {
  const role = localStorage.getItem('userRole');
  return role || 'guest';
};

// Route bảo vệ cho bệnh nhân
const PatientRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  const role = getUserRole();
  if (role !== 'patient' && role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Route bảo vệ cho bác sĩ
const DoctorRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  const role = getUserRole();
  if (role !== 'doctor' && role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Route bảo vệ cho admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  const role = getUserRole();
  if (role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main className="min-h-screen pt-16">
      {children}
    </main>
    <Footer />
  </>
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
          <PatientRoute>
            <MainLayout><PatientDashboard /></MainLayout>
          </PatientRoute>
        } />
        <Route path="/patient/appointments" element={
          <PatientRoute>
            <MainLayout><PatientAppointments /></MainLayout>
          </PatientRoute>
        } />
        <Route path="/patient/treatments" element={
          <PatientRoute>
            <MainLayout><PatientTreatments /></MainLayout>
          </PatientRoute>
        } />        <Route path="/patient/profile" element={
          <PatientRoute>
            <MainLayout><PatientProfile /></MainLayout>
          </PatientRoute>
        } />        <Route path="/patient/feedback" element={
          <PatientRoute>
            <MainLayout><PatientFeedback /></MainLayout>
          </PatientRoute>
        } />
        <Route path="/patient/payments" element={
          <PatientRoute>
            <MainLayout><PatientPayments /></MainLayout>
          </PatientRoute>
        } />
        
        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={
          <DoctorRoute>
            <MainLayout><DoctorDashboard /></MainLayout>
          </DoctorRoute>
        } />
        <Route path="/doctor/appointments" element={
          <DoctorRoute>
            <MainLayout><DoctorAppointments /></MainLayout>
          </DoctorRoute>
        } />
        <Route path="/doctor/patients" element={
          <DoctorRoute>
            <MainLayout><DoctorPatients /></MainLayout>
          </DoctorRoute>
        } />
        <Route path="/doctor/treatment-records" element={
          <DoctorRoute>
            <MainLayout><DoctorTreatmentRecords /></MainLayout>
          </DoctorRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <MainLayout><AdminDashboard /></MainLayout>
          </AdminRoute>
        } />
        <Route path="/admin/services" element={
          <AdminRoute>
            <MainLayout><AdminServices /></MainLayout>
          </AdminRoute>
        } />
        <Route path="/admin/doctors" element={
          <AdminRoute>
            <MainLayout><AdminDoctors /></MainLayout>
          </AdminRoute>
        } />
        <Route path="/admin/patients" element={
          <AdminRoute>
            <MainLayout><AdminPatients /></MainLayout>
          </AdminRoute>
        } />
        <Route path="/admin/feedbacks" element={
          <AdminRoute>
            <MainLayout><AdminFeedbacks /></MainLayout>
          </AdminRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
