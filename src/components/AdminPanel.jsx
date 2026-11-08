import React, { useState, useEffect } from 'react';
import {
  Users, Video, BarChart3, Plus, Trash2, Edit3, Save, RotateCcw, X, Check, LogOut, ExternalLink, Sparkles, AlertCircle, CheckCircle2, Play, Search, ShieldCheck, Film, Award, Phone, MapPin, Eye, ShoppingBag, Tag, Package, Radio, FileQuestion, Mic, Volume2, CheckCircle
} from 'lucide-react';
import { 
  getStoredCourses, saveStoredCourses, resetStoredCourses, 
  formatVideoUrl, isPlayableVideo 
} from '../utils/coursesStorage';
import { 
  getStoredProducts, saveStoredProducts, resetStoredProducts 
} from '../utils/productsStorage';
import { api } from '../services/api';
import { getStoredPosts, saveStoredPosts, resetStoredPosts } from '../utils/postsStorage';
import { getStoredExamQuestions, saveStoredExamQuestions, resetStoredExamQuestions } from '../utils/examStorage';
import { subscribeToCloudEvents } from '../utils/cloudSync';

export default function AdminPanel({ isOpen, onClose, onLogoutAdmin }) {
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'courses', 'users', 'products'
  const [courses, setCourses] = useState(() => getStoredCourses());

  // Real-time Posts / Instagram Feed state
  const [posts, setPosts] = useState(() => getStoredPosts());
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [newPostForm, setNewPostForm] = useState({
    title: '',
    type: 'audio', // 'audio', 'image', 'video'
    mediaUrl: '',
    caption: '',
    audioDuration: '02:30 daqiqa'
  });

  // Dynamic Exam Questions state (Admin can edit any question)
  const [examQuestions, setExamQuestions] = useState(() => getStoredExamQuestions());
  const [editingQuestion, setEditingQuestion] = useState(null); // { isNew, question }
  const [questionForm, setQuestionForm] = useState({
    id: 1,
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctIndex: 0,
    explanation: ''
  });
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'biznes-boshlash');
  
  // Real / local users state
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLessonsCompleted: 0,
    totalCertificates: 0
  });

  // Products state
  const [products, setProducts] = useState(() => getStoredProducts());
  const [editingProduct, setEditingProduct] = useState(null); // { isNew, product }
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Parfyumeriya',
    code: '',
    price: '',
    points: '',
    desc: '',
    tag: 'Elita Ifor'
  });
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

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
    const handleUsersUpdate = () => {
      loadData();
    };
    const handlePostsUpdate = () => {
      setPosts(getStoredPosts());
    };
    const handleExamUpdate = () => {
      setExamQuestions(getStoredExamQuestions());
    };
    window.addEventListener('users_updated', handleUsersUpdate);
    window.addEventListener('posts_updated', handlePostsUpdate);
    window.addEventListener('exam_questions_updated', handleExamUpdate);

    // Live cloud listener for instant multi-device sync
    const unsubscribeCloud = subscribeToCloudEvents((ev) => {
      if (ev.type === 'REGISTER_USER' || ev.type === 'UPDATE_USER') {
        loadData();
      }
      if (ev.type === 'POSTS_UPDATED') {
        setPosts(getStoredPosts());
      }
      if (ev.type === 'EXAM_QUESTIONS_UPDATED') {
        setExamQuestions(getStoredExamQuestions());
      }
    });
    return () => {
      window.removeEventListener('users_updated', handleUsersUpdate);
      window.removeEventListener('posts_updated', handlePostsUpdate);
      window.removeEventListener('exam_questions_updated', handleExamUpdate);
      unsubscribeCloud();
    };
  }, [isOpen]);

  const loadData = async () => {
    // 1. Load courses
    setCourses(getStoredCourses());

    // 2. Load users using unified API (localStorage + server + active session)
    try {
      const allUsers = await api.getAllUsers();
      setUsers(allUsers);

      // Calculate metrics
      setStats({
        totalUsers: allUsers.length + 15400,
        totalRealUsers: allUsers.length,
        totalLessonsCompleted: allUsers.length * 4 + 38,
        totalCertificates: Math.max(3, Math.floor(allUsers.length * 0.4))
      });
    } catch (e) {
      console.error("Admin load users error:", e);
    }
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

  // Delete whole module
  const handleDeleteModule = (moduleId) => {
    if (courses.length <= 1) {
      alert("Kamida 1 ta modul qolishi kerak! Oxirgi modulni o'chirib bo'lmaydi.");
      return;
    }
    const toDelete = courses.find(c => c.id === moduleId);
    if (!confirm(`Rostdan ham "${toDelete?.title || 'ushbu modul'}"ni va unga tegishli barcha darslarni o'chirmoqchimisiz?`)) return;

    const updated = courses.filter(c => c.id !== moduleId);
    setCourses(updated);
    setSelectedCourseId(updated[0].id);
    saveStoredCourses(updated);
    showAlert("Modul muvaffaqiyatli o'chirildi va saytdan olib tashlandi!");
  };

  // Add new module state
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [newModuleForm, setNewModuleForm] = useState({
    title: '',
    shortDesc: '',
    level: "Boshlang'ich",
    duration: '2 soat',
    color: 'from-rose-600 to-pink-600',
    badge: 'Yangi Modul',
    instructorName: 'Zulayho Qosimova',
    instructorRole: 'Faberlic Oltin Direktori'
  });

  const handleCreateModule = (e) => {
    e.preventDefault();
    if (!newModuleForm.title.trim()) {
      alert("Modul nomini kiriting!");
      return;
    }

    const nextIdx = courses.length + 1;
    const newModuleId = `modul-${Date.now()}`;
    const newCourse = {
      id: newModuleId,
      title: `${nextIdx}-Modul: ${newModuleForm.title.trim()}`,
      badge: newModuleForm.badge || 'Yangi Modul',
      level: newModuleForm.level || 'Barcha darajalar',
      duration: newModuleForm.duration || '2 soat',
      lessonsCount: 1,
      color: newModuleForm.color || 'from-rose-600 to-pink-600',
      shortDesc: newModuleForm.shortDesc.trim() || "Faberlic bo'yicha yangi darslar to'plami.",
      instructor: {
        name: newModuleForm.instructorName || 'Faberlic Eksperti',
        role: newModuleForm.instructorRole || 'Oltin Direktor',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
      },
      lessons: [
        {
          id: `l_${Date.now()}_1`,
          number: 1,
          title: "1-Dars: Kirish va asosiy tushunchalar",
          duration: "15 daqiqa",
          videoUrl: "",
          overview: "Ushbu modul bo'yicha kirish darsi.",
          notes: "### Dars konspekti:\n1. Asosiy maqsadlar va rejalar.\n2. Faberlic biznesini rivojlantirish.",
          actionSteps: ["Dars bilan tanishib chiqing."],
          quiz: [
            {
              question: "Ushbu modul darslarini qanday o'rganish kerak?",
              options: ["Ketma-ket va muntazam", "Faqat bir marta", "Test yechmasdan", "Shoshilmasdan"],
              correctAnswer: 0,
              explanation: "Muntazam ravishda darslarni ko'rish va amalda qo'llash tavsiya etiladi."
            }
          ]
        }
      ]
    };

    const updated = [...courses, newCourse];
    setCourses(updated);
    setSelectedCourseId(newModuleId);
    saveStoredCourses(updated);
    setIsAddModuleOpen(false);
    setNewModuleForm({
      title: '',
      shortDesc: '',
      level: "Boshlang'ich",
      duration: '2 soat',
      color: 'from-rose-600 to-pink-600',
      badge: 'Yangi Modul',
      instructorName: 'Zulayho Qosimova',
      instructorRole: 'Faberlic Oltin Direktori'
    });
    showAlert("Yangi modul muvaffaqiyatli qo'shildi!");
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
    window.dispatchEvent(new Event('users_updated'));
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
    window.dispatchEvent(new Event('users_updated'));
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
    window.dispatchEvent(new Event('users_updated'));
    showAlert("Yangi o'quvchi muvaffaqiyatli qo'shildi!");
  };

  // ==================== POSTS & STORIES (INSTAGRAM FEED) HANDLERS ====================
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostForm.title.trim() || !newPostForm.mediaUrl.trim()) {
      alert("Iltimos, sarlavha va media havolasini (URL) kiriting!");
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      authorName: 'NURULLAYEVA NURANGIZ',
      authorRole: 'Faberlic Oltin Direktori & Asoschisi',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      type: newPostForm.type,
      title: newPostForm.title.trim(),
      mediaUrl: newPostForm.mediaUrl.trim(),
      audioDuration: newPostForm.audioDuration || '02:30 daqiqa',
      caption: newPostForm.caption.trim() || 'Faberlic Akademiya rasmiy murojaati.',
      likesCount: Math.floor(80 + Math.random() * 150),
      commentsCount: Math.floor(10 + Math.random() * 30),
      createdAt: 'Hozirgina'
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    saveStoredPosts(updated);
    setIsAddPostOpen(false);
    setNewPostForm({ title: '', type: 'audio', mediaUrl: '', caption: '', audioDuration: '02:30 daqiqa' });
    showAlert("Yangi ovozli xabar / post muvaffaqiyatli chop etildi!");
  };

  const handleDeletePost = (postId) => {
    if (!confirm("Ushbu postni o'chirib tashlamoqchimisiz?")) return;
    const updated = posts.filter(p => p.id !== postId);
    setPosts(updated);
    saveStoredPosts(updated);
    showAlert("Post o'chirildi.");
  };

  const handleResetPosts = () => {
    if (!confirm("Barcha postlarni dastlabki holatga qaytarmoqchimisiz?")) return;
    const def = resetStoredPosts();
    setPosts(def);
    showAlert("Postlar dastlabki holatga qaytarildi.");
  };

  // ==================== EXAM QUESTIONS HANDLERS (ADMIN CAN EDIT) ====================
  const handleOpenEditQuestion = (q, isNew = false) => {
    setEditingQuestion({ isNew, qId: q ? q.id : null });
    if (q) {
      setQuestionForm({
        id: q.id,
        question: q.question,
        optionA: q.options[0] || '',
        optionB: q.options[1] || '',
        optionC: q.options[2] || '',
        optionD: q.options[3] || '',
        correctIndex: q.correctIndex ?? 0,
        explanation: q.explanation || ''
      });
    } else {
      setQuestionForm({
        id: Date.now(),
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctIndex: 0,
        explanation: ''
      });
    }
  };

  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (!questionForm.question.trim() || !questionForm.optionA.trim() || !questionForm.optionB.trim()) {
      alert("Savol matni va kamida 2 ta variantni to'ldiring!");
      return;
    }

    const options = [
      questionForm.optionA.trim(),
      questionForm.optionB.trim(),
      questionForm.optionC.trim() || '—',
      questionForm.optionD.trim() || '—'
    ];

    let updated;
    if (editingQuestion.isNew) {
      const newQ = {
        id: examQuestions.length + 1,
        question: questionForm.question.trim(),
        options,
        correctIndex: Number(questionForm.correctIndex) || 0,
        explanation: questionForm.explanation.trim()
      };
      updated = [...examQuestions, newQ];
    } else {
      updated = examQuestions.map(q => {
        if (q.id === editingQuestion.qId) {
          return {
            ...q,
            question: questionForm.question.trim(),
            options,
            correctIndex: Number(questionForm.correctIndex) || 0,
            explanation: questionForm.explanation.trim()
          };
        }
        return q;
      });
    }

    setExamQuestions(updated);
    saveStoredExamQuestions(updated);
    setEditingQuestion(null);
    showAlert("Imtihon savoli muvaffaqiyatli saqlandi!");
  };

  const handleDeleteQuestion = (qId) => {
    if (examQuestions.length <= 1) {
      alert("Kamida 1 ta savol qolishi kerak!");
      return;
    }
    if (!confirm("Ushbu savolni o'chirmoqchimisiz?")) return;
    const updated = examQuestions.filter(q => q.id !== qId).map((q, idx) => ({ ...q, id: idx + 1 }));
    setExamQuestions(updated);
    saveStoredExamQuestions(updated);
    showAlert("Savol o'chirildi.");
  };

  const handleResetExamQuestions = () => {
    if (!confirm("Imtihon savollarini standart 10 ta savolga qaytarmoqchimisiz?")) return;
    const def = resetStoredExamQuestions();
    setExamQuestions(def);
    showAlert("Savollar dastlabki 10 ta holatga qaytarildi.");
  };

  // Products Handlers
  const handleAddNewProduct = () => {
    setEditingProduct({ isNew: true });
    setProductForm({
      title: '',
      category: 'Parfyumeriya',
      code: Math.floor(1000 + Math.random() * 9000).toString(),
      price: "150,000 so'm",
      points: "15.0 ball",
      desc: '',
      tag: 'Yangi'
    });
  };

  const handleEditProduct = (prod) => {
    setEditingProduct({ isNew: false, id: prod.id });
    setProductForm({
      title: prod.title || '',
      category: prod.category || 'Parfyumeriya',
      code: prod.code || '',
      price: prod.price || '',
      points: prod.points || '',
      desc: prod.desc || '',
      tag: prod.tag || 'Xit Mahsulot'
    });
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.title.trim()) {
      alert("Iltimos, mahsulot nomini kiriting!");
      return;
    }

    let updatedProducts = [...products];
    if (editingProduct.isNew) {
      const newProd = {
        id: `p_${Date.now()}`,
        code: productForm.code.trim() || Math.floor(1000 + Math.random() * 9000).toString(),
        title: productForm.title.trim(),
        category: productForm.category,
        price: productForm.price.trim(),
        points: productForm.points.trim().includes('ball') ? productForm.points.trim() : `${productForm.points.trim()} ball`,
        desc: productForm.desc.trim(),
        tag: productForm.tag.trim() || 'Yangi'
      };
      updatedProducts.unshift(newProd);
    } else {
      updatedProducts = updatedProducts.map(p => {
        if (p.id !== editingProduct.id) return p;
        return {
          ...p,
          title: productForm.title.trim(),
          category: productForm.category,
          code: productForm.code.trim(),
          price: productForm.price.trim(),
          points: productForm.points.trim().includes('ball') ? productForm.points.trim() : `${productForm.points.trim()} ball`,
          desc: productForm.desc.trim(),
          tag: productForm.tag.trim()
        };
      });
    }

    setProducts(updatedProducts);
    saveStoredProducts(updatedProducts);
    setEditingProduct(null);
    showAlert("Mahsulot muvaffaqiyatli saqlandi va saytda yangilandi!");
  };

  const handleDeleteProduct = (prodId) => {
    if (confirm("Haqiqatan ham bu mahsulotni o'chirmoqchimisiz?")) {
      const updated = products.filter(p => p.id !== prodId);
      setProducts(updated);
      saveStoredProducts(updated);
      showAlert("Mahsulot o'chirildi va saytda yangilandi!");
    }
  };

  const handleResetProducts = () => {
    if (confirm("Barcha mahsulotlarni boshlang'ich holatiga qaytarmoqchimisiz?")) {
      const def = resetStoredProducts();
      setProducts(def);
      showAlert("Mahsulotlar asl holatiga qaytarildi!");
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = (p.title || '').toLowerCase().includes(productSearch.toLowerCase()) ||
                        (p.code || '').includes(productSearch) ||
                        (p.desc || '').toLowerCase().includes(productSearch.toLowerCase());
    const matchCat = productCatFilter === 'all' || p.category === productCatFilter;
    return matchSearch && matchCat;
  });

  const filteredUsers = users.filter(u => {
    const s = searchUser.toLowerCase().trim();
    const matchSearch = !s || 
      (u.name || '').toLowerCase().includes(s) ||
      (u.phone || '').includes(s) ||
      (u.region || '').toLowerCase().includes(s);
    const matchRegion = filterRegion === 'all' || 
      (u.region || '').trim().toLowerCase() === filterRegion.trim().toLowerCase();
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

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'products'
                ? 'bg-faberlic-700 text-white shadow-md shadow-faberlic-700/20'
                : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mahsulotlar & Parfyumeriya ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'posts'
                ? 'bg-faberlic-700 text-white shadow-md shadow-faberlic-700/20'
                : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
            }`}
          >
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Lenta & Ovozli Xabarlar ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('exam')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeTab === 'exam'
                ? 'bg-faberlic-700 text-white shadow-md shadow-faberlic-700/20'
                : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
            }`}
          >
            <FileQuestion className="w-4 h-4" />
            <span>Imtihon Savollari ({examQuestions.length})</span>
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
                    onClick={() => handleDeleteModule(selectedCourseId)}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 border border-rose-200 transition"
                    title="Tanlangan modulni butunlay o'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Modulni O'chirish</span>
                  </button>

                  <button
                    onClick={() => setIsAddModuleOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    title="Yangi modul qo'shish"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Yangi Modul</span>
                  </button>

                  <button
                    onClick={handleOpenAddLesson}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Dars Qo'shish</span>
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

              {/* Users View: Responsive Cards for Mobile + High-Density Table for Desktop */}
              
              {/* MOBILE CARDS VIEW (< sm) */}
              <div className="sm:hidden space-y-3">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                    Hech qanday o'quvchi topilmadi.
                  </div>
                ) : (
                  filteredUsers.map((u, idx) => (
                    <div key={u.id || idx} className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-faberlic-700 to-rose-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                            <a href={`tel:${u.phone}`} className="text-xs text-rose-700 font-mono font-medium block">
                              {u.phone}
                            </a>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-faberlic-800 text-xs font-black border border-rose-200 shadow-xs">
                          {u.points || 0} ball
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                          <MapPin className="w-3.5 h-3.5 text-faberlic-600" />
                          <span>{u.region || 'Toshkent'}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddPoints(u.id, 50)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 active:scale-95 transition"
                            title="+50 ball"
                          >
                            +50 ball
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4 text-rose-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* DESKTOP TABLE VIEW (>= sm) */}
              <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">#</th>
                        <th className="p-3.5">Ism-Familiya</th>
                        <th className="p-3.5">Telefon Raqami</th>
                        <th className="p-3.5">Viloyat / Shahar</th>
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
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-rose-50 text-faberlic-800 font-bold border border-rose-200/80">
                                <MapPin className="w-3.5 h-3.5 text-faberlic-600" />
                                {u.region || 'Toshkent'}
                              </span>
                            </td>
                            <td className="p-3.5 font-black text-faberlic-800">{u.points || 0} ball</td>
                            <td className="p-3.5 text-amber-700 font-bold">{u.streak_days || 1} kun</td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleAddPoints(u.id, 50)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition"
                                  title="+50 ball qo'shish"
                                >
                                  +50 ball
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                  title="O'chirish"
                                >
                                  <Trash2 className="w-4 h-4 text-rose-500" />
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

          {/* ===================== TAB 4: MAHSULOTLAR & PARFYUMERIYA ===================== */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Header Filters & Add button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Mahsulot nomi, artikul yoki tavsif bo'yicha qidirish..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                    />
                  </div>

                  <select
                    value={productCatFilter}
                    onChange={(e) => setProductCatFilter(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                  >
                    <option value="all">Barcha Kategoriyalar</option>
                    <option value="Parfyumeriya">Parfyumeriya</option>
                    <option value="Teri Parvarishi">Teri Parvarishi</option>
                    <option value="Kosmetologiya">Kosmetologiya</option>
                    <option value="Uy-Ro'zg'or">Uy-Ro'zg'or</option>
                    <option value="Salomatlik">Salomatlik</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetProducts}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition flex items-center gap-1.5"
                    title="Boshlang'ich holatga qaytarish"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Qaytarish</span>
                  </button>

                  <button
                    onClick={handleAddNewProduct}
                    className="px-4 py-2.5 rounded-xl bg-faberlic-700 hover:bg-faberlic-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-faberlic-700/20 flex items-center justify-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yangi Mahsulot Qo'shish</span>
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((prod) => (
                  <div 
                    key={prod.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-rose-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-faberlic-800">
                          {prod.tag || 'Mahsulot'}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          Artikul: #{prod.code}
                        </span>
                      </div>

                      <h4 className="font-serif font-black text-slate-900 text-base leading-snug">
                        {prod.title}
                      </h4>

                      <div className="inline-block text-[11px] font-bold text-faberlic-700 bg-rose-50 px-2 py-0.5 rounded-md">
                        {prod.category}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {prod.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-normal">Katalog narxi:</span>
                          <span className="text-slate-900 font-extrabold">{prod.price}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-normal">Beradigan balli:</span>
                          <span className="text-faberlic-700 font-black">+{prod.points}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleEditProduct(prod)}
                          className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-faberlic-700 text-xs font-bold border border-slate-200 hover:border-rose-200 transition flex items-center justify-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Tahrirlash</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-rose-100 text-slate-400 hover:text-rose-700 border border-slate-200 transition"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-500 font-medium">
                    Hech qanday mahsulot topilmadi.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TAB 5: LENTA & OVOZLI XABARLAR (INSTAGRAM STYLE) ===================== */}
          {activeTab === 'posts' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-faberlic-700 animate-pulse" />
                    <span>Lenta, Ovozli Xabarlar & Stories</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Admin sifatida o'quvchilarga audio murojaatlar, rasmlar va videolarni chop eting
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetPosts}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition"
                  >
                    Standartga Qaytarish
                  </button>
                  <button
                    onClick={() => setIsAddPostOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-faberlic-700 to-rose-600 hover:from-faberlic-800 hover:to-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-faberlic-700/20 flex items-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yangi Post / Ovozli Xabar</span>
                  </button>
                </div>
              </div>

              {/* Feed Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div 
                    key={post.id}
                    className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                            post.type === 'audio' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : post.type === 'video' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-rose-100 text-rose-800'
                          }`}>
                            {post.type === 'audio' ? <Mic className="w-3 h-3" /> : post.type === 'video' ? <Film className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                            {post.type === 'audio' ? 'Ovozli Xabar' : post.type === 'video' ? 'Video Post' : 'Rasm / Motivatsiya'}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">{post.createdAt || 'Yangi'}</span>
                        </div>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="w-7 h-7 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition"
                          title="Postni o'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-bold text-slate-900 text-base line-clamp-2">
                        {post.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-3">
                        {post.caption}
                      </p>

                      {/* Post media preview */}
                      {post.type === 'image' && (
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      )}

                      {post.type === 'audio' && (
                        <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                            <Volume2 className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-emerald-950 block truncate">Audio fayl</span>
                            <span className="text-[10px] text-emerald-700 font-semibold">{post.audioDuration || '02:30 daqiqa'}</span>
                          </div>
                        </div>
                      )}

                      {post.type === 'video' && (
                        <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-sm">
                            <Film className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-purple-950 block truncate">Video havola</span>
                            <span className="text-[10px] text-purple-700 font-semibold truncate block">{post.mediaUrl}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <span>❤️ {post.likesCount || 0} ta yoqdi</span>
                      <span>💬 {post.commentsCount || 0} ta fikr</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB 6: IMTIHON SAVOLLARI (ADMIN EDITABLE) ===================== */}
          {activeTab === 'exam' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900 flex items-center gap-2">
                    <FileQuestion className="w-5 h-5 text-faberlic-700" />
                    <span>Sertifikat Imtihon Savollari ({examQuestions.length} ta)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    O'quvchilar sertifikat olish uchun topshiradigan test savollari va to'g'ri javoblarini boshqaring
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetExamQuestions}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition"
                  >
                    Standart 10 taga Qaytarish
                  </button>
                  <button
                    onClick={() => handleOpenEditQuestion(null, true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-faberlic-700 to-rose-600 hover:from-faberlic-800 hover:to-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-faberlic-700/20 flex items-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yangi Savol Qo'shish</span>
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {examQuestions.map((q, idx) => (
                  <div 
                    key={q.id || idx}
                    className="p-5 rounded-2xl bg-white border border-rose-100 shadow-sm space-y-3 hover:border-rose-300 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-xl bg-faberlic-100 text-faberlic-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          #{idx + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                            {q.question}
                          </h4>
                          {q.explanation && (
                            <p className="text-xs text-slate-500 mt-1 italic">
                              Izoh: {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleOpenEditQuestion(q, false)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-faberlic-700 text-xs font-bold flex items-center gap-1 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Tahrirlash</span>
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="w-8 h-8 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition"
                          title="Savolni o'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = (q.correctIndex ?? 0) === optIdx;
                        return (
                          <div 
                            key={optIdx}
                            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                              isCorrect 
                                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold' 
                                : 'bg-slate-50 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center shrink-0 font-bold ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1 truncate">{opt}</span>
                            {isCorrect && (
                              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
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

      {/* ===================== EDIT / ADD PRODUCT MODAL ===================== */}
      {editingProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in"
          onClick={() => setEditingProduct(null)}
        >
          <div 
            className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-faberlic-700" />
                <h3 className="font-serif font-black text-xl text-slate-900">
                  {editingProduct.isNew ? "Yangi Mahsulot Qo'shish" : "Mahsulotni Tahrirlash"}
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-faberlic-700 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mahsulot Nomi:
                </label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="Masalan: Pour Toujours Parfyum Suvi (50 ml)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Kategoriya:
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                  >
                    <option value="Parfyumeriya">Parfyumeriya</option>
                    <option value="Teri Parvarishi">Teri Parvarishi</option>
                    <option value="Kosmetologiya">Kosmetologiya</option>
                    <option value="Uy-Ro'zg'or">Uy-Ro'zg'or</option>
                    <option value="Salomatlik">Salomatlik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Artikul Kodi (#):
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.code}
                    onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
                    placeholder="Masalan: 3103"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Katalog Narxi:
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="245,000 so'm"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Beradigan Balli:
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.points}
                    onChange={(e) => setProductForm({ ...productForm, points: e.target.value })}
                    placeholder="24.0"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Teg / Belgisi:
                  </label>
                  <input
                    type="text"
                    value={productForm.tag}
                    onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                    placeholder="Elita Ifor"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Qisqa Tavsif / Ma'lumot:
                </label>
                <textarea
                  rows={3}
                  value={productForm.desc}
                  onChange={(e) => setProductForm({ ...productForm, desc: e.target.value })}
                  placeholder="Mijozlar uchun mahsulot afzalliklari..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-faberlic-700 hover:bg-faberlic-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-faberlic-700/20 flex items-center gap-2 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Mahsulotni Saqlash</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ===================== ADD NEW POST / AUDIO / STORY MODAL ===================== */}
      {isAddPostOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsAddPostOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-faberlic-700 animate-pulse" />
                <h3 className="font-serif font-black text-xl text-slate-900">
                  Yangi Ovozli Xabar / Post Joylash
                </h3>
              </div>
              <button
                onClick={() => setIsAddPostOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-faberlic-700 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Post Turi:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPostForm({ ...newPostForm, type: 'audio' })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                      newPostForm.type === 'audio'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>Ovozli Xabar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPostForm({ ...newPostForm, type: 'image' })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                      newPostForm.type === 'image'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Rasm / Foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPostForm({ ...newPostForm, type: 'video' })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                      newPostForm.type === 'video'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Film className="w-4 h-4" />
                    <span>Video Post</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Sarlavha:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Aziz opa-singillar, bugungi yangiliklar va maslahatlar!"
                  value={newPostForm.title}
                  onChange={(e) => setNewPostForm({ ...newPostForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {newPostForm.type === 'audio' ? 'Audio Fayl Havolasi (URL):' : newPostForm.type === 'image' ? 'Rasm Havolasi (URL):' : 'Video Havolasi (YouTube yoki MP4):'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    newPostForm.type === 'audio' 
                      ? 'https://example.com/audio.mp3 yoki ovozli xabar havolasi' 
                      : newPostForm.type === 'image'
                        ? 'https://images.unsplash.com/...' 
                        : 'https://youtube.com/watch?v=...'
                  }
                  value={newPostForm.mediaUrl}
                  onChange={(e) => setNewPostForm({ ...newPostForm, mediaUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                />
              </div>

              {newPostForm.type === 'audio' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Audio Davomiyligi:
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: 02:45 daqiqa"
                    value={newPostForm.audioDuration}
                    onChange={(e) => setNewPostForm({ ...newPostForm, audioDuration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Matn / Izoh (Caption):
                </label>
                <textarea
                  rows={3}
                  placeholder="Post matni, o'quvchilarga bildirishnoma yoki eslatma..."
                  value={newPostForm.caption}
                  onChange={(e) => setNewPostForm({ ...newPostForm, caption: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPostOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-faberlic-700 hover:bg-faberlic-800 text-white text-xs font-bold shadow-md shadow-faberlic-700/20"
                >
                  Chop Etish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== EDIT / ADD EXAM QUESTION MODAL ===================== */}
      {editingQuestion && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in"
          onClick={() => setEditingQuestion(null)}
        >
          <div 
            className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-faberlic-700" />
                <h3 className="font-serif font-black text-xl text-slate-900">
                  {editingQuestion.isNew ? "Yangi Imtihon Savoli Qo'shish" : "Savolni Tahrirlash"}
                </h3>
              </div>
              <button
                onClick={() => setEditingQuestion(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-faberlic-700 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Savol Matni:
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Masalan: Faberlic katalogidagi mahsulotlarga maslahatchi necha foiz chegirma oladi?"
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
                ></textarea>
              </div>

              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Variantlar & To'g'ri Javobni Tanlang:
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={Number(questionForm.correctIndex) === 0}
                    onChange={() => setQuestionForm({ ...questionForm, correctIndex: 0 })}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-500 w-5">A:</span>
                  <input
                    type="text"
                    required
                    placeholder="A variant matni"
                    value={questionForm.optionA}
                    onChange={(e) => setQuestionForm({ ...questionForm, optionA: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-faberlic-600"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={Number(questionForm.correctIndex) === 1}
                    onChange={() => setQuestionForm({ ...questionForm, correctIndex: 1 })}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-500 w-5">B:</span>
                  <input
                    type="text"
                    required
                    placeholder="B variant matni"
                    value={questionForm.optionB}
                    onChange={(e) => setQuestionForm({ ...questionForm, optionB: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-faberlic-600"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={Number(questionForm.correctIndex) === 2}
                    onChange={() => setQuestionForm({ ...questionForm, correctIndex: 2 })}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-500 w-5">C:</span>
                  <input
                    type="text"
                    placeholder="C variant matni"
                    value={questionForm.optionC}
                    onChange={(e) => setQuestionForm({ ...questionForm, optionC: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-faberlic-600"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={Number(questionForm.correctIndex) === 3}
                    onChange={() => setQuestionForm({ ...questionForm, correctIndex: 3 })}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-500 w-5">D:</span>
                  <input
                    type="text"
                    placeholder="D variant matni"
                    value={questionForm.optionD}
                    onChange={(e) => setQuestionForm({ ...questionForm, optionD: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-faberlic-600"
                  />
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  * To'g'ri javob variantini radio tugma orqali belgilang.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Savol Izohi / Tushuntirish (Ixtiyoriy):
                </label>
                <input
                  type="text"
                  placeholder="Nima uchun shu javob to'g'riligi haqida qisqacha izoh..."
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-faberlic-600"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-faberlic-700 hover:bg-faberlic-800 text-white text-xs font-bold shadow-md shadow-faberlic-700/20 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Savolni Saqlash</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
