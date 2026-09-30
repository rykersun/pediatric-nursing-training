import type { Route } from "next";

export type LocalizedText = { zh: string; en: string };
export type StepKind = "intro" | "vh" | "scenario360" | "results";
export type VirtiModuleType = "virtual-human" | "interactive-video" | "360-scenario";

export interface JourneyStepConfig {
  step: number;
  slug: string;
  kind: StepKind;
  route: Route;
  title: LocalizedText;
  shortTitle: LocalizedText;
  description: LocalizedText;
  learningObjectives: LocalizedText[];
  virti: {
    moduleType: VirtiModuleType;
    embedId: string | null;
    character?: { name: LocalizedText; role: LocalizedText };
    scenarioNote: LocalizedText;
  };
  estimatedMinutes: number;
}

export const JOURNEY_STEPS: readonly JourneyStepConfig[] = [
  {
    step: 1,
    slug: "introduction",
    kind: "intro",
    route: "/journey/step/1",
    title: {
      zh: "課程介紹",
      en: "Course Introduction",
    },
    shortTitle: { zh: "介紹", en: "Intro" },
    description: {
      zh: "瞭解本課程的學習目標、臨床情境與安全原則。",
      en: "Learn the learning objectives, clinical scenario, and safety principles.",
    },
    learningObjectives: [
      {
        zh: "說明學齡期兒童注射前的準備與安全查核要點",
        en: "Describe pre-injection preparation and safety checks for pediatric patients.",
      },
      {
        zh: "辨識家長與病童的焦慮來源並給予適當回應",
        en: "Identify sources of anxiety in caregivers and children and respond appropriately.",
      },
      {
        zh: "整合溝通技巧與注射技術，完成以病童為中心的照護流程",
        en: "Integrate communication skills and injection technique in a child-centered care flow.",
      },
    ],
    virti: {
      moduleType: "interactive-video",
      embedId: null,
      scenarioNote: {
        zh: "本區塊將嵌入課程介紹影片。",
        en: "This area will host the course introduction video.",
      },
    },
    estimatedMinutes: 5,
  },
  {
    step: 2,
    slug: "mother-before",
    kind: "vh",
    route: "/journey/step/2",
    title: {
      zh: "注射前：與母親溝通",
      en: "Before Injection: Talk to the Mother",
    },
    shortTitle: { zh: "母親（前）", en: "Mother (Pre)" },
    description: {
      zh: "透過虛擬人練習注射前與家長建立信任、說明流程並取得同意。",
      en: "Practice pre-injection communication with a virtual mother to build trust, explain the procedure, and obtain consent.",
    },
    learningObjectives: [
      {
        zh: "使用同理心開啟對話",
        en: "Open the conversation with empathy.",
      },
      {
        zh: "清楚說明注射步驟與可能的不適",
        en: "Clearly explain the injection steps and possible discomfort.",
      },
      {
        zh: "回答家長疑慮並確認同意",
        en: "Address caregiver concerns and confirm consent.",
      },
    ],
    virti: {
      moduleType: "virtual-human",
      embedId: null,
      character: {
        name: { zh: "林媽媽", en: "Mrs. Lin" },
        role: { zh: "病童母親", en: "Mother of the pediatric patient" },
      },
      scenarioNote: {
        zh: "與母親討論注射前的準備與疑慮。",
        en: "Discuss pre-injection preparation and concerns with the mother.",
      },
    },
    estimatedMinutes: 10,
  },
  {
    step: 3,
    slug: "child",
    kind: "vh",
    route: "/journey/step/3",
    title: {
      zh: "安撫學齡期兒童並進行溝通",
      en: "Calm and Communicate with the Child",
    },
    shortTitle: { zh: "兒童", en: "Child" },
    description: {
      zh: "學習以適齡語言與安撫技巧，降低病童焦慮並取得合作。",
      en: "Learn age-appropriate language and calming techniques to reduce anxiety and gain cooperation.",
    },
    learningObjectives: [
      {
        zh: "使用適齡語言解釋注射過程",
        en: "Use age-appropriate language to explain the injection.",
      },
      {
        zh: "運用分心與呼吸技巧降低焦慮",
        en: "Use distraction and breathing techniques to reduce anxiety.",
      },
      {
        zh: "觀察病童反應並調整溝通策略",
        en: "Observe the child's reactions and adjust communication strategies.",
      },
    ],
    virti: {
      moduleType: "virtual-human",
      embedId: null,
      character: {
        name: { zh: "小宇", en: "Xiao-Yu" },
        role: { zh: "6 歲病童", en: "6-year-old pediatric patient" },
      },
      scenarioNote: {
        zh: "以溫和方式向學齡期兒童說明即將進行的注射。",
        en: "Gently explain the upcoming injection to the child.",
      },
    },
    estimatedMinutes: 10,
  },
  {
    step: 4,
    slug: "injection-360",
    kind: "scenario360",
    route: "/journey/step/4",
    title: {
      zh: "360 度互動注射情境",
      en: "360° Interactive Injection Scenario",
    },
    shortTitle: { zh: "360 情境", en: "360° Scenario" },
    description: {
      zh: "在 360 度互動環境中觀察臨床場景，練習注射決策與無菌技術。",
      en: "Observe a clinical scene in a 360° interactive environment and practice injection decisions and aseptic technique.",
    },
    learningObjectives: [
      {
        zh: "確認病人身分與藥品資訊",
        en: "Verify patient identity and medication information.",
      },
      {
        zh: "執行無菌注射技術",
        en: "Perform aseptic injection technique.",
      },
      {
        zh: "評估注射後立即反應與紀錄要點",
        en: "Assess immediate post-injection reactions and documentation needs.",
      },
    ],
    virti: {
      moduleType: "360-scenario",
      embedId: null,
      scenarioNote: {
        zh: "在 360 度病房環境中完成注射流程。",
        en: "Complete the injection workflow in a 360° patient room.",
      },
    },
    estimatedMinutes: 15,
  },
  {
    step: 5,
    slug: "mother-after",
    kind: "vh",
    route: "/journey/step/5",
    title: {
      zh: "注射後：與母親溝通",
      en: "After Injection: Talk to the Mother",
    },
    shortTitle: { zh: "母親（後）", en: "Mother (Post)" },
    description: {
      zh: "練習注射後向家長說明觀察事項、衛教與後續照護。",
      en: "Practice post-injection communication, including observation instructions, health education, and follow-up care.",
    },
    learningObjectives: [
      {
        zh: "說明注射後常見反應與觀察重點",
        en: "Explain common post-injection reactions and observation points.",
      },
      {
        zh: "提供家長居家護理與何時回診的衛教",
        en: "Provide home-care education and guidance on when to return.",
      },
      {
        zh: "以專業且溫暖的態度結束互動",
        en: "Close the interaction with a professional and warm demeanor.",
      },
    ],
    virti: {
      moduleType: "virtual-human",
      embedId: null,
      character: {
        name: { zh: "林媽媽", en: "Mrs. Lin" },
        role: { zh: "病童母親", en: "Mother of the pediatric patient" },
      },
      scenarioNote: {
        zh: "向母親說明注射後照護與觀察事項。",
        en: "Explain post-injection care and observation to the mother.",
      },
    },
    estimatedMinutes: 10,
  },
  {
    step: 6,
    slug: "results",
    kind: "results",
    route: "/journey/results",
    title: {
      zh: "成果與回饋",
      en: "Results and Feedback",
    },
    shortTitle: { zh: "成果", en: "Results" },
    description: {
      zh: "檢視學習完成度、模擬評分與個人化回饋。",
      en: "Review completion status, simulation scores, and personalized feedback.",
    },
    learningObjectives: [],
    virti: {
      moduleType: "interactive-video",
      embedId: null,
      scenarioNote: {
        zh: "顯示課程成果摘要。",
        en: "Display the course results summary.",
      },
    },
    estimatedMinutes: 5,
  },
];

export function getStep(step: number): JourneyStepConfig | undefined {
  return JOURNEY_STEPS.find((s) => s.step === step);
}

export function getAdjacentSteps(step: number): {
  prev?: JourneyStepConfig;
  next?: JourneyStepConfig;
} {
  const index = JOURNEY_STEPS.findIndex((s) => s.step === step);
  if (index === -1) return {};
  return {
    prev: JOURNEY_STEPS[index - 1],
    next: JOURNEY_STEPS[index + 1],
  };
}

export function getFirstIncompleteStep(
  completedSteps: Iterable<number>,
): JourneyStepConfig {
  const completed = new Set(completedSteps);
  return JOURNEY_STEPS.find((s) => !completed.has(s.step)) ?? JOURNEY_STEPS[0];
}
