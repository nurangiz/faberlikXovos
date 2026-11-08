// Storage for Instagram-style Akademiya Lenta / Posts & Stories
import { broadcastEvent } from './cloudSync';

const POSTS_STORAGE_KEY = 'faberlic_academy_posts';

export const DEFAULT_POSTS = [
  {
    id: 'post-1',
    authorName: 'NURULLAYEVA NURANGIZ',
    authorRole: 'Faberlic Oltin Direktori & Asoschisi',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    type: 'audio', // 'audio', 'image', 'video'
    title: '🌸 Ovozli Murojaat: Biznesni noldan boshlash sirlari',
    mediaUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-piano-112621.mp3',
    audioDuration: '02:45 daqiqa',
    caption: 'Assalomu alaykum aziz opa-singillarim! Bugun barchangiz uchun yangi darslarni joyladik. Qanday qilib uydan chiqmasdan turib mustaqil biznes yuritish va o\'z daromadingizga ega bo\'lishingiz mumkinligi haqida ushbu ovozli xabarda batafsil aytib o\'tdim. Albatta eshiting va darslarni boshlang! 💖',
    likesCount: 142,
    commentsCount: 28,
    createdAt: 'Bugun, 14:30'
  },
  {
    id: 'post-2',
    authorName: 'NURULLAYEVA NURANGIZ',
    authorRole: 'Faberlic Oltin Direktori & Asoschisi',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    type: 'image',
    title: '✨ Yangi Parfyumeriya va Go\'zallik Kolleksiyasi',
    mediaUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1000',
    caption: 'Oltin maslahatchilarimiz uchun yangi fransuz iforlari kolleksiyasi yetib keldi! Har bir ayol o\'ziga xos go\'zallikka loyiq. Katalog ensiklopediyasida har bir mahsulotning tarkibi va qo\'llanilishi haqida bilib oling. Sizga qaysi ifor ko\'proq yoqadi? 🌺',
    likesCount: 289,
    commentsCount: 45,
    createdAt: 'Kecha, 18:15'
  },
  {
    id: 'post-3',
    authorName: 'NURULLAYEVA NURANGIZ',
    authorRole: 'Faberlic Oltin Direktori & Asoschisi',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    type: 'video',
    title: '🎬 Video Maslahat: Mijozlar bilan ishonchli suhbat',
    mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoThumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    caption: 'Mijozlarga mahsulot tavsiya qilayotganda eng muhimi — samimiylik va to\'g\'ri tushuntirish. Videoni ko\'ring va darslarimizdagi amaliy tavsiyalarni qo\'llang! 🚀',
    likesCount: 312,
    commentsCount: 67,
    createdAt: '2 kun oldin'
  }
];

export function getStoredPosts() {
  try {
    const raw = localStorage.getItem(POSTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(DEFAULT_POSTS));
      return DEFAULT_POSTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_POSTS;
  } catch (e) {
    return DEFAULT_POSTS;
  }
}

export function saveStoredPosts(posts) {
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    window.dispatchEvent(new Event('posts_updated'));
    broadcastEvent({ type: 'POSTS_UPDATED', posts });
  } catch (e) {
    console.error("Save posts error:", e);
  }
}

export function resetStoredPosts() {
  saveStoredPosts(DEFAULT_POSTS);
  return DEFAULT_POSTS;
}
