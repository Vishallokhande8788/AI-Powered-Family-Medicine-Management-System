function Navbar({ username, onLogout }) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10">

      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Family Medicine Tracker
        </h1>

        <p className="text-sm text-slate-500">
          Your family's health, organized.
        </p>
      </div>

      <button
        onClick={onLogout}
        className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
      >
        Logout
      </button>

    </header>
  );
}

export default Navbar;