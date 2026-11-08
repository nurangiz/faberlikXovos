import React, { useState, useEffect } from 'react';
import { getStoredCourses } from '../utils/coursesStorage';
import { BookOpen, Clock, Award, Sparkles, CheckCircle, ArrowRight, Play, UserCheck, Flame } from 'lucide-react';

export default function CoursesSection({ onSelectCourse, userCompletedLessons }) {
  const [courses, setCourses] = useState(() => getStoredCourses());
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const handleUpdate = () => {
      setCourses(getStoredCourses());
    };
    window.addEventListener('courses_updated', handleUpdate);
    return () => window.removeEventListener('courses_updated', handleUpdate);
  }, []);

  const categories = [
    { id: 'all', label: 'Barcha Kurslar' },
    { id: 'biznes-boshlash', label: 'Faberlic Biznes' },
    { id: 'kosmetologiya-parvarish', label: 'Kosmetologiya & Vizaj' },
    { id: 'smm-mobilografiya', label: 'SMM & Instagram' },
    { id: 'sotuv-psixologiyasi', label: 'Sotuv Psixologiyasi' },
  ];

  const filteredCourses = filter === 'all' 
    ? courses 
    : courses.filter(c => c.id === filter);

  return (
    <section className="py-16 bg-white border-t border-rose-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-faberlic-700 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-faberlic-600" />
            <span>Ta'lim Yo'nalishlari</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900">
            Noldan Mutaxassislikkacha Maxsus Kurslar
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Zamonaviy interaktiv metodika asosida tuzilgan: har bir darsda qisqa video, konspekt va amaliy test mavjud.
          </p>
        </div>

        {/* Categories Tab bar */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                filter === cat.id
                  ? 'bg-faberlic-700 text-white shadow-md shadow-faberlic-700/20'
                  : 'bg-rose-50/70 text-slate-600 hover:bg-rose-100 hover:text-faberlic-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCourses.map((course) => {
            // Calculate course completion
            const totalLessons = course.lessons.length;
            const completedInThisCourse = course.lessons.filter(l => 
              userCompletedLessons.includes(l.id)
            ).length;
            const progressPercent = Math.round((completedInThisCourse / totalLessons) * 100);

            return (
              <div 
                key={course.id}
                className="bg-white rounded-3xl border border-rose-100/90 shadow-lg hover:shadow-xl hover:border-rose-200 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Card Header with gradient banner */}
                  <div className={`p-6 bg-gradient-to-r ${course.color} text-white relative`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wide">
                        {course.badge}
                      </span>
                      <span className="text-xs font-semibold bg-black/20 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="font-serif font-black text-xl sm:text-2xl text-white group-hover:translate-x-0.5 transition-transform">
                      {course.title}
                    </h3>
                    
                    <p className="mt-2 text-xs sm:text-sm text-white/90 line-clamp-2">
                      {course.shortDesc}
                    </p>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    {/* Meta info */}
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-faberlic-600" />
                        <span>{course.lessonsCount} ta video dars</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <Award className="w-4 h-4" />
                        <span>Sertifikatli</span>
                      </div>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-3">
                      <img 
                        src={course.instructor.image} 
                        alt={course.instructor.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-rose-200" 
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {course.instructor.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {course.instructor.role}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600">O'zlashtirish:</span>
                        <span className="text-faberlic-700">{progressPercent}% ({completedInThisCourse}/{totalLessons})</span>
                      </div>
                      <div className="w-full h-2.5 bg-rose-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-faberlic-600 to-rose-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectCourse(course.id)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-faberlic-700 text-faberlic-700 hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 group-hover:bg-faberlic-700 group-hover:text-white shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{progressPercent > 0 ? "Darslarni Davom Ettirish" : "Kursni Boshlash (Bepul)"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
