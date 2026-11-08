import React, { useState, useRef, useEffect } from 'react';
import { getStoredExamQuestions } from '../utils/examStorage';
import { Award, CheckCircle2, XCircle, Download, Printer, Sparkles, ShieldCheck, QrCode, Search } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function CertificateExam({ user, certificates, onExamCompleted, onOpenVerifyWithId }) {
  const [questions, setQuestions] = useState(() => getStoredExamQuestions());
  const [studentName, setStudentName] = useState(user?.name || '');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(certificates && certificates.length > 0);
  const [score, setScore] = useState(certificates?.[0]?.score || 0);
  const [certificateId, setCertificateId] = useState(
    certificates?.[0]?.certificate_id || `FL-UZ-2026-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [error, setError] = useState(null);

  const certRef = useRef(null);

  useEffect(() => {
    const handleQuestionsUpdate = () => {
      setQuestions(getStoredExamQuestions());
    };
    window.addEventListener('exam_questions_updated', handleQuestionsUpdate);
    return () => window.removeEventListener('exam_questions_updated', handleQuestionsUpdate);
  }, []);

  useEffect(() => {
    if (user?.name && !studentName) {
      setStudentName(user.name);
    }
    if (certificates && certificates.length > 0) {
      setCertificateId(certificates[0].certificate_id);
      setScore(certificates[0].score);
      setExamSubmitted(true);
    }
  }, [user, certificates]);

  const handleSelectAnswer = (qId, optionIdx) => {
    if (examSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [qId]: optionIdx
    });
  };

  const handleSubmitExam = async () => {
    setError(null);
    setLoading(true);

    try {
      // Call real backend endpoint
      const result = await api.submitExam(selectedAnswers, studentName);
      
      setScore(result.score);
      setExamSubmitted(true);

      if (result.passed) {
        setCertificateId(result.certificateId);
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.5 }
        });
      }

      onExamCompleted(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = () => {
    // Generate high resolution Canvas PNG
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1100);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(1, '#fff1f4');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1600, 1100);

    // Decorative Borders
    ctx.strokeStyle = '#cf102d';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1540, 1040);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, 1504, 1004);

    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 58, 1484, 984);

    // Watermark / Crest
    ctx.save();
    ctx.fillStyle = 'rgba(207, 16, 45, 0.03)';
    ctx.beginPath();
    ctx.arc(800, 550, 280, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Header Text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#9f1239';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText("O'ZBEKISTON FABERLIC AYOLLAR VA QIZLAR AKADEMIYASI", 800, 130);

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText("FABERLIC AYOLLAR VA QIZLAR AKADEMIYASI METODIKASI ASOSIDA", 800, 165);

    // Certificate Title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 64px Georgia, serif';
    ctx.fillText("SERTIFIKAT", 800, 270);

    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 22px Georgia, serif';
    ctx.fillText("Ushbu rasmiy hujjat quyidagi o'quvchiga taqdim etiladi:", 800, 330);

    // Student Name
    ctx.fillStyle = '#cf102d';
    ctx.font = 'bold 52px Georgia, serif';
    ctx.fillText(studentName.toUpperCase(), 800, 420);

    // Divider line
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(400, 450);
    ctx.lineTo(1200, 450);
    ctx.stroke();

    // Qualification description
    ctx.fillStyle = '#334155';
    ctx.font = '22px sans-serif';
    ctx.fillText("Faberlic Biznes Boshlash, Kosmetologik Parvarish, SMM va Sotuv Psixologiyasi", 800, 520);
    ctx.fillText("bo'yicha barcha o'quv modullarini to'liq o'zlashtirib, yakuniy imtihonni a'lo baholarga", 800, 560);
    ctx.fillText("topshirgani uchun ushbu unvon bilan taqdirlanadi:", 800, 600);

    // Title Award
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.fillText("« FABERLIC SERTIFIKATLANGAN BIZNES VA GO'ZALLIK MUTAXASSISI »", 800, 670);

    // Footer items: ID, Date, Stamp, Signature
    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`Sertifikat ID: ${certificateId}`, 120, 830);
    ctx.fillText(`Berilgan sana: ${new Date().toLocaleDateString('uz-UZ')}`, 120, 865);
    ctx.fillText(`Holati: Rasmiy Tasdiqlangan (Online DB Verified)`, 120, 900);

    // Stamp circle on right
    ctx.textAlign = 'center';
    ctx.save();
    ctx.strokeStyle = '#cf102d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(1350, 850, 75, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#cf102d';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText("FABERLIC UZBEKISTAN", 1350, 830);
    ctx.fillText("LIDERLAR KENGASHI", 1350, 850);
    ctx.fillText("★ RASMIY MUHR ★", 1350, 875);
    ctx.restore();

    // Trigger download
    const link = document.createElement('a');
    link.download = `Faberlic_Sertifikat_${studentName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const passed = score >= 80;

  return (
    <section className="py-16 bg-white border-t border-rose-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Yakuniy Attestatsiya va Sertifikat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900">
            Faberlic Akademiyasi Rasmiy Sertifikati
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            10 ta savoldan iborat imtihondan kamida 80% to'plang va davlat bazasida tasdiqlangan QR-kodli rasmiy sertifikatni qo'lga kiriting!
          </p>
        </div>

        {/* Name input */}
        <div className="bg-rose-50/70 p-6 rounded-3xl border border-rose-200/80 mb-8 max-w-xl mx-auto space-y-3">
          <label className="block text-xs font-extrabold uppercase text-faberlic-800 tracking-wider">
            Sertifikatda Ko'rinadigan To'liq Ism-Sharifingiz:
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Masalan: Nilufar Karimova"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-rose-200 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Diqqat: Ushbu ism ma'lumotlar bazasiga yoziladi va sertifikatda rasmiy tasdiqlanadi.
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium text-center max-w-xl mx-auto">
            {error}
          </div>
        )}

        {/* Certificate Display if Passed */}
        {examSubmitted && passed ? (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            
            {/* Success Announcement */}
            <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-3xl text-center space-y-2 max-w-2xl mx-auto">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-black text-xl text-emerald-950">
                Tabriklaymiz, {studentName}!
              </h3>
              <p className="text-sm text-emerald-800 font-medium">
                Siz imtihonni <strong>{score}%</strong> natija bilan muvaffaqiyatli topshirdingiz! Sertifikatingiz rasmiy bazaga kiritildi:
              </p>
            </div>

            {/* Certificate View */}
            <div 
              ref={certRef}
              className="relative bg-[#FFFDFE] p-8 sm:p-12 rounded-3xl shadow-2xl certificate-border max-w-4xl mx-auto text-center space-y-6 overflow-hidden"
            >
              {/* Background watermark badge */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <div className="w-96 h-96 rounded-full border-8 border-faberlic-700 flex items-center justify-center">
                  <span className="font-serif font-black text-9xl text-faberlic-700">FL</span>
                </div>
              </div>

              {/* Certificate Top Header */}
              <div className="relative z-10 space-y-1">
                <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-faberlic-800">
                  O'ZBEKISTON FABERLIC AYOLLAR VA QIZLAR AKADEMIYASI
                </div>
                <div className="text-[11px] font-bold text-amber-700 tracking-wider">
                  FABERLIC BIZNES VA GO'ZALLIK AKADEMIYASI FORMATIDA
                </div>
              </div>

              {/* Main Certificate Title */}
              <div className="relative z-10 py-2">
                <h1 className="font-serif font-black text-4xl sm:text-6xl text-slate-900 tracking-tight">
                  SERTIFIKAT
                </h1>
                <p className="text-xs sm:text-sm italic text-slate-500 font-serif mt-2">
                  Ushbu rasmiy sertifikat quyidagi bitiruvchiga taqdim etiladi:
                </p>
              </div>

              {/* Student Name */}
              <div className="relative z-10 py-2">
                <div className="text-2xl sm:text-4xl font-serif font-black text-faberlic-700 uppercase tracking-wide border-b-2 border-rose-300 pb-2 inline-block max-w-xl">
                  {studentName}
                </div>
              </div>

              {/* Text Body */}
              <div className="relative z-10 max-w-2xl mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                <p>
                  Faberlic Biznes Boshlash, Kosmetologik Parvarish, SMM va Sotuv Psixologiyasi bo'yicha barcha modullarni muvaffaqiyatli tamomlagani va yakuniy attestatsiyadan a'lo baholarga o'tgani uchun:
                </p>
                <div className="font-serif font-bold text-sm sm:text-lg text-amber-800 pt-1">
                  « FABERLIC SERTIFIKATLANGAN BIZNES VA GO'ZALLIK MUTAXASSISI »
                </div>
                <p className="text-[11px] text-slate-500">
                  unvoni bilan taqdirlanadi va Faberlic hamjamiyatining rasmiy bitiruvchisi deb e'tirof etiladi.
                </p>
              </div>

              {/* Footer row: ID, QR code, Official Stamp */}
              <div className="relative z-10 pt-6 border-t border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
                
                {/* Meta ID */}
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-slate-800">
                    Sertifikat ID: <span className="font-mono text-faberlic-700">{certificateId}</span>
                  </div>
                  <div className="text-slate-500">
                    Sana: {new Date().toLocaleDateString('uz-UZ')}
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" /> Rasmiy tasdiqlangan (DB Verified)
                  </div>
                </div>

                {/* QR Code / Verify link button */}
                <button
                  type="button"
                  onClick={() => onOpenVerifyWithId(certificateId)}
                  className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-rose-200 shadow-xs hover:border-amber-400 hover:bg-amber-50/50 transition cursor-pointer text-left"
                >
                  <QrCode className="w-10 h-10 text-slate-800 shrink-0" />
                  <div className="text-[10px] text-slate-600 leading-tight">
                    <strong className="text-slate-900 block font-bold">Tekshiruv kodi</strong>
                    Bazada tekshirish uchun bosing
                  </div>
                </button>

                {/* Stamp */}
                <div className="w-24 h-24 rounded-full border-4 border-dashed border-faberlic-700/60 p-1 flex items-center justify-center text-center rotate-[-8deg]">
                  <div className="w-full h-full rounded-full bg-faberlic-50 flex flex-col items-center justify-center text-faberlic-800 text-[9px] font-black leading-tight">
                    <span>FABERLIC UZ</span>
                    <span>★ ★ ★</span>
                    <span>LIDERLAR</span>
                    <span>MUHRI</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Action Buttons to Download / Print / Verify */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={handleDownloadCertificate}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-faberlic-700 to-rose-600 hover:from-faberlic-800 hover:to-rose-700 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition"
              >
                <Download className="w-5 h-5" />
                <span>Sertifikatni Yuklab Olish (PNG Rasm)</span>
              </button>

              <button
                onClick={() => onOpenVerifyWithId(certificateId)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition"
              >
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>Bazada Tekshirish</span>
              </button>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-5 h-5 text-slate-600" />
                <span>Chop Etish</span>
              </button>

              <button
                onClick={() => {
                  setExamSubmitted(false);
                  setSelectedAnswers({});
                }}
                className="text-xs font-bold text-slate-500 hover:text-faberlic-700 underline"
              >
                Qayta Topshirish
              </button>
            </div>

          </div>
        ) : (
          /* Exam Form */
          <div className="space-y-8">
            
            {examSubmitted && !passed && (
              <div className="bg-rose-50 border border-rose-300 p-6 rounded-3xl text-center space-y-2 max-w-xl mx-auto">
                <div className="w-10 h-10 bg-rose-100 text-faberlic-700 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  Natijangiz: {score}% (O'tish bali: 80%)
                </h4>
                <p className="text-xs text-slate-600">
                  Xavotir olmang! Darslarni qayta ko'rib chiqib, istalgan paytda qayta urinib ko'rishingiz mumkin.
                </p>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-rose-100 shadow-xl p-6 sm:p-8 space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-700">
                  Savollar: {questions.length} ta
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                  Minimal talab: 80% (8 ta to'g'ri javob)
                </span>
              </div>

              {/* Questions list */}
              <div className="space-y-8">
                {questions.map((q, idx) => (
                  <div key={q.id} className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {idx + 1}. {q.question}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((option, optIdx) => {
                        const isSelected = selectedAnswers[q.id] === optIdx;
                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-medium cursor-pointer transition flex items-center justify-between ${
                              isSelected
                                ? 'bg-rose-50 border-faberlic-600 text-faberlic-900 font-bold shadow-xs'
                                : 'bg-slate-50/60 border-slate-200 hover:border-rose-200 hover:bg-white text-slate-700'
                            }`}
                          >
                            <span>{option}</span>
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                              isSelected ? 'border-faberlic-600 bg-faberlic-600 text-white' : 'border-slate-300'
                            }`}>
                              {isSelected ? '✓' : ''}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 text-center">
                <button
                  onClick={handleSubmitExam}
                  disabled={loading || Object.keys(selectedAnswers).length < questions.length}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-faberlic-700 to-rose-600 hover:from-faberlic-800 hover:to-rose-700 text-white font-bold text-sm shadow-xl shadow-faberlic-600/20 disabled:opacity-50 transition"
                >
                  {loading ? "Tekshirilmoqda..." : "Imtihonni Yakunlash va Sertifikat Olish"}
                </button>
                <p className="text-[11px] text-slate-400 mt-2">
                  Barcha savollarga javob belgilangandan keyin tugma faollashadi.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
