export const COURSES = [
  {
    id: "biznes-boshlash",
    title: "Faberlic Biznes Boshlash: Noldan Direktorlikkacha",
    badge: "Eng ommabop",
    level: "Boshlang'ich",
    duration: "4 soat 30 daqiqa",
    lessonsCount: 6,
    color: "from-rose-500 to-pink-600",
    icon: "TrendingUp",
    shortDesc: "Kompaniya imkoniyatlari, 20-26% keshbek, shaxsiy va guruh ballarini yig'ish, birinchi daromadga chiqish sirlari.",
    instructor: {
      name: "Zulayho Qosimova",
      role: "Faberlic Oltin Direktori (Top-10 Lider)",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
    },
    lessons: [
      {
        id: "l1-1",
        number: 1,
        title: "Faberlic olamiga xush kelibsiz: Kompaniya va Imkoniyatlar",
        duration: "18 daqiqa",
        videoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Fallback simulated or playable
        overview: "Faberlic xalqaro kompaniyasi, kislorodli kosmetika patenti, O'zbekistondagi faoliyat va maslahatchi uchun beriladigan barcha imtiyozlar bilan tanishuv.",
        notes: `
### 1. Faberlic kompaniyasi nima uchun o'zgacha?
Faberlic — dunyodagi eng yirik to'g'ridan-to'g'ri sotuv kompaniyalaridan biri bo'lib, o'zining shaxsiy ilmiy laboratoriyasi va ishlab chiqarish zavodlariga ega. Eng asosiysi:
- **Kislorod kompleksi (Novaftem-O2 va Aquaftem)**: Butun dunyoda patentlangan yagona texnologiya bo'lib, terining chuqur qatlamlariga sof kislorod va ozuqa moddalarni yetkazib beradi.
- **Har bir oila uchun 1000 dan ortiq assortiment**: Faqat kosmetika emas, balki ekologik toza uy-ro'zg'or vositalari, kiyim-kechak, salomatlik (wellness) mahsulotlari.

### 2. Sizni qanday imkoniyatlar kutmoqda?
1. **Shaxsiy chegirma (20% - 26%)**: Ro'yxatdan o'tganingiz zahoti 20% arzonroq olasiz. Har katalogda 50 ball bajarsangiz — 26% lik doimiy chegirmaga ega bo'lasiz.
2. **Keshbek va sovg'alar**: Yangi kelgan har bir ayol-qizimiz uchun 6 davr davom etadigan qimmatbaho to'plamlar (Start dasturi).
3. **Cheksiz daromad va bonuslar**: Guruh tuzish orqali 3% dan 23% gacha ulgurji foyda va har bir yangi unvon uchun millionlab so'mlik mukofotlar.
        `,
        actionSteps: [
          "Faberlic ilovasini telefoningizga o'rnating va shaxsiy kabinetingizga kiring.",
          "Oxirgi joriy katalog bilan tanishib, o'zingizga yoqqan 3 ta mahsulotni tanlang.",
          "Dars yakunidagi testni yechib, darsni tugatildi deb belgilang."
        ],
        quiz: [
          {
            question: "Faberlic maslahatchisi 50 ball bajarganda mahsulotlarga qancha foiz chegirma oladi?",
            options: ["10%", "15%", "20%", "26%"],
            correctAnswer: 3,
            explanation: "To'g'ri javob: 50 ball shaxsiy hajm bajargan maslahatchiga keyingi katalogdan boshlab 26% chegirma beriladi!"
          },
          {
            question: "Faberlic kosmetikasining jahon bo'ylab eng mashhur patentlangan kashfiyoti nima?",
            options: ["Kislorod kompleksi (Novaftem)", "Oltin changi", "Shakar ekstrakti", "Kollagen plastinkasi"],
            correctAnswer: 0,
            explanation: "Faberlic kislorodli kosmetika bo'yicha dunyodagi yagona patent egasidir."
          }
        ]
      },
      {
        id: "l1-2",
        number: 2,
        title: "Katalog bilan ishlash va 100 ball shaxsiy hajm sirlari",
        duration: "25 daqiqa",
        overview: "Hech kimga majburlamasdan, qulay va madaniyatli tarzda shaxsiy 100 ball (LO) yig'ishning 5 ta oltin texnikasi.",
        notes: `
### 100 ball yig'ish nima uchun foydali?
- Siz **VIP-maslahatchi** maqomini olasiz.
- Kompaniya rasmiy saytidan sizning hududingizdan ro'yxatdan o'tgan yangi mijozlarni avtomatik tarzda sizning guruhigizga bepul yozib beradi!
- Katalogdagi istalgan 1 ta eng qimmat mahsulotga 70% maxsus chegirma beriladi.

### Qanday qilib 100 ball qilish mumkin?
1. **Shaxsiy iste'mol (20-30 ball)**: Uyda ishlatadigan kir yuvish geli, idish yuvish vositasi, shampun, tish pastasi va sovunlarni Faberlicga almashtirish.
2. **"Yaqinlarim — mening do'konimda" usuli (30 ball)**: Ona, opa-singil, xolalar va dugonalarga katalogdagi super aksiyalarni tavsiya qilish.
3. **Katalog savati usuli (40 ball)**: Ish joyi, qo'shnilar va bolalar bog'chasidagi onaxonlarga xushbo'y parfyum testerlarini ko'rsatish.
        `,
        actionSteps: [
          "O'z uyingizdagi tugab borayotgan ro'zg'or mahsulotlari ro'yxatini tuzing.",
          "5 nafar eng yaqin dugonangizga Faberlicning yangi katalogidan eng yaxshi aksiyani ulashing.",
          "Katalogdagi eng ko'p ball beradigan mahsulotlarni belgilab chiqing."
        ],
        quiz: [
          {
            question: "VIP-maslahatchi (100 ball bajargan) qanday ustunlikka ega bo'ladi?",
            options: [
              "Faqat tabriknoma oladi",
              "Kompaniya saytidan yangi odamlarni uning guruhiga bepul biriktiradi va 70% chegirma beradi",
              "Hech qanday farqi yo'q",
              "Faqat 10 ball qo'shiladi"
            ],
            correctAnswer: 1,
            explanation: "100 ball qilgan VIP maslahatchilarga kompaniya tizimi yangi ro'yxatdan o'tgan mijozlarni avtomatik yo'naltiradi!"
          }
        ]
      },
      {
        id: "l1-3",
        number: 3,
        title: "Marketing Rejasi: 3% dan 23% gacha pog'onalar va oylik daromad",
        duration: "32 daqiqa",
        overview: "Faberlicda qanday qilib barqaror oylik daromadga chiqish mumkin? Guruh ballari, foizlar va har bir bosqichdagi aniq hisob-kitoblar.",
        notes: `
### Faberlic Pog'onalari Jadvali:
- **100 ball (3%)** — Maslahatchi (Consultant)
- **200 ball (6%)** — Katta maslahatchi (Senior Consultant)
- **600 ball (9%)** — Yetakchi (Leader)
- **1000 ball (12%)** — Katta yetakchi (Senior Leader)
- **1500 ball (15%)** — Vitse-direktor (Vice Director)
- **2000 ball (19%)** — Katta vitse-direktor (Senior Vice Director)
- **3000 ball (23%)** — KANDIDAT / DIREKTOR! (Oylik o'rtacha 5,000,000 - 10,000,000+ so'm daromad)

### Hisoblash formulasi:
Guruh balli × Foiz pog'onasi × Ballning hisoblash qiymati = Sizning sof daromadingiz!
        `,
        actionSteps: [
          "O'zingiz uchun 3 oylik maqsad belgilang (masalan: 12% yoki 15% daraja).",
          "Saytdagi 'Daromad Kalkulyatori' yordamida oylik daromadingizni hisoblang.",
          "Jamoangizga qo'shilishi mumkin bo'lgan 10 kishilik nomzodlar ro'yxatini daftarga yozing."
        ],
        quiz: [
          {
            question: "Faberlicda Direktorlik darajasiga chiqish uchun jamoa bilan necha ball to'plash kerak?",
            options: ["1000 ball", "1500 ball", "2000 ball", "3000 ball"],
            correctAnswer: 3,
            explanation: "3000 ball va undan yuqori guruh hajmi 23% Direktorlik unvonini beradi."
          }
        ]
      },
      {
        id: "l1-4",
        number: 4,
        title: "Start Dasturi va Yangi A'zolar uchun Hadyalar",
        duration: "20 daqiqa",
        overview: "Yangi ro'yxatdan o'tgan maslahatchilarga beriladigan 6 bosqichli hadyalar tizimi va undan maksimal foyda olish.",
        notes: `
### Start Dasturi nima?
Kompaniyaga a'zo bo'lganingizdan boshlab, ketma-ket har katalogda belgilangan summadagi buyurtma joylab borganingizda, Faberlic sizga eng qimmat elita kosmetika va parfyumeriya to'plamlarini ramziy arzon narxda (atigi 20,000-30,000 so'mga) tuhfa qiladi.
To'plamlarning asl qiymati esa 300,000 - 600,000 so'mgacha yetadi!
        `,
        actionSteps: [
          "Joriy katalogning 1-qadam hadyasini ko'rib chiqing.",
          "Shaxsiy kabinetingizda 'Start dasturi' bo'limi holatini tekshiring."
        ],
        quiz: [
          {
            question: "Start dasturi sovg'alarini olish uchun asosiy talab nima?",
            options: [
              "Faqat dars ko'rish",
              "Har katalog davrida belgilangan minimal buyurtmani uzluksiz bajarish",
              "Hech qanday buyurtma bermaslik",
              "Kompaniya ofisiga har kuni borish"
            ],
            correctAnswer: 1,
            explanation: "Uzluksiz ravishda har katalogda belgilangan hajmda buyurtma berib borish orqali 6 qadamning barchasini qo'lga kiritasiz."
          }
        ]
      },
      {
        id: "l1-5",
        number: 5,
        title: "Guruh shakllantirish: O'z jamoangizni qanday yig'asiz?",
        duration: "28 daqiqa",
        overview: "Yolg'iz o'zingiz emas, o'zingiz kabi intiluvchan qizlar va ayollardan iborat kuchli biznes guruh tuzish strategiyasi.",
        notes: `
### Jamoa tuzishning 3 ta ustuni:
1. **Issiq doira**: Dugonalar, sinfdoshlar, qarindoshlar, qo'shnilar. Ularni sifatli mahsulotni arzon olishga yoki qo'shimcha daromad topishga chaqirasiz.
2. **Ijtimoiy tarmoqlar**: Instagram, Telegram, TikTok orqali o'z o'rganayotgan bilimlaringizni ulashish.
3. **Tavsiyalar**: Sizdan mahsulot olgan mijozdan 'Ushbu imkoniyat qaysi dugonangizga qiziq bo'lishi mumkin?' deb so'rash.
        `,
        actionSteps: [
          "20 ta tanishingiz ismini va telefon raqamini daftarga yozing.",
          "Har kuni 3 kishiga yoqimli xabar orqali platformamizdagi bepul darslarni tavsiya qiling."
        ],
        quiz: [
          {
            question: "Tarmoqda eng tez va ishonchli natija beruvchi jamoa a'zolari kimlar?",
            options: [
              "Tasodifiy begona odamlar",
              "Issiq doiradagi yaqinlar va samimiy muloqot o'rnatilgan insonlar",
              "Reklamadagi spam xabarlar",
              "Faqat chet elliklar"
            ],
            correctAnswer: 1,
            explanation: "Samimiy ishonch va do'stona munosabat bo'lgan insonlar bilan kuchli jamoa qurish ancha oson va mustahkam bo'ladi."
          }
        ]
      },
      {
        id: "l1-6",
        number: 6,
        title: "Direktorlik va Undan Yuqori Unvonlar Bonusi",
        duration: "27 daqiqa",
        overview: "Bir martalik 19,000,000 so'mlik Direktorlik bonusi, sayohat vaucherlari, Onalik bonusi va xalqaro konferensiyalar.",
        notes: `
### Direktor bo'lganda nimalar beriladi?
1. **19,000,000 so'm** bir martalik kvalifikatsiya bonusi.
2. **Onalik bonusi**: Direktorlik maqomida bola dunyoga keltirgan ayollarga kompaniya har katalog qo'shimcha rag'batlantiruvchi yordam puli to'laydi.
3. **Dubay, Turkiya, Fransiya sayohatlari**: Har yili o'tkaziladigan xalqaro liderlar sayohati bepul beriladi.
4. **Har 21 kunda kafolatlangan oylik daromad**.
        `,
        actionSteps: [
          "O'z orzular doskasi (Vision board)ni yarating.",
          "1-kursni to'liq yakunlab, 'Kosmetologiya' va 'SMM' kurslariga o'ting."
        ],
        quiz: [
          {
            question: "Faberlicda yangi Direktor unvonini tasdiqlagan liderga bir martalik qancha mukofot puli beriladi?",
            options: ["1,000,000 so'm", "5,000,000 so'm", "10,000,000 so'm", "19,000,000 so'm (Kvalifikatsiya bonusi)"],
            correctAnswer: 3,
            explanation: "Direktorlik unvoni tasdiqlanganda kompaniya 19 mln so'm bir martalik sof mukofot pulini to'lab beradi."
          }
        ]
      }
    ]
  },
  {
    id: "kosmetologiya-parvarish",
    title: "Go'zallik va Teri Parvarishi San'ati (Kosmetologiya)",
    badge: "Ayollar uchun maxsus",
    level: "Barcha bosqichlar",
    duration: "3 soat 45 daqiqa",
    lessonsCount: 4,
    color: "from-pink-500 to-rose-400",
    icon: "Sparkles",
    shortDesc: "Teri turlarini aniqlash, 4 bosqichli parvarish, Faberlic kislorodli kosmetikasi va mijozga individual yechim tanlash.",
    instructor: {
      name: "Dildora Alimova",
      role: "Diplomli Kosmetolog & Faberlic Eksperti",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300"
    },
    lessons: [
      {
        id: "l2-1",
        number: 1,
        title: "Teri turlarini to'g'ri aniqlash (Quruq, Yog'li, Kombinatsiyalashgan)",
        duration: "22 daqiqa",
        overview: "Mijozga to'g'ri krem tavsiya qilish uchun uning teri tipini aniqlash va xatolarning oldini olish.",
        notes: `
### Teri turlari:
1. **Quruq teri**: Yupqa, mayda teshikchalar, tez tortishadi, sovuqda qizaradi va qipiqlanadi. (Tavsiya: Oziqlantiruvchi va namlantiruvchi seriyalar).
2. **Yog'li teri**: Yaltirash, kengaygan teshikchalar, toshmalarga moyillik. (Tavsiya: Sebum nazorati, yengil teksturalar).
3. **Kombinatsiyalashgan teri**: T-zona (peshana, burun, iyak) yog'li, yanoqlar esa normal yoki quruq. O'zbekiston ayollarining 70% idan ko'prog'i shu turga kiradi!
4. **Ta'sirchan (sezgir) teri**: Har qanday yangi vositaga qizarish yoki achishish bilan javob beradi.
        `,
        actionSteps: [
          "O'z yuz teringizni oyna oldida tekshirib, qaysi turga mansubligini aniqlang.",
          "Oilangizdagi 2 nafar ayolning teri turini aniqlashga mashq qiling."
        ],
        quiz: [
          {
            question: "T-zonasi yog'li, lekin yanoqlari normal yoki quruq bo'lgan teri turi qanday ataladi?",
            options: ["Faqat quruq teri", "Kombinatsiyalashgan (aralash) teri", "Atopik teri", "Keksa teri"],
            correctAnswer: 1,
            explanation: "Peshanasi va burni yog'li bo'lib, yonoqlari quruq bo'lgan teri aralash (kombinatsiyalashgan) deb ataladi."
          }
        ]
      },
      {
        id: "l2-2",
        number: 2,
        title: "4 Bosqichli Kundalik Parvarish Qoidalari",
        duration: "25 daqiqa",
        overview: "Tozalash, Tonizatsiyalash, Chuqur oziqlantirish (Sarum) va Himoya/Namlantirish (Kunduzgi/Kechki krem).",
        notes: `
Ko'p ayollar faqat bitta krem surtib natija kutishadi, bu xato! To'g'ri ketma-ketlik:
1. **Bosqich 1: Tozalash** (Pena, gel yoki mitsellyar suv) — chang va makiyajni tozalaydi.
2. **Bosqich 2: Tonik** — terining pH balansini tiklaydi va krem so'rilishini 3 barobar oshiradi.
3. **Bosqich 3: Sarum (Sivorotka)** — chuqur qatlamlarga faol vitaminlar va gialuron kislotasini olib kiradi.
4. **Bosqich 4: Krem** — terini tashqi muhitdan himoyalaydi va namlikni saqlab qoladi.
        `,
        actionSteps: [
          "Ertalab va kechqurun tozalashdan keyin albatta tonik ishlatishni odat qiling.",
          "Mijozingizga faqat krem emas, to'liq to'plam tavsiya qilish skriptini yodlang."
        ],
        quiz: [
          {
            question: "Tonikning asosiy vazifasi nima?",
            options: [
              "Faqat yuzni bo'yash",
              "Yuvinishdan keyin terining pH balansini tiklash va kremning yaxshi so'rilishiga tayyorlash",
              "Yuzdagi dog'larni 1 kunda yo'qotish",
              "Soch o'stirish"
            ],
            correctAnswer: 1,
            explanation: "Tonik tozalashdan keyin terining kislotali-ishqoriy muvozanatini tiklaydi."
          }
        ]
      },
      {
        id: "l2-3",
        number: 3,
        title: "Faberlicning Top Liniyalari: Global Oxygen va HyaluronCa",
        duration: "28 daqiqa",
        overview: "Kislorodli kosmetika qanday ishlaydi? Qaysi yoshda qaysi seriyani tanlash kerak?",
        notes: `
- **Global Oxygen**: 5-avlod kislorod kompleksi. Har qanday yoshga va har qanday teriga mos keladi. Charchagan, xira tortgan teriga nafas beradi.
- **HyaluronCa**: Gialuron kislotasi va kalsiy moddasi terining elastikligini oshiradi, chuqur namlantiradi.
- **Bioglow**: S vitamini bilan to'yingan, teriga tabiiy porlash va tiniqlik baxsh etadi.
- **Renovage & Matrigenic (45-50+)**: Ajinlarni tortuvchi va yoshartiruvchi kuchli peptidlar to'plami.
        `,
        actionSteps: [
          "Katalogdan HyaluronCa va Global Oxygen mahsulotlari kodlarini yozib oling.",
          "S vitaminli Bioglow mahsulotining foydali jihatlarini bilib oling."
        ],
        quiz: [
          {
            question: "Gialuron kislotasi va kalsiy bilan chuqur namlantiruvchi mashhur Faberlic liniyasi qaysi?",
            options: ["HyaluronCa", "SoapBar", "CleanHome", "AromaSpa"],
            correctAnswer: 0,
            explanation: "HyaluronCa — namlik yetishmayotgan barcha teri turlari uchun ajoyib yechim."
          }
        ]
      },
      {
        id: "l2-4",
        number: 4,
        title: "Mijozga Parfyum va Makiyaj Tanlash Sirlari",
        duration: "30 daqiqa",
        overview: "Faberlicning mashhur xushbo'y iforlari (Pour Toujours, Renata, Valkyrie) va pishiq pardoz vositalari.",
        notes: `
- Parfyum testerlarini bilakka surtib, 15 daqiqa kutish kerak (yuqori, yurak va poyezd notalari ochilishi uchun).
- Darsda eng mashhur iforlarning xarakteri: gulli, mevali, sharqona va yangi (sitrus) iforlar tahlil qilinadi.
        `,
        actionSteps: [
          "Faberlicning 5 ta eng ko'p sotiladigan ayollar parfyum testerlarini xarid qiling.",
          "Har bir iforning asosiy notalarini yozib oling."
        ],
        quiz: [
          {
            question: "Parfyum haqiqiy o'z hidini to'liq ochib berishi uchun bilakda qancha vaqt o'tishi kerak?",
            options: ["1 soniya", "10-15 daqiqa", "3 kun", "Hech qachon ochilmaydi"],
            correctAnswer: 1,
            explanation: "Dastlabki spirtli yuqori notalar tarqab, yurak notalari 10-15 daqiqada o'z asl jilosini namoyon etadi."
          }
        ]
      }
    ]
  },
  {
    id: "smm-mobilografiya",
    title: "SMM va Mobilografiya: Instagramda Faberlic Sotuvlari",
    badge: "Eng zamonaviy",
    level: "O'rta",
    duration: "4 soat",
    lessonsCount: 4,
    color: "from-purple-500 to-indigo-600",
    icon: "Camera",
    shortDesc: "Telefon orqali estetik videolar olish, Reels orqali yangi obunachilar topish, ayollar uchun chiroyli blog yuritish.",
    instructor: {
      name: "Mohinur Karimova",
      role: "SMM Mutaxassis & Kontent Meyker",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
    },
    lessons: [
      {
        id: "l3-1",
        number: 1,
        title: "Instagram Profilni Go'zal Va Ishonchli Qilib Sozlash",
        duration: "26 daqiqa",
        overview: "Chiroyli avatar, tushunarli bio (shapka profilya), qulay aloqa havolasi va yorqin xronika (Highlights).",
        notes: `
### Profilingiz sizning onlayn vitrinangizdir!
- **Rasm (Avatar)**: Sifatli, tabassumli, ko'zlari ochiq shaxsiy rasmingiz yoki brendingiz.
- **Bio (Shapka)**: "Men kimman?", "Sizga qanday foyda bera olaman?", "Qayerga murojaat qilish kerak?".
- **Highlights (Dolzarblar)**: 'Mijozlar fikri', 'Mahsulotlar', 'Buyurtma berish', 'Biznes natijalari', 'Mening hayotim'.
        `,
        actionSteps: [
          "Instagram sahifangiz burchagini tozalang va tushunarli bio yozing.",
          "Mijozlar uchun Telegram bot yoki raqamingiz havolasini joylang."
        ],
        quiz: [
          {
            question: "Instagram profilda ishonchni oshirish uchun eng muhim Highlights (aktualnoe) bo'limi qaysi?",
            options: ["Mijozlar fikri va natijalari (Otzyvlar)", "Faqat tabiat rasmlari", "Musiqalar", "Boshqa brendlar"],
            correctAnswer: 0,
            explanation: "Haqiqiy xaridorlarning samimiy iliq fikrlari yangi mijozlarda 100% ishonch uyg'otadi."
          }
        ]
      },
      {
        id: "l3-2",
        number: 2,
        title: "Mobilografiya: Kosmetika va Mahsulotlarni Chiroyli Tasvirga Olish",
        duration: "34 daqiqa",
        overview: "Oddiy telefon kamerasida oynadek tiniq video olish, yorug'likdan foydalanish va estetik kadrlar.",
        notes: `
### Mobilografiyaning 3 ta asosiy qoidasi:
1. **Kamera linzasini har doim artib oling!** (Oddiy salfetka yoki kiyim cheti bilan emas, maxsus mikrofibra bilan).
2. **Tabiiy yorug'lik**: Deraza oldida, ertalabki yoki tushdan keyingi yumshoq quyosh nurlarida suratga olish.
3. **Kompozitsiya**: Mahsulotni bitta o'zini qo'ymasdan, yoniga kichik gultoj, shoyi mato yoki oyna qo'yish estetikani oshiradi.
        `,
        actionSteps: [
          "Telefoningiz kamerasini artib, deraza yonida bitta Faberlic mahsulotini 3 xil burchakdan oling.",
          "CapCut yoki InShot ilovasida 15 soniyalik chiroyli musiqa bilan video montaj qiling."
        ],
        quiz: [
          {
            question: "Telefonda sifatli video olishdan oldin eng birinchi qilinishi SHART bo'lgan amal nima?",
            options: [
              "Telefonni yangisiga almashtirish",
              "Kamera ko'zchasini (linzasini) toza qilib artish",
              "Chiroqni o'chirish",
              "Qo'shiq kuylash"
            ],
            correctAnswer: 1,
            explanation: "Linzada mayda barmoq izlari bo'lsa, hatto eng qimmat telefon ham xira rasm oladi."
          }
        ]
      },
      {
        id: "l3-3",
        number: 3,
        title: "Reels orqali Yangi Xaridorlar va Hamkorlar Jalb Qilish",
        duration: "30 daqiqa",
        overview: "Reels ssenariylari, birinchi 3 soniyadagi ilgak (hook) va bepul organik obunachilar to'plash.",
        notes: `
- Reels formati bugungi kunda O'zbekistonda eng tez o'sayotgan bepul reklama vositasi.
- "Ushbu krem mening yuzimdagi xiralikni qanday ketkazdi?", "Uyda o'tirib farzandlarim bilan birga oyiga 5 mln so'm topish siri" kabi sarlavhalar ayollarni darhol o'ziga jalb qiladi.
        `,
        actionSteps: [
          "Bitta 'Before / After' (Oldin / Keyin) formatidagi video ssenariy yozing.",
          "Haftasiga kamida 3 ta foydali Reels joylashni rejalashtiring."
        ],
        quiz: [
          {
            question: "Reels videosida tomoshabinni ushlab qoluvchi eng muhim vaqt oralig'i qaysi?",
            options: ["Dastlabki 3 soniya", "Eng oxirgi soniya", "15-daqiqada", "Video tugagandan keyin"],
            correctAnswer: 0,
            explanation: "Birinchi 3 soniyada tomoshabin qiziqsa, videoni oxirigacha tomosha qiladi."
          }
        ]
      },
      {
        id: "l3-4",
        number: 4,
        title: "Direct va Telegramda Xushmuomala Sotuv Yozishmalari",
        duration: "25 daqiqa",
        overview: "Mijoz 'Narxi qancha?' deb so'raganda birdan narx aytib cho'chitmaslik va mehr bilan maslahat berish usullari.",
        notes: `
Mijozga '150,000 so'm' deb quruq narx aytsangiz, u ko'pincha javob bermay ketadi.
To'g'ri javob:
"Assalomu alaykum, azizaxon! Qiziqishingiz uchun rahmat. Ushbu krem aynan quruq terini 24 soat namlantirish uchun mo'ljallangan. Sizga o'zingiz uchunmi yoki yaqiningizga hadya qilyapsizmi? Narxi bor-yo'g'i 120,000 so'm va hozir maxsus 20% chegirmada..."
        `,
        actionSteps: [
          "Telefoningizda tezkor javoblar (Saved replies) shablonini saqlab qo'ying.",
          "O'z mijozlaringiz bilan har doim ovozli iliq xabarlar orqali muloqot qilib ko'ring."
        ],
        quiz: [
          {
            question: "Mijoz narx so'raganda qanday yondashuv eng yaxshi samara beradi?",
            options: [
              "Faqat bitta raqam yozib jim bo'lish",
              "Samimiy salomlashib, mahsulotning unga beradigan foydasini tushuntirib, keyin narxni aytish",
              "Javob bermaslik",
              "Darhol qo'ng'iroq qilib urishish"
            ],
            correctAnswer: 1,
            explanation: "Mehr va samimiyat bilan foydasini tushuntirish mijozda ishonch uyg'otadi."
          }
        ]
      }
    ]
  },
  {
    id: "sotuv-psixologiyasi",
    title: "Sotuv Psixologiyasi va E'tirozlar bilan Ishlash",
    badge: "Praktik trening",
    level: "Barcha bosqichlar",
    duration: "2 soat 50 daqiqa",
    lessonsCount: 3,
    color: "from-amber-500 to-rose-500",
    icon: "HeartHandshake",
    shortDesc: "'Qimmat', 'O'ylab ko'raman', 'Menga kerak emas' degan e'tirozlarga professional javob berish.",
    instructor: {
      name: "Barno Rahimova",
      role: "Biznes Kouch & Psixolog",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=300"
    },
    lessons: [
      {
        id: "l4-1",
        number: 1,
        title: "'Qimmat' va 'O'ylab ko'raman' e'tirozlarini mehr bilan yengish",
        duration: "28 daqiqa",
        overview: "E'tiroz bu rad etish emas, balki mijozning qo'shimcha ma'lumotga ehtiyoji borligidir.",
        notes: `
- Hech qachon mijoz bilan bahslashmang!
- "Sizni juda yaxshi tushunaman, men ham avval shunday o'ylagan edim. Lekin ushbu vosita 3 oyga yetishini va har bir kuni atigi 1500 so'mga to'g'ri kelishini hisoblab ko'rganimda..." texnikasi (Tushunaman - O'ylaganman - Ishonch hosil qilganman).
        `,
        actionSteps: ["Ushbu 'Tushunaman - O'ylaganman - Topdim' formulasini yozib oling."],
        quiz: [
          {
            question: "Mijoz 'Qimmat ekan' deganida birinchi qilinadigan to'g'ri harakat qaysi?",
            options: [
              "Mijozning fikrini hurmat qilib, uni tushunish va qiymatini mayda kunlik xarajatga bo'lib ko'rsatish",
              "U bilan bahslashish",
              "Sizda pul yo'q ekan deyish",
              "Tovarni yashirib qo'yish"
            ],
            correctAnswer: 0,
            explanation: "Mijoz bilan hamdard bo'lib, uning ehtiyojini tushungan holda mahsulotning katta foydasini ko'rsatish lozim."
          }
        ]
      },
      {
        id: "l4-2",
        number: 2,
        title: "Ayollarda O'ziga Ishonch va Biznesdagi Qo'rquvlarni Yengish",
        duration: "24 daqiqa",
        overview: "'Odamlar nima deydi?', 'O'xshamasa-chi?' degan ichki cheklovlarni yengib, yangi hayot boshlash sirlari.",
        notes: `
O'zbek ayollarining eng katta kuchi — ularning sabri va mehnatkashligidir. Faberlic biznesi oilangizga, farzandlaringiz tarbiyasiga ziyon yetkazmagan holda, uyda o'tirib erkin daromad topish imkonini beradi.
        `,
        actionSteps: ["O'zingiz faxrlanadigan 3 ta yutug'ingizni daftaringizga yozing."],
        quiz: [
          {
            question: "Muvaffaqiyatga erishishda eng asosiy omil nima?",
            options: [
              "O'ziga ishonch, muntazam harakat va bilimlarni amalda qo'llash",
              "Faqat omad kutish",
              "Hech narsa qilmaslik",
              "Boshqalarning gapidan qo'rqish"
            ],
            correctAnswer: 0,
            explanation: "O'ziga ishonch va uzluksiz o'rganish har doim ajoyib natijaga yetaklaydi."
          }
        ]
      },
      {
        id: "l4-3",
        number: 3,
        title: "VIP-Mijozlar Bazasini Shakllantirish va Doimiy Buyurtmalar",
        duration: "30 daqiqa",
        overview: "Mijozni 1 martalik emas, umrbod doimiy sadoqatli xaridorga aylantirish sirlari.",
        notes: `
- Har bir buyurtmaga kichik sovg'acha yoki xushbo'y tester qo'shib berish.
- Mijozning tug'ilgan kunini eslab qolib tabriklash.
- Mahsulot yetib borgach 3 kundan so'ng "Yuzingizga yoqdimi, qanday his qilyapsiz?" deb mehr ko'rsatish.
        `,
        actionSteps: ["Mijozlaringiz uchun maxsus 'Mijoz daftarchasi' oching."],
        quiz: [
          {
            question: "Buyurtma olgach mijozga 3 kundan so'ng yozish qanday nomlanadi?",
            options: ["Keyingi g'amxo'rlik servisi (Follow-up)", "Bezovta qilish", "Beparvolik", "Spam"],
            correctAnswer: 0,
            explanation: "Bu mijozga siz uning go'zalligi va salomatligiga chin dildan g'amxo'rlik qilayotganingizni ko'rsatadi."
          }
        ]
      }
    ]
  }
];

export const SUCCESS_STORIES = [
  {
    id: 1,
    name: "Dilnoza Rahimova",
    city: "Samarqand viloyati",
    role: "Katta Direktor (Oylik daromadi: 12,000,000 so'm)",
    story: "3 nafar farzandim bor, uy bekasi edim. Faberlicga shunchaki o'zimga arzon mahsulot olish uchun kelganman. Ushbu akademiyadagi bepul darslarni ko'rib, jamoa tuzishni o'rgandim. 6 oy ichida Direktorlik darajasiga chiqib, 19 mln so'm bonus oldim. Hozirda oilam budjetiga katta hissa qo'shyapman!",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    badge: "19 mln bonus sohibasi"
  },
  {
    id: 2,
    name: "Madinabonu Usmonova",
    city: "Toshkent shahri",
    role: "Vitse-direktor & Talaba (Oylik daromadi: 6,500,000 so'm)",
    story: "Institutda o'qiyman. Kontraktimni o'zim to'lashni xohlagandim. Darslar orasida Instagramda estetik Reelslar olish va Faberlic kosmetikasini to'g'ri tavsiya qilishni o'rgandim. 4 oyda o'z kontraktimni to'ladim va hozir mustaqil daromadga egaman.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
    badge: "Talabalar lideri"
  },
  {
    id: 3,
    name: "Nodiraxon Karimova",
    city: "Farg'ona vodiysi",
    role: "Kumush Direktor (Dubay sayohati g'olibi)",
    story: "Viloyatda turib internet orqali bunchalik katta imkoniyatlar borligini bilmagan edim. Faberlic Ayollar Akademiyasi darslari hayotimni o'zgartirdi. Hech qanday boshlang'ich sarmoyasiz, telefon orqali butun O'zbekiston bo'ylab 300 dan ortiq qizlarni birlashtirdim.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    badge: "Dubay sayohatchisi"
  }
];

export const TOP_LEADERS = [
  { rank: 1, name: "Zuhra Mamadaliyeva", region: "Toshkent", points: "4,820 ball", title: "Oltin Lider", avatar: "ZM" },
  { rank: 2, name: "Nargiza Yoqubova", region: "Samarqand", points: "3,950 ball", title: "Kumush Lider", avatar: "NY" },
  { rank: 3, name: "Shahnoza To'rayeva", region: "Andijon", points: "3,410 ball", title: "Yulduzli Ustoz", avatar: "ST" },
  { rank: 4, name: "Malika Abdullayeva", region: "Buxoro", points: "2,890 ball", title: "Faol Mentor", avatar: "MA" },
  { rank: 5, name: "Gulbahor Ergasheva", region: "Namangan", points: "2,450 ball", title: "Izlanuvchan", avatar: "GE" },
  { rank: 6, name: "Dildoraxon Saidova", region: "Qashqadaryo", points: "2,180 ball", title: "Izlanuvchan", avatar: "DS" }
];

export const TOP_PRODUCTS = [
  {
    id: "p1",
    code: "5792",
    title: "Global Oxygen Kislorodli Balzam",
    category: "Teri Parvarishi",
    desc: "Kislorod kompleksining eng yuqori konsentratsiyasiga ega afsonaviy balzam. Shikastlangan, charchagan terini tezda tiklaydi va qizarishlarni bosadi.",
    points: "8.5 ball",
    price: "85,000 so'm",
    tag: "Xit Mahsulot"
  },
  {
    id: "p2",
    code: "2817",
    title: "HyaluronCa Chuqur Namlantiruvchi Krem",
    category: "Kosmetologiya",
    desc: "Gialuron kislotasi va kalsiy bilan boyitilgan, teringizni 24 soat davomida elastik va mayin saqlaydi.",
    points: "7.2 ball",
    price: "72,000 so'm",
    tag: "Super Tavsiya"
  },
  {
    id: "p3",
    code: "3103",
    title: "Pour Toujours Parfyum Suvi (50 ml)",
    category: "Parfyumeriya",
    desc: "Fransuz parfyumeri tomonidan yaratilgan, oppoq kelinlik libosi va nozik sevgi ramzi bo'lgan maftunkor ifor.",
    points: "24.0 ball",
    price: "245,000 so'm",
    tag: "Elita Ifor"
  },
  {
    id: "p4",
    code: "30027",
    title: "Konsentrlangan Ekologik Kir Yuvish Kapsulasi",
    category: "Uy-Ro'zg'or",
    desc: "Germaniya standarti asosida yaratilgan, fosfatlarsiz va allergenlarsiz, bolalar kiyimlari uchun ham mutlaqo xavfsiz tozalik.",
    points: "6.0 ball",
    price: "59,000 so'm",
    tag: "100% Ekologik"
  }
];

export const FINAL_EXAM_QUESTIONS = [
  {
    id: 1,
    question: "Faberlicda shaxsiy 50 ball bajargan maslahatchi qanday keshbek/chegirma foiziga ega bo'ladi?",
    options: ["10%", "20%", "26%", "50%"],
    correctAnswer: 2
  },
  {
    id: 2,
    question: "Faberlic mahsulotlarining butun dunyo bo'ylab patentlangan asosiy texnologiyasi nima?",
    options: ["Novaftem-O2 kislorod kompleksi", "Plastik mikroto'qimalar", "Shakar qiyomi", "Spirtli ekstrakt"],
    correctAnswer: 0
  },
  {
    id: 3,
    question: "Direktorlik unvoniga chiqish uchun jamoa bilan kamida necha ball to'plash talab etiladi?",
    options: ["1000 ball", "2000 ball", "3000 ball", "5000 ball"],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "Direktorlik maqomi tasdiqlanganda kompaniya tomonidan to'lanadigan bir martalik kvalifikatsiya bonusi qancha?",
    options: ["5,000,000 so'm", "10,000,000 so'm", "15,000,000 so'm", "19,000,000 so'm"],
    correctAnswer: 3
  },
  {
    id: 5,
    question: "T-zonasi yog'li, ammo yonoqlari quruq yoki normal bo'lgan teri qanday nomlanadi?",
    options: ["Quruq teri", "Yog'li teri", "Kombinatsiyalashgan (aralash) teri", "Atopik teri"],
    correctAnswer: 2
  },
  {
    id: 6,
    question: "Kundalik 4 bosqichli parvarishda yuz tozalanganidan keyin ikkinchi bo'lib nima surtiladi?",
    options: ["Kechki og'ir krem", "Tonik (pH tiklash uchun)", "Dekorativ pudra", "Zaytun moyi"],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "Instagramda qiziqarli va professional kontent olishdan oldin kamera linzasini nima qilish kerak?",
    options: ["Chiroqni o'chirish", "Linzani toza qilib artish", "Filtirlarni maksimal qo'yish", "Tezda qochish"],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "Mijoz 'Mahsulot qimmat ekan' deganida eng to'g'ri psixologik yondashuv nima?",
    options: [
      "Darhol bahslashish",
      "Mijozning fikrini hurmat qilib, foydasini va tejamkorligini kunlik narxga bo'lib tushuntirish",
      "Sotishdan bosh tortish",
      "Javob bermasdan qoldirish"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "VIP-maslahatchi (100 ball bajargan) maqomining eng katta ustunligi nima?",
    options: [
      "Saytdan ro'yxatdan o'tgan yangi mijozlar avtomatik uning guruhiga bepul beriladi",
      "Faqat sertifikat beriladi",
      "Hech narsa berilmaydi",
      "Faqat 1 ta sovun hadya qilinadi"
    ],
    correctAnswer: 0
  },
  {
    id: 10,
    question: "Faberlicda farzand ko'rgan direktor unvonidagi faol ayollarga qanday maxsus rag'batlantirish mavjud?",
    options: [
      "Onalik bonusi (har katalogda to'lanadigan yordam puli)",
      "Jazo jarimasi",
      "Hech qanday imtiyoz yo'q",
      "Faqat tabriknoma"
    ],
    correctAnswer: 0
  }
];
