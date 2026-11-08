import { COURSES as DEFAULT_COURSES } from '../data/coursesData';

const COURSES_STORAGE_KEY = 'faberlic_custom_courses_v1';

// Format YouTube/Vimeo or direct URL into an embeddable format
export function formatVideoUrl(url) {
  if (!url) return '';
  url = url.trim();

  // YouTube standard watch or share link
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  // Vimeo link
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return url;
}

// Check if a URL is a real embeddable or playable video URL
export function isPlayableVideo(url) {
  if (!url) return false;
  const clean = url.trim();
  return (
    clean.includes('youtube.com') ||
    clean.includes('youtu.be') ||
    clean.includes('vimeo.com') ||
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.startsWith('http://') ||
    clean.startsWith('https://')
  );
}

// Get courses (either customized by admin or default)
export function getStoredCourses() {
  try {
    const saved = localStorage.getItem(COURSES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not load custom courses:", e);
  }
  return DEFAULT_COURSES;
}

// Save customized courses by Admin
export function saveStoredCourses(courses) {
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
    window.dispatchEvent(new Event('courses_updated'));
  } catch (e) {
    console.error("Could not save custom courses:", e);
  }
}

// Reset back to original 4 modules
export function resetStoredCourses() {
  localStorage.removeItem(COURSES_STORAGE_KEY);
  window.dispatchEvent(new Event('courses_updated'));
  return DEFAULT_COURSES;
}
