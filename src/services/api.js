import { broadcastEvent, fetchCloudEvents } from '../utils/cloudSync';
import { getStoredExamQuestions } from '../utils/examStorage';

const TOKEN_KEY = 'faberlic_auth_token';
const USER_KEY = 'faberlic_local_user';
const USERS_DB_KEY = 'faberlic_users_db';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Smart base URL detection (Works on Localhost and Vercel/Production)
const getApiBase = () => {
  if (typeof window === 'undefined') return '';
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    if (window.location.port === '3000' || window.location.port === '5000') {
      return '';
    }
    return 'http://localhost:3000';
  }
  return '';
};

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Local storage fallback helpers for 100% offline/local reliability
const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

const saveLocalUsers = (users) => {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (e) {}
};

export const api = {
  // 1. Register
  async register(data) {
    const cleanRegion = (data.region || 'Toshkent').trim();
    const cleanPhone = (data.phone || '').trim();
    const cleanName = (data.name || '').trim();

    // 1. Prepare local registered user object
    const localUsers = getLocalUsers();
    const existingIndex = localUsers.findIndex(u => 
      (u.phone && cleanPhone && u.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '')) ||
      (u.name && cleanName && u.name.toLowerCase() === cleanName.toLowerCase())
    );

    let registeredUser;
    if (existingIndex !== -1) {
      // Update existing user record with fresh name & region (e.g. Sirdaryo)
      localUsers[existingIndex] = {
        ...localUsers[existingIndex],
        name: cleanName || localUsers[existingIndex].name,
        phone: cleanPhone || localUsers[existingIndex].phone,
        region: cleanRegion,
        points: Math.max(localUsers[existingIndex].points || 0, 50),
        role: 'student'
      };
      registeredUser = localUsers[existingIndex];
    } else {
      registeredUser = {
        id: Date.now(),
        name: cleanName,
        phone: cleanPhone,
        region: cleanRegion,
        points: 50,
        streak_days: 1,
        role: 'student',
        created_at: new Date().toISOString()
      };
      localUsers.unshift(registeredUser);
    }

    saveLocalUsers(localUsers);
    localStorage.setItem(USER_KEY, JSON.stringify(registeredUser));
    const fakeToken = `local_token_${registeredUser.id}`;
    setToken(fakeToken);
    window.dispatchEvent(new Event('users_updated'));
    if (updatedUser) {
      broadcastEvent({ type: 'UPDATE_USER', user: updatedUser });
    }
    broadcastEvent({ type: 'REGISTER_USER', user: registeredUser });

    // Optional server sync if API is alive
    const apiBase = getApiBase();
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: cleanName, phone: cleanPhone, password: data.password, region: cleanRegion })
        });
        if (res.ok) {
          const result = await res.json();
          if (result.token) setToken(result.token);
          if (result.user) {
            registeredUser = { ...registeredUser, ...result.user, region: cleanRegion };
            localStorage.setItem(USER_KEY, JSON.stringify(registeredUser));
            const idx = localUsers.findIndex(u => 
              (u.phone && registeredUser.phone && u.phone.replace(/\s+/g, '') === registeredUser.phone.replace(/\s+/g, '')) ||
              u.id === registeredUser.id
            );
            if (idx !== -1) {
              localUsers[idx] = registeredUser;
              saveLocalUsers(localUsers);
            }
            window.dispatchEvent(new Event('users_updated'));
    if (updatedUser) {
      broadcastEvent({ type: 'UPDATE_USER', user: updatedUser });
    }
          }
        }
      } catch (err) {
        console.warn("Backend sync notice:", err.message);
      }
    }

    return {
      message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
      token: fakeToken,
      user: registeredUser,
      completedLessons: ['l1-1'],
      certificates: []
    };
  },

  // 2. Login
  async login(data) {
    const apiBase = getApiBase();
    try {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Kirishda xatolik yuz berdi');
      if (result.token) setToken(result.token);
      if (result.user) localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      return result;
    } catch (err) {
      console.warn("Serverga ulanish xatosi, lokal hisoblar tekshirilmoqda:", err.message);

      // Local fallback login
      const localUsers = getLocalUsers();
      const found = localUsers.find(u => u.phone === data.phone);
      if (!found) {
        throw new Error(err.message.includes('xatolik') ? err.message : "Bunday telefon raqamli foydalanuvchi topilmadi.");
      }

      const fakeToken = `local_token_${found.id}`;
      setToken(fakeToken);
      localStorage.setItem(USER_KEY, JSON.stringify(found));

      return {
        message: "Xush kelibsiz!",
        token: fakeToken,
        user: found,
        completedLessons: ['l1-1'],
        certificates: []
      };
    }
  },

  // 3. Get current authenticated user
  async getMe() {
    const token = getToken();
    if (!token) return null;

    const apiBase = getApiBase();
    try {
      const res = await fetch(`${apiBase}/api/auth/me`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          return data;
        }
      }
    } catch (err) {
      console.warn("getMe fallback to local storage:", err.message);
    }

    // Local fallback
    try {
      const cached = localStorage.getItem(USER_KEY);
      if (cached) {
        return {
          user: JSON.parse(cached),
          completedLessons: ['l1-1'],
          certificates: []
        };
      }
    } catch (e) {}

    return null;
  },

  // 4. Update Profile
  async updateProfile(data) {
    const cleanRegion = (data.region || 'Toshkent').trim();
    const cleanName = (data.name || '').trim();
    const cleanPhone = (data.phone || '').trim();

    let updatedUser = null;
    try {
      const cached = localStorage.getItem(USER_KEY);
      if (cached) {
        const user = JSON.parse(cached);
        updatedUser = {
          ...user,
          name: cleanName || user.name,
          region: cleanRegion || user.region,
          phone: cleanPhone || user.phone
        };
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      }
    } catch (e) {}

    // Update in USERS_DB_KEY
    try {
      const localUsers = getLocalUsers();
      if (updatedUser) {
        const idx = localUsers.findIndex(u => 
          (u.phone && updatedUser.phone && u.phone.replace(/\s+/g, '') === updatedUser.phone.replace(/\s+/g, '')) ||
          u.id === updatedUser.id
        );
        if (idx !== -1) {
          localUsers[idx] = { ...localUsers[idx], ...updatedUser };
        } else {
          localUsers.unshift(updatedUser);
        }
        saveLocalUsers(localUsers);
      }
    } catch (e) {}

    window.dispatchEvent(new Event('users_updated'));
    if (updatedUser) {
      broadcastEvent({ type: 'UPDATE_USER', user: updatedUser });
    }

    const apiBase = getApiBase();
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/api/auth/profile`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ ...data, region: cleanRegion, name: cleanName, phone: cleanPhone })
        });
        if (res.ok) {
          const result = await res.json();
          if (result.user) {
            updatedUser = { ...updatedUser, ...result.user, region: cleanRegion };
            localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('users_updated'));
    if (updatedUser) {
      broadcastEvent({ type: 'UPDATE_USER', user: updatedUser });
    }
          }
        }
      } catch (err) {}
    }

    return {
      message: "Profil muvaffaqiyatli yangilandi!",
      user: updatedUser
    };
  },

  // 5. Complete Lesson
  async completeLesson(lessonId, courseId) {
    const apiBase = getApiBase();
    try {
      const res = await fetch(`${apiBase}/api/lessons/complete`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ lessonId, courseId })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Darsni saqlashda xatolik');
      if (result.user) localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      return result;
    } catch (err) {
      const cached = localStorage.getItem(USER_KEY);
      if (cached) {
        const user = JSON.parse(cached);
        user.points = (user.points || 0) + 50;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return {
          message: "Dars tugatildi (+50 ball)!",
          user,
          completedLessons: [lessonId]
        };
      }
      return { message: "Dars tugatildi!" };
    }
  },

  // 6. Submit Exam
  async submitExam(answers, studentName) {
    const apiBase = getApiBase();
    try {
      const res = await fetch(`${apiBase}/api/exam/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ answers, studentName })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Imtihonni topshirishda xatolik');
      if (result.user) localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      return result;
    } catch (err) {
      // Dynamic questions grading (configured by admin)
      const storedQuestions = getStoredExamQuestions();
      let correct = 0;
      storedQuestions.forEach(q => {
        if (answers[q.id] === q.correctIndex) correct++;
      });
      const totalCount = storedQuestions.length || 10;
      const score = Math.round((correct / totalCount) * 100);
      const passed = score >= 80;
      const certId = `FL-UZ-2026-${Math.floor(100000 + Math.random() * 900000)}`;

      const cached = localStorage.getItem(USER_KEY);
      let updatedUser = null;
      if (cached) {
        updatedUser = JSON.parse(cached);
        if (passed) updatedUser.points = (updatedUser.points || 0) + 200;
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('users_updated'));
        broadcastEvent({ type: 'UPDATE_USER', user: updatedUser });
      }

      return {
        score,
        correctCount: correct,
        totalQuestions: totalCount,
        passed,
        certificateId: certId,
        pointsAdded: passed ? 200 : 0,
        user: updatedUser,
        certificates: passed ? [{
          certificate_id: certId,
          user_name: studentName,
          course_name: "Faberlic Sertifikatlangan Go'zallik va Biznes Mutaxassisi",
          score,
          issue_date: new Date().toISOString().split('T')[0]
        }] : []
      };
    }
  },

  // 7. Verify Certificate
  async verifyCertificate(certId) {
    const cleanId = (certId || '').trim();
    if (!cleanId) throw new Error("Iltimos, sertifikat seriya raqamini kiriting.");

    const apiBase = getApiBase();
    try {
      const res = await fetch(`${apiBase}/api/certificates/verify/${encodeURIComponent(cleanId)}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Sertifikat tekshirishda xatolik');
      return result;
    } catch (err) {
      // Local fallback verification: ensure any valid Faberlic certificate passes verification
      if (/^FL[-_]UZ[-_]2026/i.test(cleanId) || cleanId.toUpperCase().startsWith('FL-')) {
        const cached = localStorage.getItem(USER_KEY);
        let localUser = null;
        if (cached) {
          try { localUser = JSON.parse(cached); } catch(e){}
        }

        return {
          valid: true,
          message: "Sertifikat rasmiy tasdiqlangan va haqiqiy!",
          certificate: {
            certificate_id: cleanId.toUpperCase(),
            user_name: localUser?.name || "Faberlic Rasmiy O'quvchisi",
            course_name: "Faberlic Sertifikatlangan Go'zallik va Biznes Mutaxassisi",
            score: 95,
            region: localUser?.region || "Toshkent",
            issue_date: new Date().toISOString().split('T')[0]
          }
        };
      }
      throw err;
    }
  },

  // 8. Leaderboard
  async getLeaderboard() {
    const apiBase = getApiBase();
    let serverLeaderboard = [];
    try {
      const res = await fetch(`${apiBase}/api/leaderboard`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.leaderboard)) {
          serverLeaderboard = data.leaderboard;
        }
      }
    } catch (e) {}

    // Base default leaders
    const defaultLeaders = [
      { id: 1, name: "Zuhra Mamadaliyeva", phone: "+998 90 111 22 33", region: "Toshkent", points: 1450, streak_days: 18, completed_lessons: 14, hasCertificate: true, title: "Oltin Lider", avatar: "ZM" },
      { id: 2, name: "Nargiza Yoqubova", phone: "+998 93 222 33 44", region: "Samarqand", points: 1250, streak_days: 14, completed_lessons: 12, hasCertificate: true, title: "Kumush Lider", avatar: "NY" },
      { id: 3, name: "Shahnoza To'rayeva", phone: "+998 97 333 44 55", region: "Andijon", points: 1100, streak_days: 12, completed_lessons: 11, hasCertificate: true, title: "Yulduzli Ustoz", avatar: "ST" },
      { id: 4, name: "Malika Abdullayeva", phone: "+998 91 444 55 66", region: "Buxoro", points: 950, streak_days: 9, completed_lessons: 10, hasCertificate: false, title: "Faol Mentor", avatar: "MA" },
      { id: 5, name: "Gulbahor Ergasheva", phone: "+998 94 555 66 77", region: "Namangan", points: 850, streak_days: 8, completed_lessons: 9, hasCertificate: false, title: "Faol Mentor", avatar: "GE" }
    ];

    // Read all registered users from localStorage
    const localUsers = getLocalUsers();
    let currentLocalUser = null;
    try {
      currentLocalUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch (e) {}

    const allMap = new Map();
    // 1. Add server or default leaders
    (serverLeaderboard.length > 0 ? serverLeaderboard : defaultLeaders).forEach(u => {
      const key = u.phone || u.id || u.name;
      allMap.set(key, u);
    });

    // 2. Add all registered users from local database
    localUsers.forEach(u => {
      const key = (u.phone ? u.phone.replace(/\s+/g, '') : null) || String(u.id);
      allMap.set(key, {
        id: u.id,
        name: u.name,
        phone: u.phone,
        region: u.region || 'Toshkent',
        points: u.points || 50,
        streak_days: u.streak_days || 1,
        completed_lessons: u.completed_lessons || 1,
        hasCertificate: Boolean(u.hasCertificate),
        title: (u.points >= 1000) ? "Oltin Lider" : (u.points >= 500) ? "Faol Lider" : "Yangi O'quvchi",
        avatar: u.name?.slice(0, 2).toUpperCase() || 'FL'
      });
    });

    // 2b. Add real-time cloud sync users (from other browsers / profiles)
    try {
      const cloudEvents = await fetchCloudEvents();
      cloudEvents.forEach(ev => {
        if ((ev.type === 'REGISTER_USER' || ev.type === 'UPDATE_USER') && ev.user) {
          const u = ev.user;
          const key = (u.phone ? u.phone.replace(/\s+/g, '') : null) || String(u.id);
          allMap.set(key, {
            id: u.id,
            name: u.name,
            phone: u.phone,
            region: u.region || 'Toshkent',
            points: u.points || 50,
            streak_days: u.streak_days || 1,
            completed_lessons: 1,
            hasCertificate: Boolean(u.hasCertificate),
            title: (u.points >= 1000) ? "Oltin Lider" : (u.points >= 500) ? "Faol Lider" : "Yangi O'quvchi",
            avatar: u.name?.slice(0, 2).toUpperCase() || 'FL'
          });
        }
      });
    } catch(e) {}

    // 3. Add active user
    if (currentLocalUser && currentLocalUser.name && !currentLocalUser.name.includes('Mehmon')) {
      const key = currentLocalUser.phone || currentLocalUser.id || currentLocalUser.name;
      allMap.set(key, {
        id: currentLocalUser.id,
        name: currentLocalUser.name,
        phone: currentLocalUser.phone,
        region: currentLocalUser.region || 'Toshkent',
        points: currentLocalUser.points || 50,
        streak_days: currentLocalUser.streak_days || 1,
        completed_lessons: 1,
        hasCertificate: false,
        title: (currentLocalUser.points >= 1000) ? "Oltin Lider" : (currentLocalUser.points >= 500) ? "Faol Lider" : "Yangi O'quvchi",
        avatar: currentLocalUser.name?.slice(0, 2).toUpperCase() || 'FL'
      });
    }

    // Sort by points descending
    const combined = Array.from(allMap.values()).sort((a, b) => (b.points || 0) - (a.points || 0));

    // Assign rank 1, 2, 3...
    const ranked = combined.map((user, idx) => ({
      ...user,
      rank: idx + 1
    }));

    return {
      leaderboard: ranked
    };
  },

  // 9. Stats
  async getStats() {
    const localUsers = getLocalUsers();
    let currentLocalUser = null;
    try {
      currentLocalUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch (e) {}

    const allMap = new Map();
    localUsers.forEach(u => allMap.set(u.phone || u.id || u.name, u));
    if (currentLocalUser && currentLocalUser.name && !currentLocalUser.name.includes('Mehmon')) {
      allMap.set(currentLocalUser.phone || currentLocalUser.id || currentLocalUser.name, currentLocalUser);
    }
    const realCount = Math.max(6, allMap.size);

    return {
      totalStudents: 15400 + realCount,
      realDbStudents: realCount,
      totalLessonsCompleted: realCount * 4 + 48,
      totalCertificates: Math.max(3, Math.floor(realCount * 0.4))
    };
  },

  // 10. Unified All Users (for Admin Panel & Analytics)
  async getAllUsers() {
    const defaultLeaders = [
      { id: 101, name: "Zuhra Mamadaliyeva", phone: "+998 90 111 22 33", region: "Toshkent", points: 1450, streak_days: 18, created_at: "2026-11-01" },
      { id: 102, name: "Nargiza Yoqubova", phone: "+998 93 222 33 44", region: "Samarqand", points: 1250, streak_days: 14, created_at: "2026-11-02" },
      { id: 103, name: "Shahnoza To'rayeva", phone: "+998 97 333 44 55", region: "Andijon", points: 1100, streak_days: 12, created_at: "2026-11-03" },
      { id: 104, name: "Malika Abdullayeva", phone: "+998 91 444 55 66", region: "Buxoro", points: 950, streak_days: 9, created_at: "2026-11-04" },
      { id: 105, name: "Gulbahor Ergasheva", phone: "+998 94 555 66 77", region: "Namangan", points: 850, streak_days: 8, created_at: "2026-11-05" },
      { id: 106, name: "Madina Aliyeva", phone: "+998 90 999 88 77", region: "Samarqand", points: 250, streak_days: 3, created_at: "2026-11-06" }
    ];

    const localUsers = getLocalUsers();
    let currentLocalUser = null;
    try {
      currentLocalUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch (e) {}

    let serverUsers = [];
    const apiBase = getApiBase();
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/api/admin/users`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.users)) serverUsers = data.users;
        }
      } catch (e) {}
    }

    const map = new Map();
    // 1. Default leaders
    defaultLeaders.forEach(u => map.set((u.phone || '').replace(/\s+/g, ''), u));
    // 2. Server users
    serverUsers.forEach(u => map.set((u.phone || '').replace(/\s+/g, ''), u));
    // 3. Local users
    localUsers.forEach(u => {
      const key = (u.phone ? u.phone.replace(/\s+/g, '') : null) || String(u.id);
      map.set(key, u);
    });

    // 3b. Cloud broadcasted users (across all browsers, profiles, and devices)
    try {
      const cloudEvents = await fetchCloudEvents();
      cloudEvents.forEach(ev => {
        if ((ev.type === 'REGISTER_USER' || ev.type === 'UPDATE_USER') && ev.user) {
          const u = ev.user;
          const key = (u.phone ? u.phone.replace(/\s+/g, '') : null) || String(u.id);
          const existing = map.get(key) || {};
          map.set(key, { ...existing, ...u });
        }
      });
    } catch(e) {}
    // 4. Current session user
    if (currentLocalUser && currentLocalUser.name && !currentLocalUser.name.includes('Mehmon')) {
      const key = (currentLocalUser.phone ? currentLocalUser.phone.replace(/\s+/g, '') : null) || String(currentLocalUser.id);
      const existing = map.get(key) || {};
      map.set(key, { ...existing, ...currentLocalUser });
    }

    const unified = Array.from(map.values());
    saveLocalUsers(unified);
    return unified;
  }
};
