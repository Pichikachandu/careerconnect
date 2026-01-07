import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import ResumeBuilder from './pages/ResumeBuilder';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import TestSelection from './pages/Quiz/TestSelection';
import ActiveQuiz from './pages/Quiz/ActiveQuiz';
import QuizResults from './pages/Quiz/QuizResults';
import ModulePlaceholder from './pages/ModulePlaceholder';
import DSADashboard from './pages/DSA/DSADashboard';
import CodeEditor from './pages/DSA/CodeEditor';
import InterviewDashboard from './pages/Interview/InterviewDashboard';
import ActiveInterview from './pages/Interview/ActiveInterview';
import InterviewResults from './pages/Interview/InterviewResults';
import EnglishCoach from './pages/Communication/EnglishCoach';
import ResumeScanner from './pages/ATS/ResumeScanner';
import AnnouncementDetail from './pages/AnnouncementDetail';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth Routes */}
        <Route path="/login/:role" element={<Auth />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/company" element={
          <ProtectedRoute allowedRoles={['company']}>
            <CompanyDashboard />
          </ProtectedRoute>
        } />

        {/* Profile Routes - Rolled out specific routes for better protection */}
        <Route path="/profile/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Profile role="student" />
          </ProtectedRoute>
        } />
        <Route path="/profile/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Profile role="admin" />
          </ProtectedRoute>
        } />
        <Route path="/profile/company" element={
          <ProtectedRoute allowedRoles={['company']}>
            <Profile role="company" />
          </ProtectedRoute>
        } />

        <Route path="/resume" element={
          <ProtectedRoute allowedRoles={['student']}>
            <ResumeBuilder />
          </ProtectedRoute>
        } />

        {/* Quiz Routes */}
        <Route path="/test" element={
          <ProtectedRoute allowedRoles={['student']}>
            <TestSelection />
          </ProtectedRoute>
        } />
        <Route path="/quiz/active" element={
          <ProtectedRoute allowedRoles={['student']}>
            <ActiveQuiz />
          </ProtectedRoute>
        } />
        <Route path="/quiz/results" element={
          <ProtectedRoute allowedRoles={['student']}>
            <QuizResults />
          </ProtectedRoute>
        } />

        {/* Feature Placeholders for Streamlit Apps */}
        <Route path="/module/:moduleName" element={
          <ProtectedRoute allowedRoles={['student']}>
            <ModulePlaceholder />
          </ProtectedRoute>
        } />

        {/* DSA Module (Replaces Streamlit) */}
        <Route path="/dsa" element={
          <ProtectedRoute allowedRoles={['student']}>
            <DSADashboard />
          </ProtectedRoute>
        } />
        <Route path="/dsa/problem/:id" element={
          <ProtectedRoute allowedRoles={['student']}>
            <CodeEditor />
          </ProtectedRoute>
        } />

        {/* Mock Interview Module */}
        <Route path="/interview" element={
          <ProtectedRoute allowedRoles={['student']}>
            <InterviewDashboard />
          </ProtectedRoute>
        } />
        <Route path="/interview/active" element={
          <ProtectedRoute allowedRoles={['student']}>
            <ActiveInterview />
          </ProtectedRoute>
        } />
        <Route path="/interview/result" element={
          <ProtectedRoute allowedRoles={['student']}>
            <InterviewResults />
          </ProtectedRoute>
        } />

        {/* English Communication Module */}
        <Route path="/communication" element={
          <ProtectedRoute allowedRoles={['student']}>
            <EnglishCoach />
          </ProtectedRoute>
        } />

        {/* ATS Module */}
        <Route path="/module/ats" element={
          <ProtectedRoute allowedRoles={['student']}>
            <ResumeScanner />
          </ProtectedRoute>
        } />

        {/* Announcement Detail */}
        <Route path="/announcement/:id" element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'company']}>
            <AnnouncementDetail />
          </ProtectedRoute>
        } />
        <Route path="/announcements" element={
          <ProtectedRoute allowedRoles={['student']}>
            <AnnouncementsPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
