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
    commentsCount: 3,
    createdAt: 'Bugun, 14:30',
    comments: [
      {
        id: 'c1-1',
        authorName: 'Shahnoza Karimova',
        text: 'Ovozli maslahat uchun katta rahmat, juda kuchli motivatsiya berdi! ❤️',
        createdAt: '15 daqiqa oldin'
      },
      {
        id: 'c1-2',
        authorName: 'Dilnoza Ergasheva',
        text: 'Darslarni ko\'rib chiqdim, juda tushunarli ekan. Rahmat ustoz!',
        createdAt: '40 daqiqa oldin'
      },
      {
        id: 'c1-3',
        authorName: 'Malika Abdullayeva',
        text: 'Biz ham albatta direktor bo\'lamiz inshaalloh! 🌸',
        createdAt: '1 soat oldin'
      }
    ]
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
    commentsCount: 2,
    createdAt: 'Kecha, 18:15',
    comments: [
      {
        id: 'c2-1',
        authorName: 'Zuhra Mamadaliyeva',
        text: 'Yangi iforlar ajoyib! Ayniqsa Donna Felice juda yoqdi 😍',
        createdAt: '2 soat oldin'
      },
      {
        id: 'c2-2',
        authorName: 'Nilufar Rahimova',
        text: 'Mijozlarimga zakaz qildim, hamma maqtayapti!',
        createdAt: '4 soat oldin'
      }
    ]
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
    commentsCount: 2,
    createdAt: '2 kun oldin',
    comments: [
      {
        id: 'c3-1',
        authorName: 'Gulbahor To\'rayeva',
        text: 'Aynan shu maslahat kerak edi! Qanday gapirishni bilib oldim 👍',
        createdAt: '1 kun oldin'
      },
      {
        id: 'c3-2',
        authorName: 'Nargiza Yoqubova',
        text: 'Video uchun katta rahmat, tajribangiz bebaho!',
        createdAt: '1 kun oldin'
      }
    ]
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
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure comments array exists on each post
      return parsed.map(p => {
        if (!p.comments) {
          const defaultMatch = DEFAULT_POSTS.find(dp => dp.id === p.id);
          p.comments = defaultMatch?.comments || [];
          p.commentsCount = p.comments.length;
        }
        return p;
      });
    }
    return DEFAULT_POSTS;
  } catch (e) {
    return DEFAULT_POSTS;
  }
}

export function addCommentToPost(postId, commentData) {
  try {
    const posts = getStoredPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return null;

    if (!posts[postIndex].comments) {
      posts[postIndex].comments = [];
    }

    const newComment = {
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      authorName: (commentData.authorName || 'Mehmon').trim(),
      text: commentData.text.trim(),
      createdAt: 'Hozirgina'
    };

    posts[postIndex].comments.push(newComment);
    posts[postIndex].commentsCount = posts[postIndex].comments.length;

    saveStoredPosts(posts);
    return newComment;
  } catch (err) {
    console.error("Add comment error:", err);
    return null;
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
