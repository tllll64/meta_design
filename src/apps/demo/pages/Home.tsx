import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f4ee] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-black/8 bg-white px-8 py-10 md:px-12 md:py-14">
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Meta Design</div>
        <h1 className="slide-type-title mt-4 text-5xl leading-tight text-zinc-950 md:text-6xl">中期汇报 HTML 报告</h1>
        <p className="slide-type-body mt-6 max-w-2xl text-zinc-600">
          当前版本已经从翻页式 PPT 切换为连续阅读的 HTML 报告。你可以直接在页面里点击文字编辑内容，再导出为 PDF。
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/report"
            className="inline-flex items-center rounded-xl bg-zinc-950 px-5 py-3 text-sm text-white transition hover:bg-zinc-800"
          >
            打开 HTML 报告
          </Link>
          <Link
            to="/report/print"
            className="inline-flex items-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm text-zinc-900 transition hover:bg-zinc-100"
          >
            打印 / PDF
          </Link>
        </div>
      </div>
    </div>
  );
}
