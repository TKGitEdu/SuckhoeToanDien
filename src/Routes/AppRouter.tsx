import React, { useEffect } from "react";
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
// import AdminServices from "../pages/admin/Services";
import AdminDoctors from "../pages/admin/Doctors";
import AdminPatients from "../pages/admin/Patients";
import AdminFeedbacks from "../pages/admin/Feedbacks";
import NotFoundPage from "../pages/NotFoundPage";



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
            <MainLayout><PatientDashboard /></MainLayout>
        } />
        <Route path="/patient/appointments" element={
            <MainLayout><PatientAppointments /></MainLayout>
        } />
        <Route path="/patient/treatments" element={
            <MainLayout><PatientTreatments /></MainLayout>
        } />        <Route path="/patient/profile" element={
            <MainLayout><PatientProfile /></MainLayout>
        } />        <Route path="/patient/feedback" element={
            <MainLayout><PatientFeedback /></MainLayout>
        } />
        <Route path="/patient/payments" element={
            <MainLayout><PatientPayments /></MainLayout>
        } />
        
        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={
            <MainLayout><DoctorDashboard /></MainLayout>
        } />
        <Route path="/doctor/appointments" element={
            <MainLayout><DoctorAppointments /></MainLayout>
        } />
        <Route path="/doctor/patients" element={
            <MainLayout><DoctorPatients /></MainLayout>
        } />
        <Route path="/doctor/treatment-records" element={
            <MainLayout><DoctorTreatmentRecords /></MainLayout>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
            <MainLayout><AdminDashboard /></MainLayout>
        } />
        {/* <Route path="/admin/services" element={
          <AdminRoute>
            <MainLayout><AdminServices /></MainLayout>
          </AdminRoute>
        } /> */}
        <Route path="/admin/doctors" element={
            <MainLayout><AdminDoctors /></MainLayout>
        } />
        <Route path="/admin/patients" element={
            <MainLayout><AdminPatients /></MainLayout>
        } />
        <Route path="/admin/feedbacks" element={
            <MainLayout><AdminFeedbacks /></MainLayout>
        } />
        
        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
