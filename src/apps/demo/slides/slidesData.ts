import type { Slide, SlideSection } from '@/apps/demo/slides/types';

export const slideSections: SlideSection[] = [
  { name: '封面', slideIds: ['cover'] },
  { name: '课题概述', slideIds: ['intro-bg', 'intro-rq', 'intro-content', 'intro-methods', 'intro-innovations'] },
  { name: '研究阶段性成果：文献研究', slideIds: ['literature'] },
  { name: '研究阶段性成果：RQ1 产出', slideIds: ['rq1-collab'] },
  { name: '研究阶段性成果：案例研究', slideIds: ['tools'] },
  { name: '研究阶段性成果：用户研究', slideIds: ['interviews-obj', 'interviews-setup', 'interviews-info', 'interviews-conclusion'] },
  { name: '研究阶段性成果：RQ2 产出', slideIds: ['rq2-mapping'] },
  { name: '研究阶段性成果：初步交互原型', slideIds: ['prototype'] },
  { name: '研究局限及下一阶段目标', slideIds: ['limitations', 'plan'] },
];

export const slides: Slide[] = [
  {
    id: 'cover',
    section: '封面',
    title: '毕设中期汇报 · HTML 报告',
    blocks: [
      {
        type: 'bullets',
        items: ['姓名 / 学号', '导师：XXX', '学院 / 专业', '日期：YYYY-MM-DD'],
      },
    ],
  },
  {
    id: 'intro-bg',
    section: '课题概述',
    title: '绪论与研究背景',
    todo: true,
    blocks: [
      {
        type: 'text',
        variant: 'body',
        text: '本课题围绕“基于元设计理论的生成式信息设计协作机制研究”展开。',
      },
      {
        type: 'bullets',
        items: [
          '背景趋势：生成式 AI 在设计工作流中的应用不断深入，设计师与 AI 的关系正从“辅助生成”转向“共同参与设计产出”。',
          '核心痛点：信息设计场景中，元设计空间包含内容组织、层级关系、视觉风格、呈现形式与人机分工等多个维度。',
          '问题聚焦：当这些内容被压缩为一次性的自然语言输入时，容易出现表达模糊、信息遗漏、控制不足和结果不稳定等问题。',
        ],
      },
    ],
  },
  {
    id: 'intro-rq',
    section: '课题概述',
    title: '研究问题 (Research Questions)',
    todo: true,
    blocks: [
      {
        type: 'text',
        variant: 'body',
        text: '针对上述背景与痛点，本研究主要围绕以下三个核心问题展开：',
      },
      {
        type: 'bullets',
        items: [
          'RQ1：在信息设计场景下，设计师与生成式 AI 应形成怎样的角色分工与协作模式？',
          'RQ2：在信息设计场景下，具体任务之外，设计师可以制定怎样的元设计空间？',
          'RQ3：面向生成式信息设计系统，应构建怎样的交互流程与机制，以支持设计师更高效、更可控地完成设计任务？',
        ],
      },
    ],
  },
  {
    id: 'intro-content',
    section: '课题概述',
    title: '研究内容',
    todo: true,
    blocks: [
      {
        type: 'text',
        variant: 'body',
        text: '围绕研究问题，本课题当前的研究内容主要包括以下三个方面：',
      },
      {
        type: 'bullets',
        items: [
          '协作关系梳理：明确信息设计场景下设计师与生成式 AI 在设计流程中的角色定位与分工逻辑。',
          '元设计空间提炼：提炼元设计空间中适合被元设计化的关键维度（如目标、内容、结构、形式、流程与分工），并探索其与生成规则的映射关系。',
          '交互机制验证：设计并验证一种支持“先定义规则、再生成结果”的交互机制，通过原型将元设计思路转化为具体可体验的系统流程。',
        ],
      },
    ],
  },
  {
    id: 'intro-methods',
    section: '课题概述',
    title: '研究方法及技术路线',
    todo: true,
    blocks: [
      {
        type: 'text',
        variant: 'body',
        text: '本课题采用文献研究、案例研究、用户研究和原型研究相结合的方法推进：',
      },
      {
        type: 'bullets',
        items: [
          '文献与案例研究：梳理元设计与人机协作理论，分析当前 AI 辅助设计工具的控制粒度与局限。',
          '用户研究（访谈/观察）：了解目标设计师在真实工作流中的痛点与需求。',
          '原型研究（RtD）：通过构建与迭代中期 demo，将研究假设转化为系统交互方案。',
        ],
      },
      {
        type: 'text',
        variant: 'subtitle',
        text: '技术路线',
      },
      {
        type: 'text',
        variant: 'body',
        text: '文献/案例界定问题 → 用户研究提炼需求 → 转化为原型机制 → 迭代验证形成结论。',
      },
    ],
  },
  {
    id: 'intro-innovations',
    section: '课题概述',
    title: '关键创新点',
    todo: true,
    blocks: [
      {
        type: 'text',
        variant: 'body',
        text: '本课题当前呈现出的关键创新点主要体现在以下几个方面：',
      },
      {
        type: 'bullets',
        items: [
          '研究视角：将生成式信息设计中的“协作机制本身”作为设计对象，而非仅关注终端设计师如何输入 Prompt。',
          '问题建构：强调元设计空间不仅包含风格偏好，还包括内容、结构、流程与人机分工等多维因素，并尝试结构化表达。',
          '方法路径：将元设计理论与信息设计场景结合，探索一种可配置、复用和调整的人机协作生成机制。',
          '原型方向：尝试从“给指令生成”转向“定规则生成”，为后续生成式设计工具提供新的交互思路。',
        ],
      },
    ],
  },
  {
    id: 'literature',
    section: '研究阶段性成果：文献研究',
    title: '核心文献梳理与洞察',
    todo: true,
    blocks: [
      {
        type: 'text',
        variant: 'body',
        text: '在本阶段，我们围绕研究主题，重点查阅了以下几个方向的文献，提取了可用于系统设计的理论支撑：',
      },
      {
        type: 'bullets',
        items: [
          '方向一：……（相关理论/方法）',
          '方向二：……（技术演进/现状）',
          '方向三：……（设计模式/评估指标）',
        ],
      },
      {
        type: 'text',
        variant: 'subtitle',
        text: '文献研究小结',
      },
      {
        type: 'text',
        variant: 'body',
        text: '通过文献梳理，我们发现现有研究在 [某个环节] 仍存在不足，这为本课题的切入点提供了理论依据。',
      },
    ],
  },
  {
    id: 'rq1-collab',
    section: '研究阶段性成果：RQ1 产出',
    title: '基于元设计理论的设计师—生成式 AI 在信息设计场景下的协作模式研究',
    todo: true,
    blocks: [
      {
        type: 'text',
        variant: 'body',
        text: '结合文献与课题背景，针对研究问题 1（RQ1），我们构建了如下的协作模式框架：',
      },
      { type: 'figure', title: '图：设计师与生成式 AI 的协作模式框架', note: '核心环节：元设计空间配置、规则配置、系统生成、人工微调' },
      {
        type: 'bullets',
        items: [
          '角色重塑：设计师从“执行者”转变为“规则制定者（元设计师）”',
          'AI定位：从“单向工具”转变为“基于约束的协同创作者”',
          '核心机制：通过结构化提取元设计空间，形成可复用的生成规则，实现“先定义规则、再生成结果”',
        ],
      },
    ],
  },
  {
    id: 'tools',
    section: '研究阶段性成果：案例研究',
    title: '现有案例与工具分析',
    todo: true,
    blocks: [
      {
        type: 'text',
        variant: 'body',
        text: '为了解当前工业界与学术界的最佳实践，我们选取了 3-5 个具有代表性的同类工具进行对比分析。',
      },
      { type: 'figure', title: '表：现有案例工具对比矩阵', note: '对比维度：功能覆盖、易用性、智能化程度、局限性' },
      {
        type: 'bullets',
        items: [
          '工具 A 的优势与局限：……',
          '工具 B 的优势与局限：……',
          '工具 C 的优势与局限：……',
        ],
      },
      {
        type: 'text',
        variant: 'quote',
        text: '“现有工具大多解决了 [基础问题]，但在 [高级需求/特定场景] 下，仍缺乏有效的支持。”',
      },
    ],
  },
  {
    id: 'interviews-obj',
    section: '研究阶段性成果：用户研究',
    title: '访谈目标',
    todo: true,
    blocks: [
      {
        type: 'text',
        variant: 'body',
        text: '本次访谈旨在深入了解目标用户在真实场景下的工作流与痛点，主要包含以下目标：',
      },
      {
        type: 'bullets',
        items: [
          '验证真实场景需求，了解用户在信息设计中的核心卡点',
          '挖掘当前工作流中耗时最长、最容易出错的环节',
          '探索用户对智能化协作机制的期望特性',
        ],
      },
    ],
  },
  {
    id: 'interviews-setup',
    section: '研究阶段性成果：用户研究',
    title: '访谈设置',
    todo: true,
    blocks: [
      {
        type: 'text',
        variant: 'body',
        text: '本次访谈采用半结构化访谈形式，单次访谈时长约 45-60 分钟。访谈提纲主要分为三个模块：',
      },
      {
        type: 'bullets',
        items: [
          '模块一：日常工作流与职责划分',
          '模块二：现有辅助工具的使用体验与局限',
          '模块三：对“生成式规则”及“AI协作”的态度与期望',
        ],
      },
    ],
  },
  {
    id: 'interviews-info',
    section: '研究阶段性成果：用户研究',
    title: '访谈人员信息',
    todo: true,
    blocks: [
      {
        type: 'text',
        variant: 'body',
        text: '我们共邀请了 N 位目标用户参与访谈，覆盖了不同经验阶段的从业者。',
      },
      { type: 'figure', title: '表：受访者基本信息', note: '包含：角色名称、从业年限、主要业务场景' },
    ],
  },
  {
    id: 'interviews-conclusion',
    section: '研究阶段性成果：用户研究',
    title: '访谈结论',
    todo: true,
    blocks: [
      {
        type: 'bullets',
        items: [
          '核心痛点 1：用户在 [场景] 下，经常遇到 [困难]',
          '核心痛点 2：现有工作流中，[环节] 耗时最长',
          '期望特性 1：用户普遍希望系统能够提供 [功能]',
        ],
      },
      {
        type: 'text',
        variant: 'quote',
        text: '“每次做这个任务都要反复核对，如果有工具能自动帮我把基础骨架搭好，我至少能省下一半时间。” —— 访谈对象 A（资深设计师）',
      },
    ],
  },
  {
    id: 'rq2-mapping',
    section: '研究阶段性成果：RQ2 产出',
    title: '信息设计场景下元设计空间构建与生成规则映射研究',
    todo: true,
    blocks: [
      {
        type: 'text',
        variant: 'body',
        text: '结合前期的案例分析与用户访谈，针对研究问题 2（RQ2），我们对元设计空间与生成规则的映射关系进行了如下构建：',
      },
      { type: 'figure', title: '图：元设计空间到生成规则的映射模型', note: '核心维度：目标、内容、结构、形式、流程与分工' },
      {
        type: 'bullets',
        items: [
          '空间解构：将模糊的自然语言指令拆解为可被系统理解的元设计空间维度',
          '规则映射：探索各维度空间如何转化为系统可执行的具体生成规则',
          '约束机制：建立设计规范与系统生成的有效约束，确保输出的稳定性与一致性',
        ],
      },
    ],
  },
  {
    id: 'prototype',
    section: '研究阶段性成果：初步交互原型',
    title: '初步交互原型与系统框架',
    todo: true,
    blocks: [
      {
        type: 'text',
        variant: 'body',
        text: '基于上述理论框架与映射规则，目前已完成中期原型的基础工程搭建与核心交互构思：',
      },
      { type: 'figure', title: '图：系统架构与核心交互界面草图', note: '包含：React 前端 + Node.js 后端，以及规则配置面板' },
      {
        type: 'bullets',
        items: [
          '核心流程：围绕“先定义规则、再生成结果”的协作模式展开。',
          '空间转化：尝试把元设计空间中的关键维度转化为可编辑、可约束、可复用的系统输入。',
          '当前进度：完成 React + Vite 前端与 Node.js + Express 后端的实现框架，区分为 midterm 与 final 两条推进线。',
        ],
      },
    ],
  },
  {
    id: 'limitations',
    section: '研究局限及下一阶段目标',
    title: '当前研究局限',
    todo: true,
    blocks: [
      {
        type: 'bullets',
        items: [
          '理论深度：文献梳理与案例分析仍需系统化，国内外相关研究的分类比较需要加强。',
          '一手资料：用户研究目前处于准备和试访谈阶段，尚未形成充足、详实的一手分析资料。',
          '原型深度：初步交互原型目前更多停留在机制构思和工程准备层面，功能细化和可用性验证不足。',
        ],
      },
    ],
  },
  {
    id: 'plan',
    section: '研究局限及下一阶段目标',
    title: '阶段总结与下一步规划',
    todo: true,
    blocks: [
      {
        type: 'bullets',
        items: [
          '阶段总结：通过文献、工具、访谈三方面的研究，我们明确了系统的核心功能边界与设计要求。',
          '下一步计划 1：系统原型设计与交互推敲（第 N 周）',
          '下一步计划 2：核心算法/逻辑的开发与验证（第 N+1 周）',
          '预期风险与对策：……',
        ],
      },
    ],
  },
];

export const slideIndexById = new Map(slides.map((s, idx) => [s.id, idx] as const));
