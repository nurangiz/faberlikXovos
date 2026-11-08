import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'faberlic_academy.db');
const db = new Database(dbPath);

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      region TEXT NOT NULL,
      points INTEGER DEFAULT 0,
      streak_days INTEGER DEFAULT 1,
      last_active_date TEXT,
      role TEXT DEFAULT 'student',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lesson_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, lesson_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS certificates (
      certificate_id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      course_name TEXT NOT NULL,
      score INTEGER NOT NULL,
      issue_date TEXT NOT NULL,
      status TEXT DEFAULT 'verified',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      points_earned INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Check if we need to seed initial realistic female leaders for Uzbekistan
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    seedInitialUsers();
  }
}

function seedInitialUsers() {
  const salt = bcrypt.genSaltSync(10);
  const defaultPass = bcrypt.hashSync('123456', salt);

  const initialLeaders = [
    { name: "Zuhra Mamadaliyeva", phone: "+998 90 111 22 33", region: "Toshkent", points: 1450, streak: 18, lessons: 14 },
    { name: "Nargiza Yoqubova", phone: "+998 93 222 33 44", region: "Samarqand", points: 1250, streak: 14, lessons: 12 },
    { name: "Shahnoza To'rayeva", phone: "+998 97 333 44 55", region: "Andijon", points: 1100, streak: 12, lessons: 11 },
    { name: "Malika Abdullayeva", phone: "+998 91 444 55 66", region: "Buxoro", points: 950, streak: 9, lessons: 10 },
    { name: "Gulbahor Ergasheva", phone: "+998 94 555 66 77", region: "Namangan", points: 850, streak: 8, lessons: 9 },
    { name: "Dildoraxon Saidova", phone: "+998 99 666 77 88", region: "Qashqadaryo", points: 750, streak: 7, lessons: 8 },
    { name: "Rayhon Sobirova", phone: "+998 90 777 88 99", region: "Farg'ona", points: 600, streak: 6, lessons: 7 },
    { name: "Barnoxon Oripova", phone: "+998 93 888 99 00", region: "Surxondaryo", points: 550, streak: 5, lessons: 6 },
    { name: "Nilufar Hamidova", phone: "+998 91 999 00 11", region: "Xorazm", points: 450, streak: 4, lessons: 5 },
    { name: "Madina Alimova", phone: "+998 97 123 78 90", region: "Navoiy", points: 350, streak: 3, lessons: 4 }
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (name, phone, password_hash, region, points, streak_days, last_active_date)
    VALUES (?, ?, ?, ?, ?, ?, date('now'))
  `);

  const insertCert = db.prepare(`
    INSERT INTO certificates (certificate_id, user_id, user_name, course_name, score, issue_date)
    VALUES (?, ?, ?, ?, ?, date('now'))
  `);

  initialLeaders.forEach((leader, idx) => {
    const result = insertUser.run(
      leader.name,
      leader.phone,
      defaultPass,
      leader.region,
      leader.points,
      leader.streak
    );

    // Give certificates to top 3 leaders
    if (idx < 3) {
      insertCert.run(
        `FL-UZ-2026-000${idx + 1}`,
        result.lastInsertRowid,
        leader.name,
        "Faberlic Biznes va Go'zallik Liderligi",
        95 - idx * 5
      );
    }
  });

  console.log("Initial realistic database seeded successfully!");
}

export default db;
