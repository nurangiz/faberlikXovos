// Storage for dynamic Certification Exam questions
import { broadcastEvent } from './cloudSync';

const EXAM_STORAGE_KEY = 'faberlic_academy_exam_questions';

export const DEFAULT_EXAM_QUESTIONS = [
  {
    id: 1,
    question: "Faberlic kompaniyasiga a'zo bo'lgach, mahsulotlarga qancha chegirma (keshbek) beriladi?",
    options: ["10%", "15%", "20% dan 26% gacha", "50%"],
    correctIndex: 2,
    explanation: "Faberlicda barcha yangi a'zolar uchun 20% dan 26% gacha chegirma (keshbek) taqdim etiladi."
  },
  {
    id: 2,
    question: "Faberlic kislorodli kosmetikasining asosiy patentlangan formulasi qaysi?",
    options: ["Novaftem-O2 va Aquaftem", "Faberlic Gold", "Collagen Plus", "Vitamin C Complex"],
    correctIndex: 0,
    explanation: "Novaftem-O2 terining chuqur qatlamlariga kislorod yetkazib beruvchi noyob patentlangan kompleksdir."
  },
  {
    id: 3,
    question: "Faberlicda 'Direktor' maqomiga chiqish uchun jamoaviy qancha ball to'plash lozim?",
    options: ["1000 ball", "2000 ball", "3000 ball", "5000 ball"],
    correctIndex: 2,
    explanation: "3000 guruh balli (OG) to'planganda Direktor unvoni ochiladi."
  },
  {
    id: 4,
    question: "Direktor unvoni tasdiqlanganda qancha miqdorda bir martalik malaka bonusi to'lanadi?",
    options: ["5,000,000 so'm", "10,000,000 so'm", "15,000,000 so'm", "19,000,000 so'm"],
    correctIndex: 3,
    explanation: "O'zbekistonda Direktorlik unvoni uchun 19,000,000 so'm bir martalik malaka mukofoti beriladi."
  },
  {
    id: 5,
    question: "Yuz terisini to'g'ri parvarishlashning ikkinchi muhim bosqichi qaysi?",
    options: ["Krem surtish", "Skrab qilish", "Tonizatsiyalash (Tonik)", "Niqob qo'yish"],
    correctIndex: 2,
    explanation: "Yuvinishdan (tozalashdan) so'ng albatta teri pH muvozanatini tiklash uchun tonik ishlatiladi."
  },
  {
    id: 6,
    question: "T-zona (peshana, burun, iyak) yog'li, yanoqlar esa quruq bo'lsa, bu qanday teri turi?",
    options: ["Quruq teri", "Yog'li teri", "Aralash (Kombinatsiyalashgan) teri", "Normal teri"],
    correctIndex: 2,
    explanation: "T-zonasi yog'li va yanoqlari quruq yoki normal bo'lgan teri turi kombinatsiyalashgan teri deyiladi."
  },
  {
    id: 7,
    question: "Mijoz 'Mahsulot qimmat ekan' desa, eng to'g'ri javob qaysi?",
    options: ["Qimmat bo'lsa olmang deyish", "Mahsulotning sifatini, tejamkorligi va beradigan natijasini tushuntirish", "Xafa bo'lib indamay ketish", "Darhol 50% arzonga berish"],
    correctIndex: 1,
    explanation: "E'tiroz bilan ishlashda mahsulotning foydasi, fransuz xomashyosi va uzoqqa yetishi tushuntiriladi."
  },
  {
    id: 8,
    question: "Parfyum iforini xushbo'y saqlash uchun qaysi nuqtalarga sepish tavsiya etiladi?",
    options: ["Kiyimlarning ustiga", "Puls uradigan qon tomirlar joylashgan joylarga (bilak, bo'yin)", "Soch uchlariga", "Faqat havoga"],
    correctIndex: 1,
    explanation: "Puls urib turadigan nuqtalarda tana harorati yuqori bo'lib, atir ifori uzoq va chiroyli taraladi."
  },
  {
    id: 9,
    question: "Faberlicda yangi a'zolarni jalb qilish (rekruting) nima beradi?",
    options: ["Jamoa hajmi kengayadi va foizli daromad oshadi", "Faqat bir marta ball beradi", "Hech qanday foydasi yo'q", "Faqat katalog sovg'a qilinadi"],
    correctIndex: 0,
    explanation: "Rekruting jamoaviy tovar aylanmasini oshiradi va oylik barqaror katta daromad manbaini yaratadi."
  },
  {
    id: 10,
    question: "Faberlicda farzand ko'rgan yetakchi ayollarga qanday maxsus bonus beriladi?",
    options: ["Onalik bonusi (Materinskiy bonus)", "Sayohat bonusi", "Mashina bonusi", "Uy bonusi"],
    correctIndex: 0,
    explanation: "Faberlic ayollarni qo'llab-quvvatlash uchun yosh onalarga har bir katalogda Onalik bonusini to'lab beradi."
  }
];

export function getStoredExamQuestions() {
  try {
    const raw = localStorage.getItem(EXAM_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(DEFAULT_EXAM_QUESTIONS));
      return DEFAULT_EXAM_QUESTIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_EXAM_QUESTIONS;
  } catch (e) {
    return DEFAULT_EXAM_QUESTIONS;
  }
}

export function saveStoredExamQuestions(questions) {
  try {
    localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(questions));
    window.dispatchEvent(new Event('exam_questions_updated'));
    broadcastEvent({ type: 'EXAM_QUESTIONS_UPDATED', questions });
  } catch (e) {
    console.error("Save exam questions error:", e);
  }
}

export function resetStoredExamQuestions() {
  saveStoredExamQuestions(DEFAULT_EXAM_QUESTIONS);
  return DEFAULT_EXAM_QUESTIONS;
}
