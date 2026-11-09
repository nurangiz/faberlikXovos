import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CoursesSection from './components/CoursesSection';
import LessonRoom from './components/LessonRoom';
import CertificateExam from './components/CertificateExam';
import Leaderboard from './components/Leaderboard';
import ProductsGuide from './components/ProductsGuide';
import InstagramFeed from './components/InstagramFeed';
import InstallAppModal from './components/InstallAppModal';
import { subscribeToCloudEvents } from './utils/cloudSync';
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
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(() => {
    try {
      return localStorage.getItem('fl_dismiss_install_banner') !== '1';
    } catch(e) {
      return true;
    }
  });
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

    // Subscribe to Real-Time Cloud Sync (receives user registrations from any browser/device)
    const unsubscribe = subscribeToCloudEvents((ev) => {
      if (ev.type === 'REGISTER_USER' || ev.type === 'UPDATE_USER') {
        window.dispatchEvent(new Event('users_updated'));
      }
      if (ev.type === 'POSTS_UPDATED') {
        window.dispatchEvent(new Event('posts_updated'));
      }
      if (ev.type === 'EXAM_QUESTIONS_UPDATED') {
        window.dispatchEvent(new Event('exam_questions_updated'));
      }
    });

    return () => unsubscribe();
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
        onOpenInstall={() => setIsInstallModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              onStartLearning={() => {
                setActiveTab('courses');
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
            <InstagramFeed currentUser={user} onOpenAdmin={handleOpenAdmin} />
            <Leaderboard currentUser={user} />
            <ProductsGuide onOpenCreatorModal={() => setIsCreatorOpen(true)} />
          </>
        )}

        {activeTab === 'feed' && (
          <div className="pt-4">
            <InstagramFeed currentUser={user} onOpenAdmin={handleOpenAdmin} />
          </div>
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

      {/* Install Mobile App (PWA) Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Global Footer */}
      <Footer 
        onNavClick={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
        onOpenAdmin={handleOpenAdmin}
        onOpenInstall={() => setIsInstallModalOpen(true)}
      />

      {/* Floating Mobile Install App Banner */}
      {showInstallBanner && (
        <aside 
          aria-label="Ilovani o'rnatish taklifi"
          className="fixed bottom-4 left-4 right-4 z-30 max-w-md mx-auto bg-slate-900/95 backdrop-blur-md text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl border border-rose-500/30 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-faberlic-600 to-rose-600 flex items-center justify-center font-serif font-black text-white shrink-0 text-sm shadow-md">
              FL
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold leading-tight">Faberlic Mobil Ilovasi</h4>
              <p className="text-[10px] text-rose-300 truncate">Android & iOS uchun bepul o'rnatish</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-faberlic-600 to-rose-600 text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition"
            >
              O'rnatish
            </button>
            <button
              onClick={() => {
                try { localStorage.setItem('fl_dismiss_install_banner', '1'); } catch(e) {}
                setShowInstallBanner(false);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Yopish"
            >
              <span className="text-base leading-none">×</span>
            </button>
          </div>
        </aside>
      )}

    </div>
  );
}
