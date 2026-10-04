function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-80px)] p-5 flex-col">

      <nav className="space-y-2">

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-medium text-left">
          <span>🏠</span>
          Dashboard
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition text-left">
          <span>👨‍👩‍👧</span>
          Family Members
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition text-left">
          <span>💊</span>
          Medicines
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition text-left">
          <span>❤️</span>
          Health Records
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition text-left">
          <span>📄</span>
          Documents
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition text-left">
          <span>✨</span>
          AI Assistant
        </button>

      </nav>

      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">

        <div className="text-2xl mb-3">
          ✨
        </div>

        <h3 className="font-semibold">
          AI Health Assistant
        </h3>

        <p className="text-xs text-blue-100 mt-1 leading-relaxed">
          Get simple health information and summaries.
        </p>

      </div>

    </aside>
  );
}

export default Sidebar;