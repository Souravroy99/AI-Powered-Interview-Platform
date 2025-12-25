import { z } from "zod";

export const mappings = {
  /* ================= Frontend Frameworks ================= */
  "react.js": "react",
  reactjs: "react",
  react: "react",

  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",

  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",

  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",

  "svelte.js": "svelte",
  sveltejs: "svelte",
  svelte: "svelte",

  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",

  "solid.js": "solidjs",
  solidjs: "solidjs",
  solid: "solidjs",

  /* ================= Backend Frameworks ================= */
  "express.js": "express",
  expressjs: "express",
  express: "express",

  nestjs: "nestjs",
  "nest.js": "nestjs",

  fastify: "fastify",
  koa: "koa",

  django: "django",
  "django-rest": "django-rest",

  flask: "flask",
  fastapi: "fastapi",

  spring: "spring",
  "spring boot": "spring-boot",
  springboot: "spring-boot",

  laravel: "laravel",
  symfony: "symfony",

  rails: "rails",
  "ruby on rails": "rails",

  /* ================= Runtime & Languages ================= */
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",

  javascript: "javascript",
  js: "javascript",

  typescript: "typescript",
  ts: "typescript",

  python: "python",
  py: "python",

  java: "java",
  kotlin: "kotlin",

  c: "c",
  "c++": "cpp",
  cpp: "cpp",

  "c#": "csharp",
  csharp: "csharp",

  go: "golang",
  golang: "golang",

  rust: "rust",
  php: "php",
  ruby: "ruby",

  /* ================= .NET Ecosystem ================= */
  ".net": "dotnet",
  "dot net": "dotnet",
  dotnet: "dotnet",

  "asp.net": "aspnet",
  aspnet: "aspnet",
  "asp.net core": "aspnet-core",
  aspnetcore: "aspnet-core",

  csharp: "csharp",
  "c#": "csharp",

  blazor: "blazor",
  maui: "dotnet-maui",
  ".net maui": "dotnet-maui",

  /* ================= Databases ================= */
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",

  mysql: "mysql",
  postgresql: "postgresql",
  postgres: "postgresql",

  sqlite: "sqlite",

  redis: "redis",
  cassandra: "cassandra",
  couchdb: "couchdb",

  dynamodb: "dynamodb",
  firestore: "firestore",

  supabase: "supabase",
  planetscale: "planetscale",

  /* ================= ORMs & Query ================= */
  prisma: "prisma",
  sequelize: "sequelize",
  typeorm: "typeorm",
  drizzle: "drizzle",

  knex: "knex",

  /* ================= API & Data ================= */
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",

  rest: "rest",
  "rest api": "rest",

  trpc: "trpc",

  /* ================= Styling ================= */
  html5: "html5",
  html: "html5",

  css3: "css3",
  css: "css3",

  sass: "sass",
  scss: "sass",
  less: "less",

  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",

  bootstrap: "bootstrap",
  materialui: "mui",
  mui: "mui",

  chakraui: "chakraui",
  antd: "antd",

  /* ================= State Management ================= */
  redux: "redux",
  reduxjs: "redux",

  recoil: "recoil",
  zustand: "zustand",
  jotai: "jotai",

  vuex: "vuex",
  pinia: "pinia",

  /* ================= Testing ================= */
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",

  cypress: "cypress",
  playwright: "playwright",
  selenium: "selenium",

  vitest: "vitest",

  /* ================= DevOps & Cloud ================= */
  docker: "docker",
  kubernetes: "kubernetes",
  k8s: "kubernetes",

  aws: "aws",
  "amazon web services": "aws",

  azure: "azure",
  gcp: "gcp",

  digitalocean: "digitalocean",
  heroku: "heroku",

  netlify: "netlify",
  vercel: "vercel",

  "aws amplify": "amplify",

  terraform: "terraform",
  ansible: "ansible",

  /* ================= CI/CD ================= */
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",

  "github actions": "github-actions",
  jenkins: "jenkins",
  circleci: "circleci",

  /* ================= Build Tools ================= */
  webpack: "webpack",
  babel: "babel",

  rollup: "rollup",
  parcel: "parcel",
  vite: "vite",

  npm: "npm",
  yarn: "yarn",
  pnpm: "pnpm",

  /* ================= Mobile ================= */
  reactnative: "react-native",
  "react native": "react-native",

  flutter: "flutter",
  dart: "dart",

  swift: "swift",
  ios: "ios",

  android: "android",

  /* ================= AI / ML ================= */
  tensorflow: "tensorflow",
  pytorch: "pytorch",
  keras: "keras",

  opencv: "opencv",

  langchain: "langchain",
  openai: "openai",

  huggingface: "huggingface",

  /* ================= CMS ================= */
  wordpress: "wordpress",
  strapi: "strapi",
  contentful: "contentful",
  sanity: "sanity",

  /* ================= Design ================= */
  figma: "figma",
  sketch: "sketch",

  photoshop: "photoshop",
  "adobe photoshop": "photoshop",

  illustrator: "illustrator",
  xd: "adobe-xd",
}; 

export const interviewer = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate’s questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.


- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];