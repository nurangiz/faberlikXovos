import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, MessageCircle, Send, Bookmark, Play, Pause, Volume2, 
  Sparkles, CheckCircle2, Film, Image as ImageIcon, Mic, Share2, 
  ExternalLink, Plus, RefreshCw, Music
} from 'lucide-react';
import { getStoredPosts, addCommentToPost } from '../utils/postsStorage';

export default function InstagramFeed({ currentUser, onOpenAdmin }) {
  const [posts, setPosts] = useState(() => getStoredPosts());
  const [activeAudioPostId, setActiveAudioPostId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [likesMap, setLikesMap] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [guestNames, setGuestNames] = useState({});
  const [showAllComments, setShowAllComments] = useState({});
  const [commentLikes, setCommentLikes] = useState({});

  useEffect(() => {
    const handleUpdate = () => {
      setPosts(getStoredPosts());
    };
    window.addEventListener('posts_updated', handleUpdate);
    return () => window.removeEventListener('posts_updated', handleUpdate);
  }, []);

  const handleTogglePlay = (postId, audioUrl) => {
    if (activeAudioPostId === postId && isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setActiveAudioPostId(postId);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(e => console.log("Audio play error:", e));
      }
    }
  };

  const handleLike = (postId, defaultCount) => {
    setLikedPosts(prev => {
      const isLiked = !prev[postId];
      setLikesMap(lMap => ({
        ...lMap,
        [postId]: (lMap[postId] ?? defaultCount) + (isLiked ? 1 : -1)
      }));
      return { ...prev, [postId]: isLiked };
    });
  };

  const handleAddComment = (e, postId) => {
    e.preventDefault();
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    let authorName = '';
    if (currentUser && currentUser.name && !currentUser.name.includes('Mehmon')) {
      authorName = currentUser.name;
    } else {
      authorName = (guestNames[postId] || '').trim() || "Faberlic O'quvchisi";
    }

    addCommentToPost(postId, { authorName, text });

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setPosts(getStoredPosts());
    setShowAllComments(prev => ({ ...prev, [postId]: true }));
  };

  const stories = [
    { id: 1, title: 'Ovozli Maslahat', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', hasAudio: true },
    { id: 2, title: 'Biznes Darslar', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', hasVideo: true },
    { id: 3, title: 'Iforlar Kolleksiyasi', avatar: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=200', isNew: true },
    { id: 4, title: 'Direktor Sirlari', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', hasAudio: true },
    { id: 5, title: 'Sovg\'alar & Ballar', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', isNew: true }
  ];

  return (
    <section className="py-14 bg-white border-t border-rose-100">
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)} 
        onError={() => setIsPlaying(false)}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 text-faberlic-800 text-xs font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Akademiya Lenta & Jonli Xabarlar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
            Direktor Ovozli Xabarlari va Jonli Maslahatlar
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Huddi Instagram kanali kabi: eng yangi ovozli xabarlar, rasmlar va videolarni kuzatib boring!
          </p>
        </div>

        {/* Stories Bar (Instagram style) */}
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200/80 mb-8 shadow-xs">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {stories.map(story => (
              <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md group-hover:scale-105 transition transform">
                  <div className="p-0.5 bg-white rounded-full">
                    <img 
                      src={story.avatar} 
                      alt={story.title} 
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover" 
                    />
                  </div>
                  {story.hasAudio && (
                    <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-faberlic-700 text-white flex items-center justify-center border-2 border-white shadow-xs">
                      <Mic className="w-2.5 h-2.5" />
                    </span>
                  )}
                  {story.hasVideo && (
                    <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center border-2 border-white shadow-xs">
                      <Film className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-slate-700 max-w-[70px] truncate text-center">
                  {story.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-8">
          {posts.map(post => {
            const isAudio = post.type === 'audio';
            const isImage = post.type === 'image';
            const isVideo = post.type === 'video';
            const currentLikes = likesMap[post.id] ?? post.likesCount;
            const isLiked = likedPosts[post.id];
            const isAudioActive = activeAudioPostId === post.id && isPlaying;

            return (
              <article 
                key={post.id} 
                className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden transition hover:shadow-lg"
              >
                {/* Post Top Header */}
                <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={post.authorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'} 
                        alt={post.authorName} 
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-rose-400"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-faberlic-700 text-white flex items-center justify-center border border-white">
                        <CheckCircle2 className="w-3 h-3 text-white fill-faberlic-700" />
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                          {post.authorName}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-50 text-faberlic-700 font-extrabold border border-rose-200">
                          Direktor
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {post.createdAt} • {post.authorRole}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                    {isAudio && <><Mic className="w-3 h-3 text-rose-600" /> Ovozli Xabar</>}
                    {isImage && <><ImageIcon className="w-3 h-3 text-pink-600" /> Foto</>}
                    {isVideo && <><Film className="w-3 h-3 text-purple-600" /> Video Maslahat</>}
                  </span>
                </div>

                {/* Media Container */}
                <div className="relative bg-slate-900 overflow-hidden">
                  
                  {/* 1. AUDIO POST */}
                  {isAudio && (
                    <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 p-6 sm:p-8 text-white space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
                          <Music className="w-4 h-4 text-rose-400 animate-pulse" />
                          <span>Direktor Ovozli Murojaati</span>
                        </div>
                        <span className="text-xs text-amber-300 font-mono font-bold bg-white/10 px-2.5 py-1 rounded-full">
                          {post.audioDuration || '02:45'}
                        </span>
                      </div>

                      <h3 className="font-serif font-black text-lg sm:text-xl text-white">
                        {post.title}
                      </h3>

                      {/* Custom Audio Player UI */}
                      <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-4 shadow-inner">
                        <button
                          onClick={() => handleTogglePlay(post.id, post.mediaUrl)}
                          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-faberlic-600 via-rose-500 to-pink-500 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-lg transition transform shrink-0"
                          aria-label={isAudioActive ? "To'xtatish" : "Eshitish"}
                        >
                          {isAudioActive ? (
                            <Pause className="w-6 h-6 fill-white" />
                          ) : (
                            <Play className="w-6 h-6 fill-white translate-x-0.5" />
                          )}
                        </button>

                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-rose-200 font-medium">
                            <span>{isAudioActive ? "Jonli eshitilmoqda..." : "Eshitish uchun bosing"}</span>
                            <span className="font-mono text-[11px] text-amber-300">{post.audioDuration}</span>
                          </div>
                          
                          {/* Simulated waveform bars */}
                          <div className="flex items-center gap-1 h-6">
                            {[40, 65, 80, 50, 95, 30, 85, 60, 45, 90, 70, 40, 85, 60, 100, 75, 55, 35, 65, 80].map((h, i) => (
                              <div
                                key={i}
                                className={`flex-1 rounded-full transition-all duration-300 ${
                                  isAudioActive 
                                    ? 'bg-rose-400 animate-pulse' 
                                    : 'bg-white/30'
                                }`}
                                style={{ 
                                  height: `${h}%`,
                                  animationDelay: `${(i * 0.05).toFixed(2)}s`
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. IMAGE POST */}
                  {isImage && (
                    <div className="relative group">
                      <img 
                        src={post.mediaUrl} 
                        alt={post.title} 
                        className="w-full max-h-[480px] object-cover" 
                        onDoubleClick={() => handleLike(post.id, post.likesCount)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                    </div>
                  )}

                  {/* 3. VIDEO POST */}
                  {isVideo && (
                    <div className="aspect-video w-full">
                      {post.mediaUrl.includes('youtube.com') || post.mediaUrl.includes('youtu.be') ? (
                        <iframe
                          src={post.mediaUrl}
                          title={post.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video 
                          src={post.mediaUrl} 
                          controls 
                          className="w-full h-full object-cover"
                          poster={post.videoThumbnail}
                        />
                      )}
                    </div>
                  )}

                </div>

                {/* Actions Bar (Instagram style: Like, Comment, Share, Save) */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id, post.likesCount)}
                        className={`flex items-center gap-1.5 text-xs font-bold transition active:scale-125 ${
                          isLiked ? 'text-rose-600' : 'text-slate-700 hover:text-rose-600'
                        }`}
                      >
                        <Heart className={`w-6 h-6 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                        <span>{currentLikes} ta</span>
                      </button>

                      <button 
                        onClick={() => setShowAllComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-rose-600 transition"
                      >
                        <MessageCircle className="w-6 h-6" />
                        <span>{(post.comments || []).length} ta sharh</span>
                      </button>

                      <a 
                        href="https://t.me" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-slate-700 hover:text-rose-600 transition"
                        title="Telegramda ulashish"
                      >
                        <Send className="w-5 h-5" />
                      </a>
                    </div>

                    <button className="text-slate-500 hover:text-slate-900 transition">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Caption & Title */}
                  <div className="space-y-1.5 text-xs sm:text-sm">
                    <p className="text-slate-800 leading-relaxed font-medium">
                      <strong className="text-slate-950 font-bold">{post.authorName}: </strong>
                      {post.caption}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-rose-600 pt-1">
                      <span>#FaberlicXovos</span>
                      <span>#AyollarAkademiyasi</span>
                      <span>#DirektorOvozli</span>
                    </div>
                  </div>

                  {/* Instagram-style Comments Section */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    {/* View all comments toggle */}
                    {(post.comments || []).length > 2 && (
                      <button
                        type="button"
                        onClick={() => setShowAllComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className="text-xs font-semibold text-slate-500 hover:text-faberlic-700 transition block text-left"
                      >
                        {showAllComments[post.id] 
                          ? '▲ Sharhlarni yashirish' 
                          : `💬 Barcha ${(post.comments || []).length} ta sharhni ko'rish...`}
                      </button>
                    )}

                    {/* Comments List */}
                    <div className="space-y-2">
                      {((post.comments || []).length > 0) ? (
                        (showAllComments[post.id] 
                          ? (post.comments || []) 
                          : (post.comments || []).slice(-2)
                        ).map(c => (
                          <div key={c.id} className="flex items-start justify-between gap-2 text-xs">
                            <div className="space-y-0.5 leading-snug">
                              <span className="font-bold text-slate-900 mr-1.5">{c.authorName}:</span>
                              <span className="text-slate-700">{c.text}</span>
                              <span className="block text-[10px] text-slate-400 font-medium">{c.createdAt}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setCommentLikes(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                              className="text-slate-300 hover:text-rose-500 transition pt-0.5 shrink-0"
                              title="Yoqdi"
                            >
                              <Heart className={`w-3.5 h-3.5 ${commentLikes[c.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-xs italic">Hali sharhlar yo'q. Birinchi bo'lib fikr qoldiring! 🌸</p>
                      )}
                    </div>

                    {/* Write Comment Form (Instagram style) */}
                    <form 
                      onSubmit={(e) => handleAddComment(e, post.id)}
                      className="pt-2 flex items-center gap-2 border-t border-slate-50"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-faberlic-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                        {currentUser?.name ? currentUser.name[0].toUpperCase() : 'FL'}
                      </div>

                      {/* Guest name input if not logged in */}
                      {(!currentUser || !currentUser.name || currentUser.name.includes('Mehmon')) && (
                        <input
                          type="text"
                          placeholder="Ismingiz..."
                          value={guestNames[post.id] || ''}
                          onChange={(e) => setGuestNames(prev => ({ ...prev, [post.id]: e.target.value }))}
                          className="w-24 sm:w-28 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-rose-300"
                        />
                      )}

                      <input
                        type="text"
                        placeholder="Sharh yozing... (masalan: Zo'r maslahat bo'libdi! ❤️)"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-rose-400 text-xs focus:outline-none transition"
                      />

                      <button
                        type="submit"
                        disabled={!commentInputs[post.id]?.trim()}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-faberlic-700 to-rose-600 hover:from-faberlic-800 hover:to-rose-700 disabled:opacity-30 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition shrink-0"
                      >
                        <Send className="w-3 h-3" />
                        <span className="hidden sm:inline">Yuborish</span>
                      </button>
                    </form>
                  </div>

                </div>

              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
