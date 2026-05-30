# 页面设计说明（Desktop-first）

## 全局设计（所有页面通用）
- Layout: 桌面优先双栏（编辑/预览）+ 演示全屏；使用 CSS Grid（主结构）+ Flex（组件对齐）。
- Meta Information:
  - title: 毕设中期汇报 Slides
  - description: 用于生成与演示毕设中期汇报的 HTML 幻灯片
  - Open Graph: og:title/og:description/og:type=website
- Global Styles（Design tokens，建议）:
  - 背景：#0B1020（演示页深色）/ #F7F8FA（编辑页浅色）
  - 主色：#4F46E5；强调色：#22C55E；警示：#F59E0B
  - 字体：系统字体栈；标题 32/28/24；正文 16/18；行高 1.5
  - 按钮：圆角 10px；hover 提亮；disabled 降低不透明度
  - 链接：下划线仅 hover 出现；focus-visible 明显描边
- 响应式：
  - >=1024px：编辑页双栏（左编辑、右预览）
  - <1024px：上下堆叠（先编辑后预览），底部固定导航条

---

## 页面：编辑与预览页（/）
- Page Structure: 顶部导航 + 主体双栏 + 底部快捷键提示条。
- Sections & Components:
  1. Top Bar（固定）
     - 左：应用名 + 当前文稿状态（含 TODO 数）
     - 中：主操作按钮：上一页/下一页、目录、进入演示、导出
     - 右：主题切换（浅色/深色，最小可选）
  2. Left Column：编辑区（表单化）
     - Outline Tree：固定主章节列表；展开显示子页/子要点
     - Slide Editor：
       - 标题输入
       - 要点列表（3–6条）：新增/删除/上下移动
       - 图片/图表占位：src（可为空）+ caption；空时显示占位框
       - TODO 开关：标记“待补数据/待补图”
  3. Right Column：预览区
     - Slide Canvas：按演示比例（16:9）缩放预览
     - 预览导航：页码、章节名；点击左右区域翻页
  4. Bottom Hint Bar
     - 展示快捷键：←/→、Home/End、F 全屏、Esc 退出
- Interaction states:
  - 当前 slide 高亮；未填写图片显示“缺失”态；TODO 显示黄点/标签。

---

## 页面：演示页（/present）
- Page Structure: 单画布居中 + 轻量浮层控制条。
- Sections & Components:
  1. Slide Stage
     - 16:9 居中；支持自适应缩放；背景与内容对比度充足
  2. Floating Controls（默认自动淡出）
     - 上一页/下一页
     - 目录按钮
     - 进度（当前/总页）
     - 全屏切换
  3. TOC Drawer（右侧抽屉）
     - 主章节列表 + 子页缩略标题
     - 当前章节高亮；点击即跳转
- Interaction:
  - 键盘：←/→ 翻页；Home/End；Esc 退出全屏；单击画布右/左侧翻页。

---

## 页面：导出与打印页（/export）
- Page Structure: 上方说明卡片 + 检查清单 + 操作区。
- Sections & Components:
  1. 导出说明
     - 文案：建议用浏览器“打印 → 保存为 PDF”
     - 显示打印参数建议：A4 横向/边距/背景图形开关（按实现给提示）
  2. 导出检查清单
     - TODO 数量、缺失图片数、总页数提示
     - 每项可点击跳回编辑定位（跳到对应 slide）
  3. 操作区
     - 按钮：打开打印对话框（window.print）、返回编辑
- Print 样式要求：
  - 隐藏浮层按钮与导航；每个 slide 单独分页；确保黑白可读。