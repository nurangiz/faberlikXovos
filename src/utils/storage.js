const STORAGE_KEY = 'faberlic_academy_user_data';

export const getStoredUserData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Storage error:', e);
  }
  return {
    name: 'Munisa Rahimova',
    phone: '+998 90 123 45 67',
    region: 'Toshkent',
    completedLessons: ['l1-1'],
    points: 120,
    examPassed: false,
    examScore: 0,
    certificateId: null,
    registeredDate: '2026-11-01',
    streakDays: 4
  };
};

export const saveUserData = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
};

export const markLessonComplete = (lessonId, pointsToAdd = 50) => {
  const current = getStoredUserData();
  if (!current.completedLessons.includes(lessonId)) {
    const updated = {
      ...current,
      completedLessons: [...current.completedLessons, lessonId],
      points: current.points + pointsToAdd
    };
    saveUserData(updated);
    return updated;
  }
  return current;
};
