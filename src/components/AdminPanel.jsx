import React, { useState, useEffect } from 'react';
import { 
  Users, Video, BarChart3, Plus, Trash2, Edit3, Save, RotateCcw, 
  X, Check, LogOut, ExternalLink, Sparkles, AlertCircle, 
  CheckCircle2, Play, Search, ShieldCheck, Film, Award, Phone, MapPin, Eye
} from 'lucide-react';
import { 
  getStoredCourses, saveStoredCourses, resetStoredCourses, 
  formatVideoUrl, isPlayableVideo 
} from '../utils/coursesStorage';
import { api } from '../services/api';

export default function AdminPanel({ isOpen, onClose, onLogoutAdmin }) {
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'courses', 'users'
  const [courses, setCourses] = useState(() => getStoredCourses());
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'biznes-boshlash');
  
  // Real / local users state
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLessonsCompleted: 0,
    totalCertificates: 0
  });

  // Edit / Add Lesson Modal
  const [editingLesson, setEditingLesson] = useState(null); // { isNew, courseId, lesson }
  const [editForm, setEditForm] = useState({
    title: '',
    duration: '15 daqiqa',
    videoUrl: '',
    overview: '',
    notes: ''
  });

  // User search & filter
  const [searchUser, setSearchUser] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');

  // New User Form
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    phone: '+998 ',
    region: 'Toshkent',
    points: 100
  });

  // Notification message
  const [alertMsg, setAlertMsg] = useState(null);

  // Load courses and stats whenever admin panel opens
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    // 1. Load courses
    setCourses(getStoredCourses());

    // 2. Load users from localStorage and API
    let combinedUsers = [];
    try {
      const localUsers = JSON.parse(localStorage.getItem('faberlic_users_db') || '[]');
      combinedUsers = [...localUsers];
    } catch (e) {}

    // Add current user if exists
    try {
      const current = JSON.parse(localStorage.getItem('faberlic_local_user') || 'null');
      if (current && !combinedUsers.some(u => u.phone === current.phone)) {
        combinedUsers.unshift(current);
      }
    } catch (e) {}

    // Add default registered leaders if empty
    if (combinedUsers.length === 0) {
      combinedUsers = [
        { id: 101, name: "Zuhra Mamadaliyeva", phone: "+998 90 111 22 33", region: "Toshkent", points: 1450, streak_days: 18, created_at: "2026-11-01" },
        { id: 102, name: "Nargiza Yoqubova", phone: "+998 93 222 33 44", region: "Samarqand", points: 1250, streak_days: 14, created_at: "2026-11-02" },
        { id: 103, name: "Shahnoza To'rayeva", phone: "+998 97 333 44 55", region: "Andijon", points: 1100, streak_days: 12, created_at: "2026-11-03" },
        { id: 104, name: "Malika Abdullayeva", phone: "+998 91 444 55 66", region: "Buxoro", points: 950, streak_days: 9, created_at: "2026-11-04" },
        { id: 105, name: "Gulbahor Ergasheva", phone: "+998 94 555 66 77", region: "Namangan", points: 850, streak_days: 8, created_at: "2026-11-05" },
        { id: 106, name: "Madina Aliyeva", phone: "+998 90 999 88 77", region: "Samarqand", points: 250, streak_days: 3, created_at: "2026-11-06" }
      ];
      localStorage.setItem('faberlic_users_db', JSON.stringify(combinedUsers));
    }

    setUsers(combinedUsers);

    // Calculate metrics
    setStats({
      totalUsers: combinedUsers.length + 15400,
      totalRealUsers: combinedUsers.length,
      totalLessonsCompleted: combinedUsers.length * 4 + 38,
      totalCertificates: Math.max(3, Math.floor(combinedUsers.length * 0.4))
    });
  };

  const showAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 3000);
  };

  // ---------------- COURSES & VIDEO MANAGEMENT ----------------

  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const handleOpenAddLesson = () => {
    const nextNumber = (currentCourse?.lessons?.length || 0) + 1;
    setEditingLesson({
      isNew: true,
      courseId: currentCourse.id,
      lessonId: `l${currentCourse.id.slice(0, 2)}-${Date.now().toString().slice(-4)}`
    });
    setEditForm({
      title: `${nextNumber}-Dars: Yangi Mavzu`,
      duration: '15 daqiqa',
      videoUrl: '',
      overview: 'Ushbu darsda yangi imkoniyatlar va amaliy qoidalar tushuntiriladi.',
      notes: '### Darsning asosiy maqsadi:\n1. Mavzuni o\'rganish va amaliyotda qo\'llash.\n2. Faberlic natijalarini yaxshilash.'
    });
  };

  const handleOpenEditLesson = (lesson) => {
    setEditingLesson({
      isNew: false,
      courseId: currentCourse.id,
      lessonId: lesson.id
    });
    setEditForm({
      title: lesson.title || '',
      duration: lesson.duration || '15 daqiqa',
      videoUrl: lesson.videoUrl || lesson.videoEmbed || '',
      overview: lesson.overview || '',
      notes: lesson.notes || ''
    });
  };

  const handleSaveLesson = () => {
    if (!editForm.title.trim()) {
      alert("Iltimos, dars nomini kiriting!");
      return;
    }

    const updatedCourses = courses.map(course => {
      if (course.id !== editingLesson.courseId) return course;

      let updatedLessons = [...course.lessons];

      if (editingLesson.isNew) {
        // Add new lesson
        const newLesson = {
          id: editingLesson.lessonId,
          number: updatedLessons.length + 1,
          title: editForm.title.trim(),
          duration: editForm.duration.trim() || '15 daqiqa',
          videoUrl: editForm.videoUrl.trim(),
          videoEmbed: editForm.videoUrl.trim(),
          overview: editForm.overview.trim(),
          notes: editForm.notes.trim()
        };
        updatedLessons.push(newLesson);
      } else {
        // Update existing lesson
        updatedLessons = updatedLessons.map(l => {
          if (l.id !== editingLesson.lessonId) return l;
          return {
            ...l,
            title: editForm.title.trim(),
            duration: editForm.duration.trim(),
            videoUrl: editForm.videoUrl.trim(),
            videoEmbed: editForm.videoUrl.trim(),
            overview: editForm.overview.trim(),
            notes: editForm.notes.trim()
          };
        });
      }

      return {
        ...course,
        lessonsCount: updatedLessons.length,
        lessons: updatedLessons
      };
    });

    setCourses(updatedCourses);
    saveStoredCourses(updatedCourses);
    setEditingLesson(null);
    showAlert("Dars va video muvaffaqiyatli saqlandi!");
  };

  const handleDeleteLesson = (lessonId) => {
    if (!confirm("Haqiqatan ham ushbu darsni o'chirmoqchimisiz?")) return;

    const updatedCourses = courses.map(course => {
      if (course.id !== selectedCourseId) return course;
      const filtered = course.lessons.filter(l => l.id !== lessonId);
      // Renumber
      const renumbered = filtered.map((l, idx) => ({ ...l, number: idx + 1 }));
      return {
        ...course,
        lessonsCount: renumbered.length,
        lessons: renumbered
      };
    });

    setCourses(updatedCourses);
    saveStoredCourses(updatedCourses);
    showAlert("Dars o'chirildi.");
  };

  const handleResetCourses = () => {
    if (!confirm("Barcha 4 ta modulni asl holatiga qaytarmoqchimisiz? Kiritilgan o'zgarishlar o'chiriladi.")) return;
    const def = resetStoredCourses();
    setCourses(def);
    showAlert("Kurslar standart holatiga qaytarildi.");
  };

  // ---------------- USER MANAGEMENT ----------------

  const handleDeleteUser = (userId) => {
    if (!confirm("Ushbu o'quvchini tizimdan o'chirmoqchimisiz?")) return;
    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    localStorage.setItem('faberlic_users_db', JSON.stringify(updated));
    showAlert("O'quvchi o'chirildi.");
  };

  const handleAddPoints = (userId, amount) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, points: Math.max(0, (u.points || 0) + amount) };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem('faberlic_users_db', JSON.stringify(updated));
    showAlert(`O'quvchiga ${amount > 0 ? '+' + amount : amount} ball berildi!`);
  };

  const handleCreateNewUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.phone.trim()) {
      alert("Ism va telefon raqamini to'ldiring!");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: newUserForm.name.trim(),
      phone: newUserForm.phone.trim(),
      region: newUserForm.region,
      points: Number(newUserForm.points) || 100,
      streak_days: 1,
      created_at: new Date().toISOString().split('T')[0]
    };

    const updated = [newUser, ...users];
    setUsers(updated);
    localStorage.setItem('faberlic_users_db', JSON.stringify(updated));
    setIsAddUserOpen(false);
    setNewUserForm({ name: '', phone: '+998 ', region: 'Toshkent', points: 100 });
    showAlert("Yangi o'quvchi muvaffaqiyatli qo'shildi!");
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = (u.name || '').toLowerCase().includes(searchUser.toLowerCase()) ||
                        (u.phone || '').includes(searchUser);
    const matchRegion = filterRegion === 'all' || u.region === filterRegion;
    return matchSearch && matchRegion;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex flex-col p-2 sm:p-6 animate-in fade-in duration-200">
      
      {/* Main Admin Container */}
      <div className="relative w-full max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl border border-rose-100 flex flex-col min-h-[90vh] overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-rose-900/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-faberlic-600 to-rose-500 text-white flex items-center justify-center font-black text-xl shadow-md">
              FL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-black text-lg sm:text-xl text-white tracking-tight">
                  Faberlic Akademiya Boshqaruv Paneli
                </h1>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Admin: 080910
                </span>
              </div>
              <p className="text-xs text-rose-200/80">
                4 ta modul darslari, videolar va o'quvchilar statistikasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogoutAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-rose-200 hover:text-white transition"
              title="Admin sessiyasini yopish"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Chiqish</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              title="Saytga qaytish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Alert Notification Banner */}
        {alertMsg && (
          <div className="bg-emerald-600 text-white text-xs sm:text-sm font-bold py-2.5 px-6 text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200 shadow-inner">
            <CheckCircle2 className="w-4 h-4" />
            <span>{alertMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'stats'
                ? 'bg-faberlic-700 text-white shadow-md shadow-faberlic-700/20'
                : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Umumiy Statistika</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'courses'
                ? 'bg-faberlic-700 text-white shadow-md shadow-faberlic-700/20'
                : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>4 ta Modul Darslari & Videolari</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'users'
                ? 'bg-faberlic-700 text-white shadow-md shadow-faberlic-700/20'
                : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>O'quvchilar Ro'yxati ({users.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto">

          {/* ===================== TAB 1: STATISTIKA ===================== */}
          {activeTab === 'stats' && (
            <div className="space-y-8 animate-in fade-in">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200">
                  <div className="flex items-center justify-between text-faberlic-700">
                    <span className="text-xs font-bold uppercase tracking-wider">Jami O'quvchilar</span>
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="mt-3 text-3xl font-black text-slate-900">{stats.totalUsers.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Haqiqiy bazada: {stats.totalRealUsers} ta</div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
                  <div className="flex items-center justify-between text-amber-700">
                    <span className="text-xs font-bold uppercase tracking-wider">Tugatilgan Darslar</span>
                    <Film className="w-5 h-5" />
                  </div>
                  <div className="mt-3 text-3xl font-black text-slate-900">{stats.totalLessonsCompleted.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-500 mt-1">4 ta modul bo'yicha</div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                  <div className="flex items-center justify-between text-emerald-700">
                    <span className="text-xs font-bold uppercase tracking-wider">Rasmiy Sertifikatlar</span>
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="mt-3 text-3xl font-black text-slate-900">{stats.totalCertificates}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Attestatsiyadan o'tganlar</div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200">
                  <div className="flex items-center justify-between text-sky-700">
                    <span className="text-xs font-bold uppercase tracking-wider">Modullar Soni</span>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="mt-3 text-3xl font-black text-slate-900">4 ta Asosiy</div>
                  <div className="text-[11px] text-slate-500 mt-1">100% video darslar bilan</div>
                </div>
              </div>

              {/* Regions Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Viloyatlar Bo'yicha O'quvchilar Taqsimoti
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
                  {['Toshkent', 'Samarqand', 'Andijon', 'Farg\'ona', 'Namangan', 'Buxoro', 'Qashqadaryo', 'Surxondaryo', 'Xorazm', 'Navoiy', 'Jizzax', 'Sirdaryo', 'Qoraqalpog\'iston'].map(reg => {
                    const count = users.filter(u => u.region === reg).length;
                    return (
                      <div key={reg} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <span className="font-medium text-slate-700">{reg}:</span>
                        <span className="font-bold text-faberlic-800">{count} ta</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick User preview */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    Eng Faol O'quvchilar
                  </h3>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="text-xs font-bold text-faberlic-700 hover:underline"
                  >
                    Barchasini ko'rish ({users.length}) →
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 text-faberlic-700 font-bold flex items-center justify-center text-xs">
                          {u.name?.slice(0, 2).toUpperCase() || 'FL'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.phone} • {u.region}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-faberlic-700">{u.points || 0} ball</div>
                        <div className="text-[11px] text-slate-400">{u.streak_days || 1} kun streak</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: DARSLAR & VIDEOLAR ===================== */}
          {activeTab === 'courses' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Course Selector Tabs */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {courses.map((course, idx) => (
                    <button
                      key={course.id}
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-2 ${
                        course.id === selectedCourseId
                          ? 'bg-faberlic-700 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-rose-50'
                      }`}
                    >
                      <span>{idx + 1}-Modul: {course.title.split(':')[0]}</span>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">
                        {course.lessons?.length || 0}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddLesson}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yangi Dars Qo'shish</span>
                  </button>

                  <button
                    onClick={handleResetCourses}
                    className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition"
                    title="Standart holatga qaytarish"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Course Info Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-slate-900 text-base sm:text-lg">
                    {currentCourse.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {currentCourse.shortDesc || currentCourse.description}
                  </p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <span className="text-xs font-bold text-faberlic-800 bg-white px-3 py-1 rounded-xl border border-rose-200">
                    Jami {currentCourse.lessons?.length || 0} ta video dars
                  </span>
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="space-y-3">
                {currentCourse.lessons?.map((lesson, idx) => {
                  const hasVideo = Boolean(lesson.videoUrl || lesson.videoEmbed);
                  return (
                    <div 
                      key={lesson.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-faberlic-100 text-faberlic-800 font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span>Davomiyligi: {lesson.duration || '15 daqiqa'}</span>
                            <span>•</span>
                            <span className={hasVideo ? "text-emerald-700 font-bold" : "text-amber-600"}>
                              {hasVideo ? "🎬 Video Ulangan" : "Simulyatsiyali pleyer"}
                            </span>
                            {lesson.videoUrl && (
                              <span className="font-mono text-[11px] text-slate-400 truncate max-w-xs hidden md:inline">
                                ({lesson.videoUrl})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleOpenEditLesson(lesson)}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-faberlic-700 text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Video & Matnni O'zgartirish</span>
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Darsni o'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================== TAB 3: O'QUVCHILAR RO'YXATI ===================== */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Header Filters & Add button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ism yoki telefon bo'yicha qidirish..."
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                    />
                  </div>

                  <select
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value)}
                    className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                  >
                    <option value="all">Barcha Viloyatlar</option>
                    <option value="Toshkent">Toshkent</option>
                    <option value="Samarqand">Samarqand</option>
                    <option value="Andijon">Andijon</option>
                    <option value="Farg'ona">Farg'ona</option>
                    <option value="Namangan">Namangan</option>
                    <option value="Buxoro">Buxoro</option>
                    <option value="Qashqadaryo">Qashqadaryo</option>
                    <option value="Surxondaryo">Surxondaryo</option>
                    <option value="Xorazm">Xorazm</option>
                    <option value="Navoiy">Navoiy</option>
                    <option value="Jizzax">Jizzax</option>
                    <option value="Sirdaryo">Sirdaryo</option>
                    <option value="Qoraqalpog'iston">Qoraqalpog'iston</option>
                  </select>
                </div>

                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-faberlic-700 hover:bg-faberlic-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Yangi O'quvchi Qo'shish</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">#</th>
                        <th className="p-3.5">Ism-Familiya</th>
                        <th className="p-3.5">Telefon</th>
                        <th className="p-3.5">Viloyat</th>
                        <th className="p-3.5">Ballar</th>
                        <th className="p-3.5">Streak</th>
                        <th className="p-3.5 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            Hech qanday o'quvchi topilmadi.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u, idx) => (
                          <tr key={u.id || idx} className="hover:bg-rose-50/40 transition">
                            <td className="p-3.5 text-slate-400 font-bold">{idx + 1}</td>
                            <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                            <td className="p-3.5 text-slate-600 font-mono">{u.phone}</td>
                            <td className="p-3.5 text-slate-700">{u.region || 'Toshkent'}</td>
                            <td className="p-3.5 font-black text-faberlic-800">{u.points || 0} ball</td>
                            <td className="p-3.5 text-amber-700 font-bold">{u.streak_days || 1} kun</td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleAddPoints(u.id, 50)}
                                  className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold"
                                  title="+50 ball qo'shish"
                                >
                                  +50
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                  title="O'chirish"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ===================== EDIT / ADD LESSON MODAL ===================== */}
      {editingLesson && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in"
          onClick={() => setEditingLesson(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif font-black text-xl text-slate-900">
                {editingLesson.isNew ? "Yangi Dars & Video Qo'shish" : "Dars & Videoni Tahrirlash"}
              </h3>
              <button
                onClick={() => setEditingLesson(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-faberlic-700 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Dars Sarlavhasi / Mavzusi:
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Masalan: Yangi mijozlar topish va buyurtma olish"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Video Havolasi (YouTube yoki MP4 URL):
                  </label>
                  <input
                    type="text"
                    value={editForm.videoUrl}
                    onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    YouTube, Vimeo yoki bevosita MP4 video havolasini qo'yishingiz mumkin
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Video Davomiyligi:
                  </label>
                  <input
                    type="text"
                    value={editForm.duration}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                    placeholder="Masalan: 18 daqiqa"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                  />
                </div>
              </div>

              {/* Video Live Preview if URL is valid */}
              {isPlayableVideo(editForm.videoUrl) && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <Play className="w-3.5 h-3.5 fill-current" /> Video Ko'rinishi (Preview):
                  </span>
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md">
                    <iframe
                      src={formatVideoUrl(editForm.videoUrl)}
                      title="Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Qisqacha Ta'rif (Overview):
                </label>
                <textarea
                  rows={2}
                  value={editForm.overview}
                  onChange={(e) => setEditForm({ ...editForm, overview: e.target.value })}
                  placeholder="Darsda nimalar o'rganilishi haqida qisqacha ma'lumot..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Dars Konspekti & Qoidalari (Matn):
                </label>
                <textarea
                  rows={4}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Dars bo'yicha asosiy eslatmalar va muhim punktlar..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-faberlic-600 font-mono"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleSaveLesson}
                  className="px-6 py-2.5 rounded-xl bg-faberlic-700 hover:bg-faberlic-800 text-white text-xs font-bold shadow-md shadow-faberlic-700/25 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Dars & Videoni Saqlash</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== ADD NEW USER MODAL ===================== */}
      {isAddUserOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsAddUserOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif font-black text-lg text-slate-900">
                Yangi O'quvchi Qo'shish
              </h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ism va Familiya:</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Nilufar Karimova"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Telefon Raqami:</label>
                <input
                  type="text"
                  required
                  placeholder="+998 90 123 45 67"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Viloyat / Shahar:</label>
                <select
                  value={newUserForm.region}
                  onChange={(e) => setNewUserForm({ ...newUserForm, region: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                >
                  <option value="Toshkent">Toshkent</option>
                  <option value="Samarqand">Samarqand</option>
                  <option value="Andijon">Andijon</option>
                  <option value="Farg'ona">Farg'ona</option>
                  <option value="Namangan">Namangan</option>
                  <option value="Buxoro">Buxoro</option>
                  <option value="Qashqadaryo">Qashqadaryo</option>
                  <option value="Surxondaryo">Surxondaryo</option>
                  <option value="Xorazm">Xorazm</option>
                  <option value="Navoiy">Navoiy</option>
                  <option value="Jizzax">Jizzax</option>
                  <option value="Sirdaryo">Sirdaryo</option>
                  <option value="Qoraqalpog'iston">Qoraqalpog'iston</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Boshlang'ich Ballar:</label>
                <input
                  type="number"
                  value={newUserForm.points}
                  onChange={(e) => setNewUserForm({ ...newUserForm, points: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-faberlic-700 text-white text-xs font-bold shadow-md"
                >
                  O'quvchini Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
