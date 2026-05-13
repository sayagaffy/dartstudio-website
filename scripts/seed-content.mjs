// @ts-nocheck
// biome-ignore-all lint/suspicious/noConsole: CLI script — console output is intentional
/**
 * Seed script — pushes all approved copy from knowledge base into Sanity.
 * Run: node scripts/seed-content.mjs
 */

import crypto from "node:crypto";
import { createClient } from "@sanity/client";

const PROJECT_ID = "4e5l2fq5";
const DATASET = "production";
const API_VERSION = "2024-12-01";
const TOKEN =
  "sk1wvMskeFrWnQOpZZWAqaZuI8Q9bQVxJgCk7tOCxjVqoWIn9Ki6lQNSVffbe69kz3aXis6kFKlW4erqLsafZMdNtRA9zgFe6g6wn33z3LhnFBzWL1IUHbdtOgI4eLzAE6o727qfLx1ST37fkmikFl8QE6deBVQLTmGl76uFuCWciXHE93PF";

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: TOKEN,
  useCdn: false,
});

// ─── helpers ──────────────────────────────────────────────────────────────────

function k() {
  return crypto.randomBytes(4).toString("hex");
}

/** Build a single portable-text paragraph block */
function block(text, style = "normal", marks = []) {
  return {
    _type: "block",
    _key: k(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: k(), text, marks }],
  };
}

/** Convert an array of strings into an array of PT blocks */
function pt(...paragraphs) {
  return paragraphs.filter(Boolean).map((p) => block(p));
}

/** localizedString = { id, en } */
function ls(id, en) {
  return { id, en };
}

/** localizedText = { id, en } — plain text fields */
function lt(id, en) {
  return { id, en };
}

/** localizedRichText = { id: PT[], en: PT[] } */
function lrt(idParas, enParas) {
  return {
    id: pt(...(Array.isArray(idParas) ? idParas : [idParas])),
    en: pt(...(Array.isArray(enParas) ? enParas : [enParas])),
  };
}

function cta(labelId, labelEn, href, variant = "primary") {
  return { label: ls(labelId, labelEn), href, variant };
}

async function upsert(doc) {
  const result = await client.createOrReplace(doc);
  console.log(`  ✓ ${doc._type} [${doc._id}]`);
  return result;
}

// ─── 1. SITE SETTINGS ────────────────────────────────────────────────────────

async function seedSiteSettings() {
  console.log("\n[siteSettings]");
  await upsert({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "Dartstudio",
    siteTagline: ls(
      "Studio kecil. Sistem yang nggak akan bikin Anda nyesel 2 tahun lagi.",
      "Small studio. Systems you won't regret in two years.",
    ),
    siteDescription: lt(
      "Studio kecil berisi veteran teknologi. Kami bangun produk sendiri, dan sesekali jadi technology partner, architecture consultant, atau tech-for-equity investor untuk rekan yang serius.",
      "A small studio of technology veterans. We build our own products, and occasionally become a technology partner, architecture consultant, or tech-for-equity investor for the right collaborators.",
    ),
    contactEmail: "hello@dartstudio.id",
    principles: [
      {
        _type: "principle",
        _key: k(),
        title: ls("Arsitektur dulu. Selalu.", "Architecture first. Always."),
        body: lt(
          "Kode yang ditulis tanpa arsitektur seperti rumah yang dibangun tanpa fondasi: cepat berdiri, susah ditambah, hancur di gempa kecil. Kami menolak memulai proyek tanpa fase desain arsitektur, sependek apa pun timeline-nya.",
          "Code written without architecture is like a house built without a foundation: fast to erect, hard to extend, collapses at the first tremor. We refuse to start any project without an architecture design phase, however short the timeline.",
        ),
      },
      {
        _type: "principle",
        _key: k(),
        title: ls(
          "Kode yang baik adalah kode yang bisa diwariskan.",
          "Good code is code that can be inherited.",
        ),
        body: lt(
          "Kami menulis kode dengan asumsi bahwa orang yang akan membacanya berikutnya bukan kami. Itu mengubah banyak hal: penamaan jadi penting, dokumentasi jadi penting, struktur folder jadi penting.",
          "We write code assuming the next reader is not us. That changes many things: naming matters, documentation matters, folder structure matters.",
        ),
      },
      {
        _type: "principle",
        _key: k(),
        title: ls("Kompleksitas yang bukan untuk pamer.", "Complexity that isn't for show."),
        body: lt(
          "Kalau Anda tidak bisa menjelaskan kenapa Anda memilih solusi rumit kepada engineer berpengalaman di luar tim, kemungkinan solusinya memang tidak perlu rumit.",
          "If you can't explain why you chose a complex solution to an experienced engineer outside the team, the solution probably didn't need to be complex.",
        ),
      },
      {
        _type: "principle",
        _key: k(),
        title: ls("Setiap dependensi adalah utang.", "Every dependency is debt."),
        body: lt(
          "Setiap library, framework, atau service yang Anda tambahkan ke sistem adalah komitmen jangka panjang. Kami memikirkan setiap pilihan dengan kesadaran bahwa pilihan itu akan menemani kita untuk waktu yang lama.",
          "Every library, framework, or service you add to a system is a long-term commitment. We think through every choice with the awareness that it will accompany us for a long time.",
        ),
      },
      {
        _type: "principle",
        _key: k(),
        title: ls(
          "Performa bukan untuk dipikirkan belakangan.",
          "Performance is not an afterthought.",
        ),
        body: lt(
          "Performa adalah karakteristik arsitektur, bukan polishing terakhir. Pilihan database, pilihan struktur data, pilihan apakah operasi sync atau async — itu semua keputusan performa yang diambil di awal.",
          "Performance is an architectural characteristic, not a final polish. Database choices, data structure choices, whether operations are sync or async — those are all performance decisions made upfront.",
        ),
      },
      {
        _type: "principle",
        _key: k(),
        title: ls("Sistem yang baik tidak butuh hero.", "Good systems don't need heroes."),
        body: lt(
          "Kami curiga pada tim yang punya satu orang yang jadi satu-satunya yang ngerti sistem. Itu bukan tanda excellence — itu tanda fragility. Goal kami: meninggalkan sistem yang bisa dijalankan tanpa kami.",
          "We're suspicious of teams where one person is the only one who understands the system. That's not a sign of excellence — it's a sign of fragility. Our goal: leave systems that can run without us.",
        ),
      },
      {
        _type: "principle",
        _key: k(),
        title: ls("Kalau ragu, lebih sederhana.", "When in doubt, simpler."),
        body: lt(
          "Hampir setiap kesalahan engineering yang kami buat dalam karir kami punya satu kesamaan: kami memilih solusi yang lebih rumit padahal solusi sederhana mencukupi. Simplicity bukan tentang kemalasan. Itu disiplin paling sulit di engineering.",
          "Almost every engineering mistake we've made in our careers has one thing in common: we chose a more complex solution when the simple one would have been enough. Simplicity isn't laziness. It's the hardest discipline in engineering.",
        ),
      },
    ],
    navigationLabels: {
      studio: ls("Studio", "Studio"),
      collaborate: ls("Collaborate", "Collaborate"),
      products: ls("Products", "Products"),
      journal: ls("Journal", "Journal"),
      contactCta: ls("Mulai Percakapan", "Start a Conversation"),
    },
    footerColumns: [
      {
        _key: k(),
        heading: ls("STUDIO", "STUDIO"),
        links: [
          { _key: k(), label: ls("About", "About"), href: "/studio" },
          { _key: k(), label: ls("Prinsip", "Principles"), href: "/studio/principles" },
          { _key: k(), label: ls("Orang-orang", "People"), href: "/studio/people" },
          { _key: k(), label: ls("Cara Kami Bekerja", "How We Work"), href: "/studio#how-we-work" },
        ],
      },
      {
        _key: k(),
        heading: ls("COLLABORATE", "COLLABORATE"),
        links: [
          {
            _key: k(),
            label: ls("Technology Partner", "Technology Partner"),
            href: "/collaborate/technology-partner",
          },
          {
            _key: k(),
            label: ls("Architecture Consultant", "Architecture Consultant"),
            href: "/collaborate/architecture-consultant",
          },
          {
            _key: k(),
            label: ls("Strategic Investor", "Strategic Investor"),
            href: "/collaborate/strategic-investor",
          },
          {
            _key: k(),
            label: ls("Belum yakin yang mana?", "Not sure which?"),
            href: "/collaborate#not-sure",
          },
        ],
      },
      {
        _key: k(),
        heading: ls("PRODUCTS", "PRODUCTS"),
        links: [{ _key: k(), label: ls("Semua Produk", "All Products"), href: "/products" }],
      },
      {
        _key: k(),
        heading: ls("JOURNAL", "JOURNAL"),
        links: [
          { _key: k(), label: ls("Terbaru", "Latest"), href: "/journal" },
          {
            _key: k(),
            label: ls("Arsitektur", "Architecture"),
            href: "/journal/category/architecture",
          },
          {
            _key: k(),
            label: ls("Engineering", "Engineering"),
            href: "/journal/category/engineering",
          },
          {
            _key: k(),
            label: ls("Studio Notes", "Studio Notes"),
            href: "/journal/category/studio-notes",
          },
        ],
      },
    ],
  });
}

// ─── 2. JOURNAL CATEGORIES ────────────────────────────────────────────────────

async function seedJournalCategories() {
  console.log("\n[journalCategory]");
  const cats = [
    {
      _id: "jcat-architecture",
      title: ls("Arsitektur", "Architecture"),
      slug: "architecture",
      description: lt(
        "Tulisan soal desain arsitektur sistem, trade-off, dan keputusan teknis jangka panjang.",
        "Writing on system architecture design, trade-offs, and long-term technical decisions.",
      ),
    },
    {
      _id: "jcat-engineering",
      title: ls("Engineering", "Engineering"),
      slug: "engineering",
      description: lt(
        "Tulisan teknis soal implementasi, tools, dan praktik engineering sehari-hari.",
        "Technical writing on implementation, tools, and everyday engineering practices.",
      ),
    },
    {
      _id: "jcat-studio-notes",
      title: ls("Studio Notes", "Studio Notes"),
      slug: "studio-notes",
      description: lt(
        "Catatan dari dalam studio — keputusan produk, cara kami bekerja, dan hal-hal yang kami pelajari.",
        "Notes from inside the studio — product decisions, how we work, and things we're learning.",
      ),
    },
  ];

  for (const cat of cats) {
    await upsert({
      _id: cat._id,
      _type: "journalCategory",
      title: cat.title,
      slug: { _type: "slug", current: cat.slug },
      description: cat.description,
    });
  }
}

// ─── 3. FAQ DOCUMENTS ─────────────────────────────────────────────────────────

async function seedFaqs() {
  console.log("\n[faq]");

  const faqs = [
    // Technology Partner
    {
      _id: "faq-tp-01",
      topic: "technology-partner",
      question: ls(
        "Berapa biaya project Technology Partner?",
        "How much does a Technology Partner engagement cost?",
      ),
      answer: lrt(
        [
          "Berkisar di range project teknologi profesional kelas menengah ke atas. Variabel besarnya adalah scope dan durasi — produk dengan kompleksitas backend tinggi atau dependency banyak akan lebih signifikan dari produk dengan scope lebih fokus.",
          "Setelah discovery call awal, kami biasanya bisa memberi range yang lebih spesifik dalam 1 minggu.",
        ],
        [
          "In the range of mid-to-upper professional technology projects. The main variables are scope and duration — products with high backend complexity or many dependencies will be more significant than focused-scope products.",
          "After an initial discovery call, we can typically give a more specific range within 1 week.",
        ],
      ),
    },
    {
      _id: "faq-tp-02",
      topic: "technology-partner",
      question: ls(
        "Apakah kalian terbuka untuk model hybrid: cash + equity?",
        "Are you open to a hybrid model: cash + equity?",
      ),
      answer: lrt(
        [
          "Untuk project tertentu, ya. Tapi ini bukan jalur default kami untuk Technology Partner — itu lebih masuk ke jalur Strategic Investor, yang punya kriteria seleksi tersendiri. Untuk Technology Partner standard, kami beroperasi pada engagement cash penuh.",
        ],
        [
          "For certain projects, yes. But this isn't our default path for Technology Partner — that falls more under Strategic Investor, which has its own selection criteria. For standard Technology Partner, we operate on full cash engagement.",
        ],
      ),
    },
    {
      _id: "faq-tp-03",
      topic: "technology-partner",
      question: ls(
        "Saya butuh produk launch dalam 6 minggu. Bisa?",
        "I need to launch in 6 weeks. Can you do it?",
      ),
      answer: lrt(
        [
          "Tergantung scope. Untuk scope yang benar-benar fokus dan disiplin (mis. landing page kompleks + 1 fungsi inti dengan integrasi terbatas), bisa. Untuk produk full dengan beberapa user flow dan integrasi — biasanya tidak realistic, dan kami akan jujur soal itu sejak awal.",
          "Kami tidak ambil project dengan timeline yang kami tahu tidak bisa kami eksekusi dengan kualitas yang kami banggakan.",
        ],
        [
          "Depends on scope. For truly focused and disciplined scope (e.g., complex landing page + 1 core function with limited integrations), yes. For a full product with multiple user flows and integrations — usually not realistic, and we'll be honest about that from the start.",
          "We don't take projects with timelines we know we can't execute at the quality we're proud of.",
        ],
      ),
    },
    {
      _id: "faq-tp-04",
      topic: "technology-partner",
      question: ls("Stack apa yang kalian pakai?", "What stack do you use?"),
      answer: lrt(
        [
          "Kami opinionated tapi tidak dogmatic. Default kami: TypeScript untuk backend dan frontend, PostgreSQL untuk database utama, Next.js atau React Native untuk UI, deployment di AWS/GCP/Cloudflare tergantung kebutuhan.",
          "Untuk requirement spesifik (data engineering berat, ML/AI workloads, infrastruktur khusus), kami pakai stack yang lebih sesuai. Yang penting: kami tidak akan memilih stack rumit tanpa alasan, dan kami selalu transparan kalau pilihan kami sub-optimal untuk konteks Anda.",
        ],
        [
          "We're opinionated but not dogmatic. Our defaults: TypeScript for backend and frontend, PostgreSQL for the primary database, Next.js or React Native for UI, deployment on AWS/GCP/Cloudflare depending on needs.",
          "For specific requirements (heavy data engineering, ML/AI workloads, specialized infrastructure), we use a more appropriate stack. What matters: we won't choose a complex stack without reason, and we're always transparent if our choice is sub-optimal for your context.",
        ],
      ),
    },
    {
      _id: "faq-tp-05",
      topic: "technology-partner",
      question: ls("Bagaimana komunikasi sehari-hari?", "How does day-to-day communication work?"),
      answer: lrt(
        [
          "Async-first dengan Slack atau channel yang Anda sudah pakai. Standup minggu pertama dan terakhir di setiap sprint. Demo dua-mingguan. Untuk decision blockers, kami punya komitmen response time dalam jam kerja.",
          "Kami tidak available 24/7 — dan kami pikir itu fitur, bukan bug.",
        ],
        [
          "Async-first via Slack or whatever channel you already use. Standups on the first and last week of each sprint. Bi-weekly demos. For decision blockers, we commit to response times within business hours.",
          "We're not available 24/7 — and we think that's a feature, not a bug.",
        ],
      ),
    },
    {
      _id: "faq-tp-06",
      topic: "technology-partner",
      question: ls(
        "Apakah saya bisa hire engineer dari Dartstudio setelah project selesai?",
        "Can I hire engineers from Dartstudio after the project ends?",
      ),
      answer: lrt(
        [
          "Engineer kami partners di Dartstudio, bukan karyawan yang bisa di-hire keluar. Tapi kami sangat encourage Anda untuk bangun tim internal Anda sendiri — dan kami siap bantu interview, advise pada keputusan hiring, atau jadi technical advisor di awal-awal.",
        ],
        [
          "Our engineers are partners at Dartstudio, not employees who can be hired away. But we strongly encourage you to build your own internal team — and we're ready to help with interviews, hiring decisions, or serve as a technical advisor in the early stages.",
        ],
      ),
    },
    // Architecture Consultant
    {
      _id: "faq-ac-01",
      topic: "architecture-consultant",
      question: ls(
        "Apakah kami harus serahkan akses penuh ke codebase?",
        "Do we need to give full access to the codebase?",
      ),
      answer: lrt(
        [
          "Untuk diagnose yang akurat, ya — kami butuh akses read minimal. Kami selalu kerja di bawah NDA dan akses bisa dibatasi ke environment staging atau replika.",
          "Beberapa klien memilih untuk kami akses via screen-share dengan engineer mereka, terutama untuk sistem yang sangat sensitif. Itu bisa diatur.",
        ],
        [
          "For an accurate diagnosis, yes — we need at minimum read access. We always work under NDA and access can be limited to a staging environment or replica.",
          "Some clients prefer we access via screen-share with their engineers, especially for very sensitive systems. That can be arranged.",
        ],
      ),
    },
    {
      _id: "faq-ac-02",
      topic: "architecture-consultant",
      question: ls("Berapa biayanya?", "How much does it cost?"),
      answer: lrt(
        [
          "Tergantung skala sistem dan engagement model. Audit only untuk sistem berskala menengah biasanya berkisar di range project teknis profesional pada umumnya.",
          "Setelah diskusi awal 30 menit, kami bisa kasih estimasi lebih konkret. Kami tidak punya paket 'starter' karena setiap sistem berbeda kondisinya.",
        ],
        [
          "Depends on the scale of the system and engagement model. Audit-only for a mid-scale system typically falls in the range of standard professional technical projects.",
          "After a 30-minute initial discussion, we can give a more concrete estimate. We don't have a 'starter' package because every system has different conditions.",
        ],
      ),
    },
    {
      _id: "faq-ac-03",
      topic: "architecture-consultant",
      question: ls(
        "Apakah kami harus pakai jasa lanjutan setelah audit?",
        "Do we have to use your follow-up services after the audit?",
      ),
      answer: lrt(
        [
          "Tidak. Audit dirancang sebagai produk berdiri sendiri. Banyak klien hanya butuh peta dan rekomendasi, lalu mengeksekusi internal. Itu hasil yang baik.",
        ],
        [
          "No. The audit is designed as a standalone product. Many clients just need the map and recommendations, then execute internally. That's a good outcome.",
        ],
      ),
    },
    {
      _id: "faq-ac-04",
      topic: "architecture-consultant",
      question: ls(
        "Sistem kami menggunakan stack yang agak unik. Apakah kalian bisa?",
        "Our system uses a fairly unique stack. Can you handle it?",
      ),
      answer: lrt(
        [
          "Tergantung. Tim kami punya pengalaman di stack mainstream (TypeScript/Node, Go, Python, JVM, Ruby, PostgreSQL, Kafka, Kubernetes, AWS/GCP). Untuk stack di luar itu, ceritakan dulu — kami akan jujur kalau bukan area kekuatan kami.",
        ],
        [
          "Depends. Our team has experience with mainstream stacks (TypeScript/Node, Go, Python, JVM, Ruby, PostgreSQL, Kafka, Kubernetes, AWS/GCP). For stacks outside that, tell us first — we'll be honest if it's not our area of strength.",
        ],
      ),
    },
    {
      _id: "faq-ac-05",
      topic: "architecture-consultant",
      question: ls(
        "Tim engineering kami akan defensive saat audit. Bagaimana kalian handle?",
        "Our engineering team will be defensive during the audit. How do you handle that?",
      ),
      answer: lrt(
        [
          "Wajar. Kami sudah pernah di posisi mereka. Audit kami tidak pernah jadi 'report card' untuk engineer — fokus kami pada sistem dan keputusan, bukan orang.",
          "Engineer yang baik biasanya yang paling vokal melaporkan masalah, dan kami selalu memastikan mereka jadi bagian dari proses, bukan objek penilaian.",
        ],
        [
          "Understandable. We've been in their position. Our audit never becomes a 'report card' for engineers — our focus is on the system and decisions, not people.",
          "Good engineers are usually the most vocal about reporting problems, and we always ensure they're part of the process, not the subject of evaluation.",
        ],
      ),
    },
    // Strategic Investor
    {
      _id: "faq-si-01",
      topic: "strategic-investor",
      question: ls(
        "Berapa equity stake yang biasanya kalian ambil?",
        "How much equity stake do you typically take?",
      ),
      answer: lrt(
        [
          "Dinegosiasikan per case, tergantung kompleksitas teknis, durasi commitment, dan nilai yang kami bawa. Kami tidak punya angka default — kami lebih suka percakapan yang jujur tentang nilai dan ekspektasi dari kedua sisi sebelum angka dibicarakan.",
        ],
        [
          "Negotiated per case, depending on technical complexity, commitment duration, and the value we bring. We don't have a default number — we prefer an honest conversation about value and expectations from both sides before discussing numbers.",
        ],
      ),
    },
    {
      _id: "faq-si-02",
      topic: "strategic-investor",
      question: ls(
        "Apakah kalian bisa jadi co-founder secara formal?",
        "Can you become a formal co-founder?",
      ),
      answer: lrt(
        [
          "Bisa, dalam beberapa kasus. Kami lebih sering masuk sebagai holding dengan equity stake, tapi kalau ada alasan strategis yang kuat untuk masuk sebagai co-founder (mis. untuk fundraising narrative atau struktur legal tertentu), itu bisa didiskusikan.",
        ],
        [
          "Yes, in some cases. We more often come in as a holding entity with an equity stake, but if there's a strong strategic reason to come in as co-founder (e.g., for fundraising narrative or certain legal structures), that can be discussed.",
        ],
      ),
    },
    {
      _id: "faq-si-03",
      topic: "strategic-investor",
      question: ls("Berapa lama proses seleksinya?", "How long is the selection process?"),
      answer: lrt(
        [
          "Biasanya 8-12 minggu dari first contact ke partnership formal. Kami menyadari itu lama — itu juga sengaja. Komitmen multi-year yang dibuat tergesa-gesa biasanya tidak bertahan.",
        ],
        [
          "Typically 8-12 weeks from first contact to formal partnership. We know that's long — it's also intentional. Multi-year commitments made in haste usually don't last.",
        ],
      ),
    },
  ];

  for (const faq of faqs) {
    await upsert({
      _id: faq._id,
      _type: "faq",
      question: faq.question,
      answer: faq.answer,
      topic: faq.topic,
    });
  }

  return faqs.map((f) => f._id);
}

// ─── 4. COLLABORATE MODELS ────────────────────────────────────────────────────

async function seedCollaborateModels() {
  console.log("\n[collaborateModel]");

  // Technology Partner
  await upsert({
    _id: "cm-technology-partner",
    _type: "collaborateModel",
    modelKey: "technology-partner",
    displayOrder: 1,
    name: ls("Technology Partner", "Technology Partner"),
    shortDescriptor: ls(
      "Untuk Anda yang membangun produk dari nol",
      "For those building products from scratch",
    ),
    heroHeading: ls(
      "Anda punya visi. Kami yang tanggung jawab atas eksekusi engineering-nya.",
      "You have the vision. We own the engineering execution.",
    ),
    heroSubheading: lt(
      "Dari titik nol sampai produk hidup. Kami masuk sebagai partner teknologi penuh — engineering, arsitektur, dan keputusan teknis besar lainnya jadi tanggung jawab kami, sehingga Anda bisa fokus di hal yang hanya bisa Anda lakukan: bisnis, produk, dan distribusi.",
      "From zero to live product. We come in as a full technology partner — engineering, architecture, and major technical decisions become our responsibility, so you can focus on what only you can do: business, product, and distribution.",
    ),
    ctaPrimary: cta("Diskusikan Ide Anda", "Discuss Your Idea", "/contact", "primary"),
    ctaSecondary: cta(
      "Lihat Bagaimana Kami Bekerja",
      "See How We Work",
      "/studio#how-we-work",
      "secondary",
    ),
    sections: [
      {
        _type: "contentSection",
        _key: k(),
        sectionType: "generic",
        heading: ls("Apakah ini cocok untuk Anda?", "Is this right for you?"),
        body: lrt(
          [
            "Anda paham bisnis Anda lebih dalam dari kami. Kami expert di engineering — Anda expert di domain Anda. Kerjasama terbaik terjadi saat masing-masing pihak membawa expertise berbeda ke meja.",
            "Anda sudah punya hipotesis bisnis, bukan ide mentah. Kami bisa bantu menajamkan, tapi kami tidak akan membantu menentukan 'apa bisnisnya'.",
            "Anda butuh tim engineering kelas berat, bukan kontraktor. Kalau Anda butuh seseorang yang akan ikut memikirkan trade-off arsitektur, push back saat keputusan Anda kurang tepat secara teknis, dan kemudian eksekusi dengan kualitas yang bisa di-handover — itu fit kami.",
            "Anda available untuk decision making. Project Technology Partner akan punya banyak keputusan trade-off di sepanjang jalan. Founder yang available untuk percakapan dua-mingguan dan responsif untuk decision blockers — itu yang berhasil.",
          ],
          [
            "You understand your business more deeply than we do. We're experts in engineering — you're the expert in your domain. The best collaborations happen when each party brings different expertise to the table.",
            "You already have a business hypothesis, not a raw idea. We can help sharpen it, but we won't help determine 'what the business is'.",
            "You need a heavy-weight engineering team, not contractors. If you need someone who will think through architecture trade-offs, push back when your decisions are technically weak, and then execute at handover-quality — that's our fit.",
            "You're available for decision making. Technology Partner projects will have many trade-off decisions along the way. Founders who are available for bi-weekly conversations and responsive to decision blockers — those are the ones that succeed.",
          ],
        ),
      },
      {
        _type: "contentSection",
        _key: k(),
        sectionType: "process-stages",
        heading: ls(
          "Empat tahap dari ide ke produk hidup.",
          "Four stages from idea to live product.",
        ),
        body: lrt(
          [
            "1. Discovery (1-2 minggu) — Kami masuk ke konteks bisnis Anda secara mendalam. Output: dokumen ringkas yang memuat scope, asumsi, dan trade-off awal yang sudah ter-align.",
            "2. Architecture Design (1-3 minggu) — Sebelum satu baris kode ditulis, kami susun cetak biru arsitektur. Output: dokumen arsitektur + estimasi build yang lebih akurat.",
            "3. Build (2-8 bulan, tergantung scope) — Eksekusi engineering dalam sprint dengan checkpoint mingguan dan demo dua-mingguan.",
            "4. Hand-off atau Continuation (2-4 minggu untuk hand-off) — Dua jalur mungkin setelah produk live: hand-off ke tim internal Anda, atau continuation dalam basis yang lebih ringan.",
          ],
          [
            "1. Discovery (1-2 weeks) — We go deep into your business context. Output: concise document with scope, assumptions, and aligned initial trade-offs.",
            "2. Architecture Design (1-3 weeks) — Before a line of code is written, we draft the architecture blueprint. Output: architecture document + more accurate build estimate.",
            "3. Build (2-8 months, depending on scope) — Engineering execution in sprints with weekly checkpoints and bi-weekly demos.",
            "4. Hand-off or Continuation (2-4 weeks for hand-off) — Two paths after the product is live: hand-off to your internal team, or continuation on a lighter basis.",
          ],
        ),
      },
      {
        _type: "contentSection",
        _key: k(),
        sectionType: "outcomes",
        heading: ls("Yang Anda bawa pulang.", "What you take home."),
        body: lrt(
          [
            "Produk hidup, bukan prototype yang masih perlu di-rebuild. Yang kami bangun dirancang untuk hidup dari hari pertama: arsitekturnya layak, kodenya readable, deploymentnya stabil.",
            "Arsitektur yang bisa di-handover. Setiap project meninggalkan dokumentasi arsitektur, ADR, dan README yang cukup untuk engineer baru memahami sistem dalam dua minggu.",
            "Engineering judgment yang ter-translate ke dokumen. Keputusan-keputusan teknis besar selalu terdokumentasi.",
            "Kemampuan untuk lanjut tanpa kami. Goal kami: meninggalkan project dalam kondisi di mana Anda bisa hire tim internal dan lanjut tanpa kami, kapan pun Anda mau.",
          ],
          [
            "A live product, not a prototype that needs rebuilding. What we build is designed to live from day one: sound architecture, readable code, stable deployment.",
            "Architecture that can be handed over. Every project leaves architecture documentation, ADRs, and a README sufficient for a new engineer to understand the system in two weeks.",
            "Engineering judgment translated into documentation. Major technical decisions are always documented.",
            "The ability to continue without us. Our goal: leave the project in a state where you can hire an internal team and continue without us, whenever you want.",
          ],
        ),
      },
    ],
    faqs: [
      { _type: "reference", _ref: "faq-tp-01" },
      { _type: "reference", _ref: "faq-tp-02" },
      { _type: "reference", _ref: "faq-tp-03" },
      { _type: "reference", _ref: "faq-tp-04" },
      { _type: "reference", _ref: "faq-tp-05" },
      { _type: "reference", _ref: "faq-tp-06" },
    ],
    finalCtaHeading: ls(
      "Kalau model ini sesuai dengan situasi Anda—",
      "If this model fits your situation—",
    ),
    finalCtaBody: lt(
      "Diskusi awal 30 menit, gratis dan tanpa kewajiban. Kami akan tanya tentang visi Anda dan konteks bisnis, dan Anda bisa tanya apa pun ke kami. Setelah itu, kalau ada fit potensial, kami akan kirim proposal dalam 1-2 minggu.",
      "A 30-minute initial discussion, free and without obligation. We'll ask about your vision and business context, and you can ask us anything. After that, if there's potential fit, we'll send a proposal within 1-2 weeks.",
    ),
    seo: {
      title: ls(
        "Technology Partner — Bangun Produk Anda dari Nol | Dartstudio",
        "Technology Partner — Build Your Product from Scratch | Dartstudio",
      ),
      description: ls(
        "Dari ide ke produk hidup. Kami jadi partner teknologi penuh — engineering, arsitektur, dan keputusan teknis besar lainnya jadi tanggung jawab kami. 3-9 bulan, output siap di-handover.",
        "From idea to live product. We become your full technology partner — engineering, architecture, and major technical decisions become our responsibility. 3-9 months, handover-ready output.",
      ),
    },
  });

  // Architecture Consultant
  await upsert({
    _id: "cm-architecture-consultant",
    _type: "collaborateModel",
    modelKey: "architecture-consultant",
    displayOrder: 2,
    name: ls("Architecture Consultant", "Architecture Consultant"),
    shortDescriptor: ls(
      "Untuk Anda yang punya sistem yang mulai retak",
      "For those with systems starting to crack",
    ),
    heroHeading: ls(
      "Sistem Anda jalan. Tapi setiap deploy terasa seperti acara doa bersama.",
      "Your system runs. But every deploy feels like a prayer session.",
    ),
    heroSubheading: lt(
      "Kami audit, bedah, dan susun ulang arsitektur sistem yang sudah mulai retak — supaya tim Anda bisa kembali deploy tanpa drama, dan bisnis Anda kembali bisa diubah dengan biaya yang masuk akal.",
      "We audit, dissect, and restructure the architecture of systems that have started to crack — so your team can deploy without drama again, and your business can be changed at a reasonable cost.",
    ),
    ctaPrimary: cta("Minta Diskusi Audit", "Request Audit Discussion", "/contact", "primary"),
    ctaSecondary: cta(
      "Lihat Apa yang Kami Lakukan",
      "See What We Do",
      "/studio#how-we-work",
      "secondary",
    ),
    sections: [
      {
        _type: "contentSection",
        _key: k(),
        sectionType: "checklist",
        heading: ls(
          "Tanda Anda mungkin butuh bicara dengan kami.",
          "Signs you might need to talk to us.",
        ),
        body: lrt(
          [
            "Onboarding engineer baru butuh lebih dari dua bulan sebelum mereka benar-benar produktif.",
            "Setiap perubahan kecil di satu modul memicu bug di tempat lain yang nggak nyangka.",
            "Deployment butuh maintenance window panjang, dan setiap orang menahan napas saat tombolnya ditekan.",
            "Hanya satu atau dua orang di tim yang benar-benar 'ngerti' sistem ini secara utuh.",
            "Vendor atau engineer pertama yang membangun sistem ini sudah tidak bisa dihubungi.",
            "Roadmap product selalu meleset dari estimasi engineering, sering kali lebih dari 2x lipat.",
            "Penambahan fitur sederhana butuh diskusi panjang yang kesimpulannya: 'ini nggak gampang.'",
          ],
          [
            "Onboarding new engineers takes more than two months before they're truly productive.",
            "Every small change in one module triggers unexpected bugs elsewhere.",
            "Deployments require long maintenance windows, and everyone holds their breath when the button is pressed.",
            "Only one or two people on the team truly 'understand' the system in full.",
            "The vendor or engineer who originally built the system can no longer be reached.",
            "Product roadmap consistently misses engineering estimates, often by more than 2x.",
            "Adding a simple feature requires long discussions that conclude: 'this isn't easy.'",
          ],
        ),
      },
      {
        _type: "contentSection",
        _key: k(),
        sectionType: "process-stages",
        heading: ls("Tiga tahap. Tanpa drama.", "Three stages. No drama."),
        body: lrt(
          [
            "1. Diagnose (1-2 minggu) — Kami masuk ke codebase, infrastruktur, dan dokumentasi yang ada. Output: laporan diagnosis yang jujur. Apa yang sehat, apa yang sakit, apa yang sudah waktunya dibongkar.",
            "2. Document (1-2 minggu) — Diagram arsitektur saat ini, alur dependensi, ADR untuk keputusan-keputusan penting yang selama ini tidak tercatat. Output: dokumentasi yang bisa dipakai tim Anda untuk menjelaskan sistem ke siapa pun.",
            "3. Recommend (1 minggu) — Rekomendasi yang berperingkat: apa yang harus diperbaiki sekarang (urgent), 3-6 bulan ke depan (strategic), dan apa yang bisa ditunda (intentional debt). Setiap rekomendasi datang dengan estimasi effort dan trade-off yang jelas.",
          ],
          [
            "1. Diagnose (1-2 weeks) — We go into the codebase, infrastructure, and existing documentation. Output: an honest diagnosis report. What's healthy, what's sick, what needs to be dismantled.",
            "2. Document (1-2 weeks) — Current architecture diagrams, dependency flows, ADRs for important decisions that were never recorded. Output: documentation your team can use to explain the system to anyone.",
            "3. Recommend (1 week) — Ranked recommendations: what to fix now (urgent), 3-6 months out (strategic), and what can wait (intentional debt). Every recommendation comes with an effort estimate and clear trade-offs.",
          ],
        ),
      },
      {
        _type: "contentSection",
        _key: k(),
        sectionType: "engagement-models",
        heading: ls(
          "Tiga cara bekerja, tergantung kondisi Anda.",
          "Three ways to engage, depending on your situation.",
        ),
        body: lrt(
          [
            "Audit Only (4-6 minggu) — Diagnose + Document + Recommend. Setelah itu kami serahkan ke tim Anda untuk eksekusi. Cocok kalau Anda punya tim engineering yang capable, dan hanya butuh peta yang jelas.",
            "Audit + Refactor (3-6 bulan) — Audit dilanjut dengan eksekusi langsung untuk bagian-bagian yang urgent. Kami bekerja side-by-side dengan tim internal Anda.",
            "Embedded Architecture Partnership (6 bulan+) — Salah satu arsitek senior kami terlibat sebagai bagian dari tim Anda dalam basis part-time. Bukan eksekusi day-to-day, tapi terlibat di setiap keputusan teknis besar.",
          ],
          [
            "Audit Only (4-6 weeks) — Diagnose + Document + Recommend. Then we hand over to your team for execution. Right for teams with capable engineers who just need a clear map.",
            "Audit + Refactor (3-6 months) — Audit followed by direct execution on the urgent parts. We work side-by-side with your internal team.",
            "Embedded Architecture Partnership (6+ months) — One of our senior architects is involved as part of your team on a part-time basis. Not day-to-day execution, but involved in every major technical decision.",
          ],
        ),
      },
    ],
    faqs: [
      { _type: "reference", _ref: "faq-ac-01" },
      { _type: "reference", _ref: "faq-ac-02" },
      { _type: "reference", _ref: "faq-ac-03" },
      { _type: "reference", _ref: "faq-ac-04" },
      { _type: "reference", _ref: "faq-ac-05" },
    ],
    finalCtaHeading: ls(
      "Kalau Anda baca sampai sini, kemungkinan ini saatnya bicara.",
      "If you've read this far, it's probably time to talk.",
    ),
    finalCtaBody: lt(
      "Diskusi awal 30 menit, gratis dan tanpa kewajiban. Kami akan tanya beberapa hal tentang sistem Anda untuk memahami konteks, dan Anda bisa tanya apa pun ke kami. Kalau ternyata tidak cocok, kami akan bilang.",
      "A 30-minute initial discussion, free and without obligation. We'll ask a few things about your system to understand the context, and you can ask us anything. If it's not a fit, we'll say so.",
    ),
    seo: {
      title: ls(
        "Architecture Consultant — Audit & Refactor Sistem | Dartstudio",
        "Architecture Consultant — System Audit & Refactor | Dartstudio",
      ),
      description: ls(
        "Sistem Anda jalan tapi sudah mulai retak? Kami audit arsitektur, mendokumentasikan keputusan teknis, dan menyusun rekomendasi yang bisa dieksekusi. 4-6 minggu, output konkret.",
        "Your system runs but is starting to crack? We audit the architecture, document technical decisions, and compile actionable recommendations. 4-6 weeks, concrete output.",
      ),
    },
  });

  // Strategic Investor
  await upsert({
    _id: "cm-strategic-investor",
    _type: "collaborateModel",
    modelKey: "strategic-investor",
    displayOrder: 3,
    name: ls("Strategic Investor", "Strategic Investor"),
    shortDescriptor: ls(
      "Tech-for-equity, untuk yang sejalan dengan standar kami",
      "Tech-for-equity, for those aligned with our standards",
    ),
    heroHeading: ls(
      "Tech-for-equity. Untuk ide yang sejalan dengan standar kami.",
      "Tech-for-equity. For ideas aligned with our standards.",
    ),
    heroSubheading: lt(
      "Kami berinvestasi dalam bentuk eksekusi engineering kelas berat, bukan cek. Untuk founder dengan visi tajam yang nilai pasangan kami terutama dari engineering judgment yang kami bawa — kami terbuka untuk percakapan.",
      "We invest in the form of heavy-weight engineering execution, not checks. For founders with a sharp vision who value us primarily for the engineering judgment we bring — we're open to a conversation.",
    ),
    ctaPrimary: cta("Pitch Ide Anda", "Pitch Your Idea", "/contact", "primary"),
    ctaSecondary: cta(
      "Lihat Kriteria Kami",
      "See Our Criteria",
      "/collaborate/strategic-investor#criteria",
      "secondary",
    ),
    sections: [
      {
        _type: "contentSection",
        _key: k(),
        sectionType: "generic",
        heading: ls("Bagaimana model ini bekerja.", "How this model works."),
        body: lrt(
          [
            "Strategic Investor adalah model kami yang paling tidak konvensional, dan paling jarang kami jalankan. Setiap tahun, jumlah engagement aktif di kategori ini kami batasi — biasanya tidak lebih dari satu atau dua tambahan.",
            "Cara kerjanya sederhana di permukaan: alih-alih kami menulis cek untuk Anda, kami membawa engineering, arsitektur, dan judgment teknis untuk membangun produk Anda. Sebagai gantinya, kami menerima equity stake yang dinegosiasikan per case.",
            "Ini bukan 'discounted services in exchange for equity'. Equity stake yang kami terima mencerminkan nilai yang sama dengan partner teknologi yang punya skin in the game.",
          ],
          [
            "Strategic Investor is our most unconventional model, and the least frequently run. Each year, we limit the number of active engagements in this category — usually no more than one or two additions.",
            "The mechanics are simple on the surface: instead of writing you a check, we bring engineering, architecture, and technical judgment to build your product. In return, we receive an equity stake negotiated per case.",
            "This isn't 'discounted services in exchange for equity'. The equity stake we receive reflects the same value as a technology partner with skin in the game.",
          ],
        ),
      },
      {
        _type: "contentSection",
        _key: k(),
        sectionType: "generic",
        heading: ls("Yang membuat kami tertarik.", "What makes us interested."),
        body: lrt(
          [
            "Domain yang menarik untuk kami sendiri. Area yang termasuk: AI/ML applications dengan use case bisnis yang konkret, infrastructure & developer tools, vertical SaaS dengan kompleksitas data atau workflow yang menarik, B2B fintech atau adjacent.",
            "Founder yang kuat secara domain. Anda paham bisnis Anda dengan kedalaman yang sulit ditiru. Anda sudah pernah di industri itu, atau sudah menjalani journey customer-discovery yang serius.",
            "Hipotesis bisnis yang tajam. Anda tidak perlu sudah punya traction lengkap. Tapi Anda harus punya pemahaman yang spesifik tentang siapa customer Anda, masalah apa yang Anda selesaikan, dan kenapa solusi Anda berbeda.",
            "Kebutuhan engineering yang substantif. Model ini hanya masuk akal kalau produk Anda butuh engineering judgment yang serious.",
          ],
          [
            "A domain that interests us. Areas include: AI/ML applications with concrete business use cases, infrastructure & developer tools, vertical SaaS with interesting data or workflow complexity, B2B fintech or adjacent.",
            "A founder who's strong in their domain. You understand your business with a depth that's hard to replicate. You've been in the industry, or you've done serious customer-discovery work.",
            "A sharp business hypothesis. You don't need full traction. But you need a specific understanding of who your customer is, what problem you're solving, and why your solution is different.",
            "Substantive engineering needs. This model only makes sense if your product requires serious engineering judgment.",
          ],
        ),
      },
      {
        _type: "contentSection",
        _key: k(),
        sectionType: "what-we-avoid",
        heading: ls("Yang akan membuat kami tidak lanjut.", "What will make us not proceed."),
        body: lrt(
          [
            "Founder yang sulit dipush back. Equity partnership bukan service relationship — kami akan banyak push back secara teknis, strategis, dan kadang soal product.",
            "Bisnis yang ekonomi-nya belum jelas. Kami tidak akan ambil equity di model bisnis yang tidak punya path to revenue yang masuk akal.",
            "Founder yang relasi utamanya transaksional. Kalau di percakapan awal terasa bahwa Anda menilai kami berdasarkan 'berapa banyak yang bisa saya dapat dengan biaya seminim mungkin' — sinyal itu biasanya cukup.",
          ],
          [
            "Founders who are hard to push back on. Equity partnership isn't a service relationship — we'll push back a lot technically, strategically, and sometimes on product.",
            "Businesses with unclear economics. We won't take equity in a business model without a sensible path to revenue.",
            "Founders whose primary relationship is transactional. If in the initial conversation it feels like you're evaluating us based on 'how much can I get for the least cost' — that signal is usually enough.",
          ],
        ),
      },
      {
        _type: "contentSection",
        _key: k(),
        sectionType: "selection-process",
        heading: ls("Bagaimana kami memutuskan.", "How we decide."),
        body: lrt(
          [
            "1. First Conversation (1 percakapan, 60-90 menit) — Pitch ide Anda. Kami biasanya tahu dalam minggu setelahnya apakah ada fit potensial untuk lanjut.",
            "2. Deep Dive (2-4 minggu) — Kami pelajari domain Anda lebih dalam. Anda boleh dan didorong untuk berbicara dengan klien atau partner kami sebelumnya.",
            "3. Term & Decision (2-3 minggu) — Negosiasi equity stake, commitment level, milestone, exit clauses. Formalisasi legal biasanya 2-4 minggu tambahan.",
            "Total dari first contact ke partnership formal: biasanya 8-12 minggu. Itu juga sengaja. Komitmen multi-year yang dibuat tergesa-gesa biasanya tidak bertahan.",
          ],
          [
            "1. First Conversation (1 conversation, 60-90 min) — Pitch your idea. We usually know within the following week whether there's potential fit to continue.",
            "2. Deep Dive (2-4 weeks) — We study your domain more deeply. You're allowed and encouraged to speak with our previous clients or partners.",
            "3. Term & Decision (2-3 weeks) — Negotiate equity stake, commitment level, milestones, exit clauses. Legal formalization typically takes 2-4 additional weeks.",
            "Total from first contact to formal partnership: typically 8-12 weeks. That's also intentional. Multi-year commitments made in haste usually don't last.",
          ],
        ),
      },
    ],
    faqs: [
      { _type: "reference", _ref: "faq-si-01" },
      { _type: "reference", _ref: "faq-si-02" },
      { _type: "reference", _ref: "faq-si-03" },
    ],
    finalCtaHeading: ls(
      "Kalau Anda baca sampai sini dan masih merasa fit—",
      "If you've read this far and still feel like a fit—",
    ),
    finalCtaBody: lt(
      "Pitch Anda tidak harus polished. Yang penting: ceritakan bisnis Anda, kenapa Anda yang ngerjain ini, dan kenapa Anda pikir kami mungkin partner yang tepat. Kami merespon semua inquiry di kategori ini secara personal, biasanya dalam 1 minggu kerja.",
      "Your pitch doesn't need to be polished. What matters: tell us about your business, why you're the one doing this, and why you think we might be the right partner. We respond to all inquiries in this category personally, typically within 1 business week.",
    ),
    seo: {
      title: ls(
        "Strategic Investor — Tech-for-Equity Partnership | Dartstudio",
        "Strategic Investor — Tech-for-Equity Partnership | Dartstudio",
      ),
      description: ls(
        "Untuk founder dengan visi tajam, kami berinvestasi dalam bentuk eksekusi engineering kelas berat — bukan uang. Model selektif dengan komitmen multi-year. Lihat kriteria kami.",
        "For founders with sharp vision, we invest in the form of heavy-weight engineering execution — not money. Selective model with multi-year commitment. See our criteria.",
      ),
    },
  });
}

// ─── 5. PAGES ─────────────────────────────────────────────────────────────────

async function seedPages() {
  console.log("\n[page]");

  // Homepage
  await upsert({
    _id: "page-home",
    _type: "page",
    pageKey: "home",
    title: "Homepage",
    heroHeading: ls(
      "Studio kecil. Sistem yang nggak akan bikin Anda nyesel 2 tahun lagi.",
      "Small studio. Systems you won't regret in two years.",
    ),
    heroSubheading: lt(
      "Kami veteran teknologi yang sudah belasan tahun memperbaiki sistem yang dirakit terburu-buru. Sekarang kami bangun produk sendiri — dan sesekali, untuk satu-dua rekan yang serius.",
      "We're technology veterans who have spent years fixing systems built in a hurry. Now we build our own products — and occasionally, for one or two serious collaborators.",
    ),
    ctaPrimary: cta("Lihat Produk Kami", "See Our Products", "/products", "primary"),
    ctaSecondary: cta("Mulai Percakapan", "Start a Conversation", "/contact", "secondary"),
    sections: [
      {
        _type: "pageSection",
        _key: k(),
        sectionType: "credibility-bar",
        heading: ls("Bukan klaim. Konteks.", "Not claims. Context."),
        body: lrt(
          [
            "Tim kami pernah jadi engineer di startup yang sekarang unicorn. Pernah arsitek backend di korporat yang sistemnya dipakai jutaan orang. Pernah konsultan untuk perusahaan yang sistemnya selalu down setiap kuartalan tutup buku.",
            "Kami sudah cukup lama untuk pernah membangun yang salah, dan cukup pernah memperbaikinya untuk tahu bedanya.",
          ],
          [
            "Our team has been engineers at startups that are now unicorns. Backend architects at corporations whose systems are used by millions. Consultants for companies whose systems crashed every quarterly close.",
            "We've been around long enough to have built things wrong, and fixed them enough times to know the difference.",
          ],
        ),
      },
      {
        _type: "pageSection",
        _key: k(),
        sectionType: "origin",
        heading: ls("Di Balik Dartstudio.", "Behind Dartstudio."),
        body: lrt(
          [
            "Kami bukan software house. Nggak ada tim sales, nggak ada pitch deck siap pakai, dan kami nggak akan mengejar Anda di LinkedIn.",
            "Yang ada di Dartstudio: orang-orang yang sudah lama ngulik infrastruktur, arsitektur backend, UI/UX, data engineering, machine learning, sampai digital marketing. Beberapa dari agensi. Beberapa dari vendor. Beberapa dari korporat — yang sambil bekerja, diam-diam mengutuk sistem warisan yang mereka rawat.",
            "Kami semua pindah ke sini karena alasan yang sama: ingin membangun sesuatu dengan standar sendiri, di studio kecil, tanpa kompromi.",
          ],
          [
            "We're not a software house. There's no sales team, no ready-made pitch deck, and we won't chase you on LinkedIn.",
            "At Dartstudio: people who've spent years digging into infrastructure, backend architecture, UI/UX, data engineering, machine learning, and digital marketing. Some from agencies. Some from vendors. Some from corporates — who, while working, quietly cursed the legacy systems they maintained.",
            "We all moved here for the same reason: to build something by our own standards, in a small studio, without compromise.",
          ],
        ),
      },
      {
        _type: "pageSection",
        _key: k(),
        sectionType: "the-problem",
        heading: ls(
          "Aplikasi Anda jalan. Pertanyaannya: berapa lama lagi sebelum dia mahal untuk diubah?",
          "Your app runs. The question is: how long before it becomes expensive to change?",
        ),
        body: lrt(
          [
            "Membangun aplikasi sekarang murah dan cepat. AI menulis kode, agent merakit fitur, demo-nya lancar.",
            "Masalahnya datang belakangan. Saat bisnis Anda butuh fitur baru, atau migrasi, atau sekadar mengganti komponen lama — dan ternyata semua bagian saling terkunci satu sama lain. Setiap perubahan kecil memicu efek domino. Engineer baru butuh tiga bulan untuk paham. Vendor sebelumnya sudah tidak bisa dihubungi.",
            "Ini bukan masalah teknis. Ini masalah bisnis yang berakar di keputusan teknis lama yang tidak dipertanyakan.",
          ],
          [
            "Building apps is now cheap and fast. AI writes code, agents assemble features, demos run smoothly.",
            "The problem comes later. When your business needs a new feature, a migration, or just to replace an old component — and it turns out all the parts are locked together. Every small change triggers a cascade. New engineers need three months to understand. The previous vendor can no longer be reached.",
            "This isn't a technical problem. It's a business problem rooted in old technical decisions that were never questioned.",
          ],
        ),
      },
      {
        _type: "pageSection",
        _key: k(),
        sectionType: "three-ways",
        heading: ls(
          "Tiga cara kerja, kalau visinya cocok.",
          "Three ways to work, if the vision fits.",
        ),
        body: lrt(
          [
            "Karena fokus utama kami produk sendiri, kami pilih-pilih rekan. Bukan soal angkuh — kami sudah pernah ambil semua proyek di hidup sebelumnya, dan tahu apa yang terjadi pada kualitas.",
            "Technology Partner — Anda punya visi yang tajam tapi belum ada produknya. Kami eksekusi dari nol.",
            "Architecture Consultant — Sistem Anda sudah jalan tapi sudah mulai retak. Kami audit, bongkar bagian yang harus dibongkar, dan susun ulang.",
            "Strategic Investor — Tech-for-equity. Untuk ide yang sejalan dengan standar kami, kami berinvestasi dalam bentuk eksekusi.",
          ],
          [
            "Because our primary focus is our own products, we're selective about collaborators. Not arrogance — we've taken every project in our previous lives, and know what happens to quality.",
            "Technology Partner — You have a sharp vision but no product yet. We execute from scratch.",
            "Architecture Consultant — Your system runs but is starting to crack. We audit, dismantle what needs dismantling, and restructure.",
            "Strategic Investor — Tech-for-equity. For ideas aligned with our standards, we invest in the form of execution.",
          ],
        ),
      },
      {
        _type: "pageSection",
        _key: k(),
        sectionType: "final-cta",
        heading: ls("Studio kecil. Standar yang tidak.", "Small studio. Standards that aren't."),
        body: lrt(
          [
            "Kalau Anda mencari yang tercepat dan termurah, dengan hormat — kami bukan jawabannya.",
            "Kalau Anda menginginkan presisi di setiap baris kode dan di setiap keputusan arsitektur, kita mungkin punya banyak hal untuk dibicarakan.",
          ],
          [
            "If you're looking for the fastest and cheapest, with respect — we're not the answer.",
            "If you want precision in every line of code and every architecture decision, we might have a lot to talk about.",
          ],
        ),
      },
    ],
    seo: {
      title: ls(
        "Dartstudio — Studio Teknologi Veteran untuk Sistem yang Bertahan",
        "Dartstudio — Veteran Technology Studio for Systems That Last",
      ),
      description: ls(
        "Studio kecil berisi veteran teknologi. Kami bangun produk sendiri, dan sesekali jadi technology partner, architecture consultant, atau tech-for-equity investor untuk rekan yang serius.",
        "A small studio of technology veterans. We build our own products, and occasionally become a technology partner, architecture consultant, or tech-for-equity investor for serious collaborators.",
      ),
    },
  });

  // Studio page
  await upsert({
    _id: "page-studio",
    _type: "page",
    pageKey: "studio",
    title: "Studio",
    heroHeading: ls("Studio kecil. Standar yang tidak.", "Small studio. Standards that aren't."),
    heroSubheading: lt(
      "Dartstudio adalah rumah bagi sekelompok veteran teknologi yang memutuskan, setelah bertahun-tahun di tempat lain, untuk membangun sesuatu dengan caranya sendiri.",
      "Dartstudio is home to a group of technology veterans who decided, after years elsewhere, to build something their own way.",
    ),
    sections: [
      {
        _type: "pageSection",
        _key: k(),
        sectionType: "origin",
        heading: ls("Bagaimana Dartstudio terbentuk.", "How Dartstudio was formed."),
        body: lrt(
          [
            "Kami semua datang dari tempat yang berbeda, tapi cerita kami terdengar mirip.",
            "Beberapa dari kami pernah bekerja di agensi — di mana kualitas selalu jadi negosiasi melawan deadline, dan setiap project hampir selalu berakhir dengan teknis debt yang ditinggal untuk siapa pun yang akan menjaga setelahnya. Sebagian pernah jadi engineer atau arsitek di vendor besar, melihat dari dekat bagaimana sistem berskala besar dirakit — dan kadang dirakit secara terburu-buru. Beberapa lain pernah di korporat: jadi karyawan yang tugasnya menjaga warisan sistem dari belasan tahun keputusan teknis yang tidak pernah dipertanyakan.",
            "Di setiap tempat itu, kami sampai di kesimpulan yang sama: kami capek menjadi orang yang membersihkan kekacauan orang lain.",
            "Dartstudio lahir dari pertanyaan yang lebih sederhana: bagaimana kalau kita tetap kecil? Tidak scale headcount. Tidak chase clients. Hanya sekelompok orang yang serius soal sistem, fokus membangun produk sendiri, dan sesekali — kalau visinya cocok — terbuka untuk bekerja sama dengan rekan yang tepat.",
            "Sudah beberapa tahun sejak itu. Kami masih kecil. Itu disengaja.",
          ],
          [
            "We all come from different places, but our stories sound similar.",
            "Some of us worked at agencies — where quality was always negotiated against deadlines, and every project almost always ended with technical debt left for whoever came next. Some were engineers or architects at large vendors, watching up close how large-scale systems were assembled — and sometimes assembled in a hurry. Others were at corporates: employees whose job was to maintain legacy systems built on years of unquestioned technical decisions.",
            "At every one of those places, we reached the same conclusion: we were tired of being the people who cleaned up other people's messes.",
            "Dartstudio was born from a simpler question: what if we stayed small? Don't scale headcount. Don't chase clients. Just a group of people serious about systems, focused on building their own products, and occasionally — if the vision fits — open to working with the right collaborators.",
            "It's been a few years since then. We're still small. That's intentional.",
          ],
        ),
      },
      {
        _type: "pageSection",
        _key: k(),
        sectionType: "how-we-work",
        heading: ls("Cara kami bekerja.", "How we work."),
        body: lrt(
          [
            "Fokus, bukan multitasking. Kami tidak ambil banyak project paralel. Setiap engagement aktif dapat perhatian penuh dari orang yang ditugaskan, tanpa harus berbagi headspace dengan tiga klien lain.",
            "Async-first, tapi bukan async-only. Komunikasi tertulis adalah default kami — supaya keputusan punya jejak. Tapi untuk pemikiran kompleks, kami percaya pada percakapan langsung yang fokus. Weekly sync, dokumentasi keputusan, tidak ada surprise.",
            "Senior-led, di setiap engagement. Tidak ada 'junior engineer mengerjakan, senior review'. Project di Dartstudio dipimpin oleh orang yang sama yang masuk ke sales call awal. Anda bicara dengan yang ngerjakan.",
            "Honest about timeline. Kami tidak menjanjikan timeline yang kami tahu tidak realistis. Kalau project butuh tiga bulan, kami bilang tiga bulan.",
          ],
          [
            "Focus, not multitasking. We don't take on many parallel projects. Every active engagement gets the full attention of the assigned person, without having to share headspace with three other clients.",
            "Async-first, but not async-only. Written communication is our default — so decisions have a trail. But for complex thinking, we believe in focused direct conversation. Weekly syncs, decision documentation, no surprises.",
            "Senior-led, in every engagement. There's no 'junior engineer does it, senior reviews'. Projects at Dartstudio are led by the same person who joined the initial call. You talk to the ones doing the work.",
            "Honest about timeline. We don't promise timelines we know aren't realistic. If a project takes three months, we say three months.",
          ],
        ),
      },
    ],
    seo: {
      title: ls(
        "Studio — Tentang Dartstudio | Veteran Teknologi",
        "Studio — About Dartstudio | Technology Veterans",
      ),
      description: ls(
        "Dartstudio adalah studio kecil berisi veteran teknologi yang sengaja tetap kecil. Kenal cerita kami, orang-orang di baliknya, dan cara kami bekerja.",
        "Dartstudio is a small studio of technology veterans who deliberately stay small. Meet our story, the people behind it, and how we work.",
      ),
    },
  });

  // Studio Principles page
  await upsert({
    _id: "page-studio-principles",
    _type: "page",
    pageKey: "studio-principles",
    title: "Studio — Principles",
    heroHeading: ls(
      "Apa yang kami percaya soal membangun sistem.",
      "What we believe about building systems.",
    ),
    heroSubheading: lt(
      "Setiap studio engineering punya prinsip. Biasanya tidak ditulis, tidak dibicarakan, tapi terlihat dari kode yang mereka tinggalkan dan keputusan yang mereka ambil saat tidak ada yang melihat. Berikut yang kami pegang di Dartstudio. Bukan aspirasi — ini standar minimum.",
      "Every engineering studio has principles. Usually unwritten, unspoken, but visible in the code they leave behind and the decisions they make when no one is watching. Here's what we hold at Dartstudio. Not aspirations — these are minimum standards.",
    ),
    seo: {
      title: ls(
        "Prinsip — Dartstudio | Apa yang Kami Percaya",
        "Principles — Dartstudio | What We Believe",
      ),
      description: ls(
        "Tujuh prinsip engineering yang kami pegang sebagai standar minimum, bukan aspirasi. Tentang arsitektur, kompleksitas, dependensi, dan kesederhanaan.",
        "Seven engineering principles we hold as minimum standards, not aspirations. About architecture, complexity, dependencies, and simplicity.",
      ),
    },
  });

  // Collaborate hub
  await upsert({
    _id: "page-collaborate",
    _type: "page",
    pageKey: "collaborate",
    title: "Collaborate Hub",
    heroHeading: ls(
      "Tiga cara bekerja dengan kami. Kalau visinya cocok.",
      "Three ways to work with us. If the vision fits.",
    ),
    heroSubheading: lt(
      "Karena fokus utama kami produk sendiri, kami pilih-pilih rekan. Bukan soal angkuh — kami sudah pernah ambil semua proyek di hidup sebelumnya, dan tahu apa yang terjadi pada kualitas saat orang merasa harus menerima semua pekerjaan.",
      "Because our primary focus is our own products, we're selective about collaborators. Not arrogance — we've taken every project in our previous lives, and know what happens to quality when people feel they must accept all work.",
    ),
    sections: [
      {
        _type: "pageSection",
        _key: k(),
        sectionType: "generic",
        heading: ls("Belum yakin yang mana?", "Not sure which one?"),
        body: lrt(
          [
            "Kalau Anda belum punya produk sama sekali, dan ide masih di kepala Anda atau di dokumen Notion → mulai dari Technology Partner.",
            "Kalau Anda punya produk yang jalan tapi sudah bermasalah secara teknis → Architecture Consultant dulu. Audit kami akan kasih konteks sebelum membuat keputusan apa pun yang lebih besar.",
            "Kalau Anda punya ide besar tapi terbatas di kapital, dan yakin nilai kami datang dari engineering judgment yang kami bawa → Strategic Investor mungkin masuk akal. Tapi siapkan diri untuk filter ketat.",
            "Kalau Anda bingung antara dua model, hubungi kami langsung. Diskusi 30 menit biasanya cukup untuk mengarahkan.",
          ],
          [
            "If you don't have a product at all yet, and the idea is still in your head or a Notion doc → start with Technology Partner.",
            "If you have a running product that's having technical problems → Architecture Consultant first. Our audit will give context before making any bigger decisions.",
            "If you have a big idea but limited capital, and you believe our value comes primarily from the engineering judgment we bring → Strategic Investor might make sense. But be prepared for a rigorous filter.",
            "If you're torn between two models, contact us directly. A 30-minute discussion is usually enough to direct you.",
          ],
        ),
      },
    ],
    seo: {
      title: ls(
        "Cara Bekerja dengan Dartstudio — Tech Partner, Architecture Consultant, atau Tech-for-Equity",
        "Work with Dartstudio — Tech Partner, Architecture Consultant, or Tech-for-Equity",
      ),
      description: ls(
        "Tiga model kolaborasi: Technology Partner untuk bangun produk dari nol, Architecture Consultant untuk audit sistem, Strategic Investor untuk tech-for-equity. Pilih yang paling cocok dengan situasi Anda.",
        "Three collaboration models: Technology Partner to build products from scratch, Architecture Consultant for system audits, Strategic Investor for tech-for-equity. Choose what fits your situation best.",
      ),
    },
  });
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Starting Dartstudio content seed...");
  console.log(`Project: ${PROJECT_ID} / ${DATASET}\n`);

  await seedSiteSettings();
  await seedJournalCategories();
  await seedFaqs();
  await seedCollaborateModels();
  await seedPages();

  console.log("\n✅ Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
