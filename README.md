# عطاء - Ataa Volunteer Management Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
</p>

<p align="center">
  <strong>منصة ذكية لأتمتة إدارة العمل التطوعي وتعزيز المسؤولية المجتمعية</strong>
</p>

---

## 📋 نظرة عامة

"عطاء" هي منصة رقمية متكاملة تربط بين المتطوعين والجهات المنظمة، وتتيح:

- 🔍 **اكتشاف الفرص**: البحث والتصفية حسب الموقع والمجال والمهارات
- 📊 **تتبع الساعات**: تسجيل الحضور والمغادرة مع QR
- 🏆 **نظام الأوسمة**: تلعيب وتحفيز المتطوعين
- 📜 **شهادات رقمية**: إصدار شهادات معتمدة
- 💼 **محفظة رقمية**: توثيق جميع الإنجازات

## 🏗️ هيكل المشروع

```
ataa-platform/
├── backend/                 # Backend API
│   ├── prisma/             # Database schema & migrations
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth & error handling
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities
│   └── package.json
│
└── frontend/               # React Frontend
    ├── src/
    │   ├── components/     # React components
    │   ├── contexts/       # Auth context
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   └── types/          # TypeScript types
    └── package.json
```

## 🚀 التشغيل المحلي

### متطلبات النظام

- Node.js 18+
- PostgreSQL 14+
- npm أو yarn

### 1. إعداد قاعدة البيانات

```bash
# إنشاء قاعدة البيانات
createdb ataa_db
```

### 2. إعداد Backend

```bash
cd backend

# تثبيت الاعتماديات
npm install

# إعداد متغيرات البيئة
cp .env.example .env
# عدل ملف .env ببياناتك

# تشغيل الهجرات
npx prisma migrate dev

# إضافة البيانات الأولية
npx prisma db seed

# تشغيل الخادم
npm run dev
```

### 3. إعداد Frontend

```bash
cd frontend

# تثبيت الاعتماديات
npm install

# تشغيل التطبيق
npm run dev
```

### 4. الوصول للتطبيق

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Prisma Studio: http://localhost:5555

## 🔐 بيانات الدخول الافتراضية

| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| Admin | admin@ataa.sa | admin123456 |
| Volunteer | volunteer@example.com | volunteer123 |
| Organization | org@example.com | org123456 |

## 🌐 النشر على Render

### 1. قاعدة البيانات

1. أنشئ PostgreSQL جديدة في Render
2. انسخ Internal Database URL

### 2. Backend Web Service

1. اربط مستودع GitHub
2. اضبط الإعدادات:
   - **Build Command**: `npm install && npm run build && npx prisma migrate deploy`
   - **Start Command**: `npm start`
3. أضف متغيرات البيئة:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL`

### 3. Frontend Static Site

1. اربط نفس المستودع
2. اضبط الإعدادات:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. أضف متغير البيئة:
   - `VITE_API_URL` (رابط Backend)

## 📁 المتطلبات الوظيفية

### المتطوع
- ✅ تسجيل حساب وتسجيل دخول
- ✅ استعراض الفرص والتصفية
- ✅ التقديم على الفرص
- ✅ تسجيل ساعات التطوع (Check-in/Check-out)
- ✅ المحفظة الرقمية
- ✅ مشاركة الإنجازات

### الجهة المنظمة
- ✅ تسجيل الجهة والتحقق
- ✅ إنشاء وإدارة الفرص
- ✅ إدارة المتقدمين
- ✅ إدارة الحضور والساعات
- ✅ إصدار الشهادات
- ✅ لوحة تحكم تفاعلية

### مدير النظام
- ✅ إدارة المستخدمين
- ✅ التحقق من الجهات
- ✅ إدارة الأوسمة
- ✅ إحصائيات النظام

## 🛡️ الأمان

- JWT للمصادقة
- Role-Based Access Control
- تشفير كلمات المرور (bcrypt)
- حماية CORS
- Helmet للحماية من الهجمات الشائعة

## 📝 الترخيص

MIT License

---

<p align="center">
  صنع بحب ❤️ لفريق عطاء
</p>
