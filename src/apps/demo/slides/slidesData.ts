import type { Slide, SlideSection } from '@/apps/demo/slides/types';

export const slideSections: SlideSection[] = [
  { name: '封面', slideIds: ['cover'] },
  { name: '研究背景', slideIds: ['background-1', 'background-2'] },
  { name: '相关工作', slideIds: ['related-1'] },
  { name: '问题与目标', slideIds: ['problem-1'] },
  { name: '方法设计', slideIds: ['method-1', 'method-2'] },
  { name: '阶段结果', slideIds: ['results-1'] },
  { name: '计划与风险', slideIds: ['plan-1'] },
  { name: '总结与 Q&A', slideIds: ['qa'] },
];

export const slides: Slide[] = [
  {
    id: 'cover',
    section: '封面',
    title: '毕设中期汇报 · HTML Slides',
    blocks: [
      {
        type: 'bullets',
        items: ['姓名 / 学号', '导师：XXX', '学院 / 专业', '日期：YYYY-MM-DD'],
      },
    ],
  },
  {
    id: 'background-1',
    section: '研究背景',
    title: '为什么要做这个题？',
    todo: true,
    blocks: [
      {
        type: 'bullets',
        items: [
          '现实场景：……（一句话描述痛点）',
          '现有做法：……（低效/不可复用/成本高）',
          '机会点：……（你看到的可改进空间）',
        ],
      },
      { type: 'figure', title: '图：场景示意 / 现有流程（占位）', note: '后续替换为真实图或流程图' },
    ],
  },
  {
    id: 'background-2',
    section: '研究背景',
    title: '研究动机与价值',
    todo: true,
    blocks: [
      {
        type: 'bullets',
        items: ['研究动机：……', '预期价值：对谁有用、解决什么', '可行性：数据/工具/时间/资源'],
      },
    ],
  },
  {
    id: 'related-1',
    section: '相关工作',
    title: '相关工作 / 竞品对比',
    todo: true,
    blocks: [
      {
        type: 'bullets',
        items: ['工作 A：核心点 + 局限', '工作 B：核心点 + 局限', '对比维度：效果/成本/可解释性/可控性'],
      },
      { type: 'figure', title: '表：对比矩阵（占位）', note: '用 3×3 对比表即可' },
    ],
  },
  {
    id: 'problem-1',
    section: '问题与目标',
    title: '问题定义与研究目标',
    todo: true,
    blocks: [
      {
        type: 'bullets',
        items: ['问题定义：输入/输出/约束', '目标 1：……', '目标 2：……', '评价指标：……（例如准确率、时间、可用性）'],
      },
    ],
  },
  {
    id: 'method-1',
    section: '方法设计',
    title: '系统总体架构',
    todo: true,
    blocks: [
      { type: 'figure', title: '图：系统架构图（占位）', note: '模块：前端/后端/生成/存储/导出' },
      {
        type: 'bullets',
        items: ['模块划分：……', '数据流：……', '关键决策：为什么这么设计'],
      },
    ],
  },
  {
    id: 'method-2',
    section: '方法设计',
    title: '关键算法/流程（占位）',
    todo: true,
    blocks: [
      { type: 'figure', title: '图：核心流程图（占位）', note: '3–5 步，标出输入与输出' },
      { type: 'bullets', items: ['步骤 1：……', '步骤 2：……', '异常处理：……（兜底策略）'] },
    ],
  },
  {
    id: 'results-1',
    section: '阶段结果',
    title: '阶段性实验与观察',
    todo: true,
    blocks: [
      { type: 'figure', title: '图：实验结果曲线/柱状图（占位）', note: '至少 1 张图 + 1 句结论' },
      { type: 'bullets', items: ['实验设置：数据/参数/对照', '主要发现：……', '当前不足：……'] },
    ],
  },
  {
    id: 'plan-1',
    section: '计划与风险',
    title: '接下来计划 & 风险控制',
    todo: true,
    blocks: [
      {
        type: 'bullets',
        items: [
          '里程碑：第 N 周完成……',
          '风险 1：…… → 对策：……',
          '风险 2：…… → 对策：……',
          '需要的支持：数据/设备/导师建议',
        ],
      },
    ],
  },
  {
    id: 'qa',
    section: '总结与 Q&A',
    title: '谢谢！Q&A',
    blocks: [{ type: 'bullets', items: ['补充材料：链接/附录（可选）'] }],
  },
];

export const slideIndexById = new Map(slides.map((s, idx) => [s.id, idx] as const));
