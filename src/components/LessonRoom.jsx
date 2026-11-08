import React, { useState, useEffect } from 'react';
import { getStoredCourses, formatVideoUrl, isPlayableVideo } from '../utils/coursesStorage';
import { 
  Play, Pause, RotateCcw, Volume2, Maximize, CheckCircle2, 
  Circle, BookOpen, FileText, CheckSquare, HelpCircle, 
  ChevronRight, ChevronLeft, Award, Sparkles, Download, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LessonRoom({ 
  currentCourseId, 
  setCurrentCourseId, 
  userCompletedLessons, 
  onCompleteLesson,
  onOpenExam
}) {
  const [courses, setCourses] = useState(() => getStoredCourses());

  useEffect(() => {
    const handleUpdate = () => {
      setCourses(getStoredCourses());
    };
    window.addEventListener('courses_updated', handleUpdate);
    return () => window.removeEventListener('courses_updated', handleUpdate);
  }, []);

  const currentCourse = courses.find(c => c.id === currentCourseId) || courses[0] || {
    id: 'biznes-boshlash',
    title: '1-Modul: Faberlic Biznes Boshlash',
    lessons: []
  };
  const [activeLessonId, setActiveLessonId] = useState(() => currentCourse.lessons?.[0]?.id || 'l1-1');
  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'actions', 'quiz', 'resources'

  // Sync active lesson when course changes
  useEffect(() => {
    if (currentCourse && currentCourse.lessons && currentCourse.lessons.length > 0) {
      if (!currentCourse.lessons.some(l => l.id === activeLessonId)) {
        setActiveLessonId(currentCourse.lessons[0].id);
      }
    }
  }, [currentCourseId, currentCourse]);
  
  // Video player simulated states
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSeconds, setProgressSeconds] = useState(45);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoSpeedMenuOpen, setVideoSpeedMenuOpen] = useState(false);

  // Quiz states
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState(null);

  // Reset lesson state when active lesson changes
  const activeLesson = (currentCourse.lessons && currentCourse.lessons.find(l => l.id === activeLessonId)) || currentCourse.lessons?.[0] || {
    id: 'placeholder',
    number: 1,
    title: 'Dars mavzusi',
    duration: '20 daqiqa',
    notes: 'Dars ma\'lumotlari yuklanmoqda...',
    actionSteps: [],
    quiz: []
  };

  useEffect(() => {
    setIsPlaying(false);
    setProgressSeconds(30);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizFeedback(null);
  }, [activeLessonId]);

  // Handle play/pause timer simulation
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSeconds(prev => {
          if (prev >= 600) {
            setIsPlaying(false);
            return 600;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const isCompleted = userCompletedLessons.includes(activeLesson.id);

  const handleFinishLesson = () => {
    onCompleteLesson(activeLesson.id);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Find next lesson
    const currentIndex = currentCourse.lessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex < currentCourse.lessons.length - 1) {
      setActiveLessonId(currentCourse.lessons[currentIndex + 1].id);
    }
  };

  const handleQuizOptionSelect = (qIndex, optionIndex) => {
    if (quizSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [qIndex]: optionIndex
    });
  };

  const handleCheckQuiz = () => {
    if (!activeLesson.quiz) return;
    let correctCount = 0;
    activeLesson.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const isAllCorrect = correctCount === activeLesson.quiz.length;
    setQuizFeedback({
      total: activeLesson.quiz.length,
      correct: correctCount,
      passed: isAllCorrect
    });
    setQuizSubmitted(true);

    if (isAllCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      if (!isCompleted) {
        onCompleteLesson(activeLesson.id);
      }
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="py-8 bg-[#FFF9FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Course selector tabs */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {courses.map(course => (
            <button
              key={course.id}
              onClick={() => {
                setCurrentCourseId(course.id);
                if (course.lessons && course.lessons.length > 0) {
                  setActiveLessonId(course.lessons[0].id);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-2 ${
                course.id === currentCourse.id
                  ? 'bg-faberlic-700 text-white shadow-md shadow-faberlic-700/20'
                  : 'bg-white text-slate-700 border border-rose-100 hover:border-rose-300'
              }`}
            >
              <span>{course.title.split(':')[0]}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                course.id === currentCourse.id ? 'bg-white/20' : 'bg-rose-100 text-faberlic-800'
              }`}>
                {course.lessons.length} dars
              </span>
            </button>
          ))}
        </div>

        {/* Main Grid: Player on left, lessons outline on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Player & Tabs (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Video Player Card */}
            <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative">
              
              {/* Playable Real Video (YouTube, Vimeo, MP4) or Simulated Interactive Player */}
              {isPlayableVideo(activeLesson.videoUrl || activeLesson.videoEmbed) ? (
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={formatVideoUrl(activeLesson.videoUrl || activeLesson.videoEmbed)}
                    title={activeLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="relative aspect-video w-full bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
                  
                  {/* Visual backdrop graphic */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-500 rounded-full blur-3xl"></div>
                  </div>

                  {/* Player Top Overlay */}
                  <div className="relative z-10 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      <span>{currentCourse.title.split(':')[0]} • {activeLesson.number}-Dars</span>
                    </div>
                    <span className="text-xs bg-white/10 px-2.5 py-1 rounded-md text-slate-300">
                      HD 1080p
                    </span>
                  </div>

                  {/* Middle Player Content / Title card */}
                  <div className="relative z-10 text-center my-auto px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-faberlic-600/90 hover:bg-faberlic-600 cursor-pointer mx-auto flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 border-2 border-white/30"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 fill-white" />
                      ) : (
                        <Play className="w-8 h-8 fill-white ml-1" />
                      )}
                    </div>
                    <h3 className="mt-4 font-serif font-bold text-lg sm:text-2xl text-white max-w-xl mx-auto drop-shadow-md">
                      {activeLesson.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-rose-200/90 font-medium">
                      Ustoz: {currentCourse.instructor.name} ({currentCourse.instructor.role})
                    </p>
                  </div>

                  {/* Player Bottom Control Bar */}
                  <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-2xl p-3 space-y-2 border border-white/10">
                    {/* Timeline Bar */}
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
                      <div 
                        className="h-full bg-gradient-to-r from-faberlic-500 to-rose-400 rounded-full"
                        style={{ width: `${(progressSeconds / 600) * 100}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-200">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="hover:text-rose-400 transition"
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        </button>
                        <button 
                          onClick={() => setProgressSeconds(0)}
                          className="hover:text-rose-400 transition text-[11px] flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Boshiga
                        </button>
                        <span className="font-mono text-[11px] text-slate-400">
                          {formatTime(progressSeconds)} / {activeLesson.duration}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Speed selector */}
                        <div className="relative">
                          <button
                            onClick={() => setVideoSpeedMenuOpen(!videoSpeedMenuOpen)}
                            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-bold"
                          >
                            {playbackSpeed}x
                          </button>
                          {videoSpeedMenuOpen && (
                            <div className="absolute bottom-8 right-0 bg-slate-900 border border-slate-700 rounded-lg py-1 w-20 shadow-xl z-20">
                              {[1, 1.25, 1.5, 2].map(speed => (
                                <button
                                  key={speed}
                                  onClick={() => {
                                    setPlaybackSpeed(speed);
                                    setVideoSpeedMenuOpen(false);
                                  }}
                                  className="w-full text-left px-3 py-1 text-xs hover:bg-rose-900/40 text-slate-200 block"
                                >
                                  {speed}x
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <Volume2 className="w-4 h-4 text-slate-300" />
                        <Maximize className="w-4 h-4 text-slate-300 cursor-pointer" />
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Quick Completion & Reward Ribbon */}
            <div className="bg-white p-4 rounded-2xl border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-faberlic-700'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {isCompleted ? "Ushbu dars muvaffaqiyatli o'rganildi!" : "Darsni tugatib, +50 ball oling"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isCompleted ? "Ballaringiz hisobingizga qo'shildi" : "Testni yeching yoki quyidagi tugmani bosing"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleFinishLesson}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-gradient-to-r from-faberlic-700 to-rose-600 hover:from-faberlic-800 hover:to-rose-700 text-white'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{isCompleted ? "Darsni Qayta Tasdiqlash" : "Darsni Tugatdim (+50 Ball)"}</span>
              </button>
            </div>

            {/* Lesson Materials Tabs */}
            <div className="bg-white rounded-3xl border border-rose-100 shadow-lg p-6">
              
              {/* Tab headers */}
              <div className="flex items-center gap-2 border-b border-rose-100 pb-4 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                    activeTab === 'notes'
                      ? 'bg-rose-100/70 text-faberlic-800'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 text-faberlic-700" />
                  <span>Dars Konspekti</span>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                    activeTab === 'quiz'
                      ? 'bg-rose-100/70 text-faberlic-800'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span>Dars Testi (Viktorina)</span>
                  {activeLesson.quiz && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                      {activeLesson.quiz.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('actions')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                    activeTab === 'actions'
                      ? 'bg-rose-100/70 text-faberlic-800'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span>Amaliy Topshiriq</span>
                </button>

                <button
                  onClick={() => setActiveTab('resources')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                    activeTab === 'resources'
                      ? 'bg-rose-100/70 text-faberlic-800'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>Qo'llanmalar</span>
                </button>
              </div>

              {/* Tab 1: Notes (Konspekt) */}
              {activeTab === 'notes' && (
                <div className="pt-6 space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
                  <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/80 mb-4">
                    <h5 className="text-xs font-black uppercase text-faberlic-700 tracking-wider mb-1">
                      Dars Qisqacha Tavsifi:
                    </h5>
                    <p className="text-slate-700 text-sm font-medium">
                      {activeLesson.overview}
                    </p>
                  </div>

                  {/* Render formatted notes */}
                  <div className="prose prose-rose max-w-none space-y-3">
                    {activeLesson.notes.split('\n\n').map((paragraph, idx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4 key={idx} className="font-serif font-black text-lg text-slate-900 pt-2 border-b border-rose-100 pb-1">
                            {paragraph.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (paragraph.startsWith('- ')) {
                        return (
                          <ul key={idx} className="list-disc pl-5 space-y-1 text-slate-700 text-sm">
                            {paragraph.split('\n').map((item, itemIdx) => (
                              <li key={itemIdx}>{item.replace('- ', '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ')) {
                        return (
                          <ol key={idx} className="list-decimal pl-5 space-y-1 text-slate-700 text-sm">
                            {paragraph.split('\n').map((item, itemIdx) => (
                              <li key={itemIdx}>{item.replace(/^\d+\.\s*/, '')}</li>
                            ))}
                          </ol>
                        );
                      }
                      return (
                        <p key={idx} className="text-slate-700 text-sm">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: Quiz (Dars testi) */}
              {activeTab === 'quiz' && (
                <div className="pt-6 space-y-6">
                  {activeLesson.quiz && activeLesson.quiz.length > 0 ? (
                    <>
                      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/70 text-xs sm:text-sm text-amber-900">
                        <strong>Eslatma:</strong> O'tilgan darsni mustahkamlash uchun quyidagi test savollariga javob bering.
                      </div>

                      <div className="space-y-6">
                        {activeLesson.quiz.map((q, qIdx) => (
                          <div key={qIdx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <h5 className="font-bold text-slate-900 text-sm sm:text-base mb-3">
                              {qIdx + 1}. {q.question}
                            </h5>
                            
                            <div className="space-y-2">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = selectedAnswers[qIdx] === optIdx;
                                const isCorrect = q.correctAnswer === optIdx;
                                
                                let optClass = "border-slate-200 hover:border-rose-300 hover:bg-rose-50/50";
                                if (quizSubmitted) {
                                  if (isCorrect) {
                                    optClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                                  } else if (isSelected && !isCorrect) {
                                    optClass = "border-rose-500 bg-rose-50 text-rose-900";
                                  }
                                } else if (isSelected) {
                                  optClass = "border-faberlic-600 bg-rose-50 font-semibold";
                                }

                                return (
                                  <div
                                    key={optIdx}
                                    onClick={() => handleQuizOptionSelect(qIdx, optIdx)}
                                    className={`p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition flex items-center justify-between ${optClass}`}
                                  >
                                    <span>{opt}</span>
                                    {quizSubmitted && isCorrect && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Explanation */}
                            {quizSubmitted && (
                              <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                                <span className="font-bold text-slate-800">Tushuntirish: </span>
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Submit action */}
                      {!quizSubmitted ? (
                        <button
                          onClick={handleCheckQuiz}
                          disabled={Object.keys(selectedAnswers).length < activeLesson.quiz.length}
                          className="w-full py-3.5 rounded-xl bg-faberlic-700 hover:bg-faberlic-800 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
                        >
                          Javoblarni Tekshirish
                        </button>
                      ) : (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-slate-900">
                              Natija: {quizFeedback?.correct} / {quizFeedback?.total} to'g'ri!
                            </div>
                            <div className="text-xs text-slate-600">
                              {quizFeedback?.passed ? "Ajoyib natija! Ballaringizga qo'shildi." : "Qayta urinib ko'rishingiz mumkin."}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedAnswers({});
                              setQuizSubmitted(false);
                            }}
                            className="px-4 py-2 bg-white rounded-xl text-xs font-bold border border-rose-200 hover:bg-rose-100"
                          >
                            Qayta Yechish
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      Ushbu dars uchun test keyingi versiyada yangilanadi.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Action Steps */}
              {activeTab === 'actions' && (
                <div className="pt-6 space-y-4">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-900 font-medium">
                    🌸 <strong>Harakatdagi bilim — muvaffaqiyat garovi!</strong> Darsni ko'rganingizdan so'ng darhol ushbu amallarni bajaring:
                  </div>

                  <div className="space-y-3">
                    {activeLesson.actionSteps?.map((step, sIdx) => (
                      <div key={sIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-faberlic-700 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Resources */}
              {activeTab === 'resources' && (
                <div className="pt-6 space-y-4">
                  <div className="p-4 rounded-2xl border border-slate-200 hover:border-rose-300 transition flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-faberlic-700 flex items-center justify-center font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-800">
                          Faberlic 2026 Marketing Rejasi (Rasmiy Qo'llanma)
                        </div>
                        <div className="text-[11px] text-slate-500">1.4 MB • O'zbek tilida</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert("Qo'llanma yuklab olindi!")}
                      className="px-3.5 py-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-faberlic-700 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Yuklab olish
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 hover:border-rose-300 transition flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                        DOC
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-800">
                          Mijozlar bilan Yozishmalar Shablonlari (Direct & Telegram)
                        </div>
                        <div className="text-[11px] text-slate-500">350 KB • Tayyor skriptlar</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert("Skriptlar shabloni yuklab olindi!")}
                      className="px-3.5 py-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-faberlic-700 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Yuklab olish
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Lessons List & Course Overview (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Lessons Outline Card */}
            <div className="bg-white rounded-3xl border border-rose-100 p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <div>
                  <h4 className="font-serif font-black text-slate-900 text-base">
                    Kurs Darslari
                  </h4>
                  <p className="text-xs text-slate-500">
                    Jami: {currentCourse.lessons.length} ta mavzu
                  </p>
                </div>

                <span className="text-xs font-bold text-faberlic-700 bg-rose-50 px-2.5 py-1 rounded-full">
                  {currentCourse.lessons.filter(l => userCompletedLessons.includes(l.id)).length} / {currentCourse.lessons.length}
                </span>
              </div>

              {/* Lesson items list */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {currentCourse.lessons.map((lesson) => {
                  const isCur = lesson.id === activeLesson.id;
                  const isDone = userCompletedLessons.includes(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => setActiveLessonId(lesson.id)}
                      className={`p-3.5 rounded-2xl cursor-pointer transition flex items-start gap-3 border ${
                        isCur
                          ? 'bg-rose-50 border-faberlic-600 shadow-sm'
                          : isDone
                          ? 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50/70'
                          : 'bg-white border-slate-100 hover:border-rose-200'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : isCur ? (
                          <div className="w-5 h-5 rounded-full bg-faberlic-600 text-white text-[11px] font-bold flex items-center justify-center">
                            {lesson.number}
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold leading-snug line-clamp-2 ${
                          isCur ? 'text-faberlic-900' : 'text-slate-800'
                        }`}>
                          {lesson.number}-Dars: {lesson.title}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                          <span>{lesson.duration}</span>
                          <span>•</span>
                          <span className={isDone ? 'text-emerald-700 font-bold' : ''}>
                            {isDone ? 'O\'zlashtirildi' : 'Ko\'rilmagan'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Call to take exam shortcut */}
              <div className="pt-2 border-t border-rose-100">
                <button
                  onClick={onOpenExam}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>Yakuniy Imtihon & Sertifikat</span>
                </button>
              </div>

            </div>

            {/* Mentor info card */}
            <div className="bg-gradient-to-br from-rose-50 to-white p-5 rounded-3xl border border-rose-200/80 shadow-md space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src={currentCourse.instructor.image} 
                  alt={currentCourse.instructor.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" 
                />
                <div>
                  <div className="text-xs font-extrabold uppercase text-faberlic-700">Dars Mentori</div>
                  <div className="text-sm font-bold text-slate-900">{currentCourse.instructor.name}</div>
                  <div className="text-[11px] text-slate-600">{currentCourse.instructor.role}</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Aziz qizlar va ayollar, ushbu bilimlarni har kuni amalda qo'llasangiz, 2-3 oyda hayotingiz va daromadingiz butunlay o'zgaradi!"
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
