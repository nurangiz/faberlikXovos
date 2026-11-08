import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CoursesSection from './components/CoursesSection';
import LessonRoom from './components/LessonRoom';
import IncomeCalculator from './components/IncomeCalculator';
import CertificateExam from './components/CertificateExam';
import Leaderboard from './components/Leaderboard';
import ProductsGuide from './components/ProductsGuide';
import SuccessStories from './components/SuccessStories';
import UserModal from './components/UserModal';
import VerifyModal from './components/VerifyModal';
import CreatorModal from './components/CreatorModal';
import AdminCodeModal from './components/AdminCodeModal';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { api, getToken } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentCourseId, setCurrentCourseId] = useState('biznes-boshlash');
  
  // Real user state
  const [user, setUser] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(['l1-1']);
  const [certificates, setCertificates] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isAdminCodeModalOpen, setIsAdminCodeModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('fl_admin_session') === '1';
    } catch(e) {
      return false;
    }
  });
  const [verifyCertId, setVerifyCertId] = useState('');

  // Fetch authenticated user profile on app load
  useEffect(() => {
    async function loadUser() {
      try {
        const token = getToken();
        if (token) {
          const data = await api.getMe();
          if (data && data.user) {
            setUser(data.user);
            setCompletedLessons(data.completedLessons || ['l1-1']);
            setCertificates(data.certificates || []);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("User load error:", err);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }
    loadUser();
  }, []);

  // Handle successful login/registration
  const handleAuthSuccess = (res) => {
    setUser(res.user);
    setCompletedLessons(res.completedLessons || ['l1-1']);
    setCertificates(res.certificates || []);
  };

  // Handle lesson completion with backend sync
  const handleCompleteLesson = async (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
    }

    try {
      if (getToken()) {
        const res = await api.completeLesson(lessonId, currentCourseId);
        if (res && res.user) {
          setUser(res.user);
          setCompletedLessons(res.completedLessons || [...completedLessons, lessonId]);
        }
      } else {
        // Guest mode point boost
        setUser(prev => prev ? { ...prev, points: (prev.points || 0) + 50 } : prev);
      }
    } catch (err) {
      console.error("Complete lesson sync error:", err);
    }
  };

  const handleExamCompleted = (result) => {
    if (result && result.user) {
      setUser(result.user);
    }
    if (result && result.certificates) {
      setCertificates(result.certificates);
    }
  };

  const handleOpenVerifyWithId = (certId) => {
    setVerifyCertId(certId);
    setIsVerifyOpen(true);
  };

  const handleSelectCourse = (courseId) => {
    setCurrentCourseId(courseId);
    setActiveTab('classroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin access handlers
  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminCodeModalOpen(true);
    }
  };

  const handleAdminAuthenticated = () => {
    try {
      sessionStorage.setItem('fl_admin_session', '1');
    } catch(e) {}
    setIsAdminAuthenticated(true);
    setIsAdminPanelOpen(true);
  };

  const handleLogoutAdmin = () => {
    try {
      sessionStorage.removeItem('fl_admin_session');
    } catch(e) {}
    setIsAdminAuthenticated(false);
    setIsAdminPanelOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9FA] text-slate-800">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAuth={() => setIsProfileOpen(true)}
        onOpenVerify={() => {
          setVerifyCertId('');
          setIsVerifyOpen(true);
        }}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Body */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              onStartLearning={() => {
                setActiveTab('classroom');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenCalculator={() => {
                setActiveTab('calculator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenExam={() => {
                setActiveTab('certificate');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <CoursesSection
              onSelectCourse={handleSelectCourse}
              userCompletedLessons={completedLessons}
            />
            <IncomeCalculator />
            <SuccessStories />
            <Leaderboard currentUser={user} />
            <ProductsGuide onOpenCreatorModal={() => setIsCreatorOpen(true)} />
          </>
        )}

        {activeTab === 'courses' && (
          <div className="pt-4">
            <CoursesSection
              onSelectCourse={handleSelectCourse}
              userCompletedLessons={completedLessons}
            />
          </div>
        )}

        {activeTab === 'classroom' && (
          <LessonRoom
            currentCourseId={currentCourseId}
            setCurrentCourseId={setCurrentCourseId}
            userCompletedLessons={completedLessons}
            onCompleteLesson={handleCompleteLesson}
            onOpenExam={() => {
              setActiveTab('certificate');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'calculator' && (
          <IncomeCalculator />
        )}

        {activeTab === 'certificate' && (
          <CertificateExam
            user={user}
            certificates={certificates}
            onExamCompleted={handleExamCompleted}
            onOpenVerifyWithId={handleOpenVerifyWithId}
          />
        )}

        {activeTab === 'ranking' && (
          <Leaderboard currentUser={user} />
        )}

        {activeTab === 'products' && (
          <ProductsGuide onOpenCreatorModal={() => setIsCreatorOpen(true)} />
        )}
      </main>

      {/* Unified User & Registration Modal */}
      <UserModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        completedLessons={completedLessons}
        certificates={certificates}
        onProfileUpdated={(updated) => setUser(updated)}
        onLogout={() => {
          setUser(null);
          setCompletedLessons(['l1-1']);
          setCertificates([]);
        }}
        onOpenExam={() => {
          setIsProfileOpen(false);
          setActiveTab('certificate');
        }}
        onOpenVerifyWithId={handleOpenVerifyWithId}
      />

      {/* Verify Certificate Modal */}
      <VerifyModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        initialCertId={verifyCertId}
      />

      {/* Creator Secret Easter Egg Modal */}
      <CreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Admin Code Passcode Modal (Code: 080910) */}
      <AdminCodeModal
        isOpen={isAdminCodeModalOpen}
        onClose={() => setIsAdminCodeModalOpen(false)}
        onAuthenticated={handleAdminAuthenticated}
      />

      {/* Admin Panel Full Management Dashboard */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onLogoutAdmin={handleLogoutAdmin}
      />

      {/* Global Footer */}
      <Footer 
        onNavClick={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
        onOpenAdmin={handleOpenAdmin}
      />

    </div>
  );
}
