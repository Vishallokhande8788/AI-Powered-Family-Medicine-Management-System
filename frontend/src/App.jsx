import { useState } from "react";
import api from "./api";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("users/login/", {
        username,
        password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      api.defaults.headers.common["Authorization"] =
        `Bearer ${response.data.access}`;

      setLoggedIn(true);
    } catch (error) {
      console.log(error.response?.data);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  // DASHBOARD
  if (loggedIn) {
    return (
      <div className="min-h-screen bg-slate-50">

        {/* TOP NAVBAR */}
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
            onClick={() => {
              localStorage.removeItem("access");
              localStorage.removeItem("refresh");
              delete api.defaults.headers.common["Authorization"];
              setLoggedIn(false);
            }}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Logout
          </button>

        </header>

        {/* MAIN */}
        <main className="p-6 md:p-10">

          <div className="mb-8">
            <p className="text-blue-600 font-semibold text-sm">
              GOOD MORNING 👋
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
              Welcome back, {username}
            </h2>

            <p className="text-slate-500 mt-2">
              Here's what's happening with your family's health today.
            </p>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition">
              <div className="text-3xl mb-4">👨‍👩‍👧</div>

              <p className="text-sm text-slate-500">
                Family Members
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                1
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition">
              <div className="text-3xl mb-4">💊</div>

              <p className="text-sm text-slate-500">
                Today's Medicines
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-1">
                1
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition">
              <div className="text-3xl mb-4">✓</div>

              <p className="text-sm text-slate-500">
                Medicines Taken
              </p>

              <p className="text-3xl font-bold text-emerald-600 mt-1">
                1
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition">
              <div className="text-3xl mb-4">⏰</div>

              <p className="text-sm text-slate-500">
                Pending
              </p>

              <p className="text-3xl font-bold text-orange-500 mt-1">
                0
              </p>
            </div>

          </div>

          {/* TODAY'S MEDICINES */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Today's Medicines
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Keep track of today's medicine schedule.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium">
                1 Taken
              </span>

            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                  💊
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    Test Medicine
                  </h4>

                  <p className="text-sm text-slate-500">
                    1 tablet • After food
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    08:00 AM
                  </p>
                </div>

              </div>

              <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-semibold">
                ✓ Taken
              </span>

            </div>

          </div>

          {/* QUICK ACTIONS */}
          <div className="mt-8">

            <h3 className="text-xl font-bold text-slate-900 mb-5">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              <button className="bg-white border border-slate-200 rounded-2xl p-6 text-left hover:shadow-lg hover:-translate-y-1 transition">
                <div className="text-3xl mb-4">👨‍👩‍👧</div>

                <h4 className="font-semibold text-slate-900">
                  Family Members
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Manage family profiles
                </p>
              </button>

              <button className="bg-white border border-slate-200 rounded-2xl p-6 text-left hover:shadow-lg hover:-translate-y-1 transition">
                <div className="text-3xl mb-4">💊</div>

                <h4 className="font-semibold text-slate-900">
                  Medicines
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Manage medicine schedules
                </p>
              </button>

              <button className="bg-white border border-slate-200 rounded-2xl p-6 text-left hover:shadow-lg hover:-translate-y-1 transition">
                <div className="text-3xl mb-4">❤️</div>

                <h4 className="font-semibold text-slate-900">
                  Health Records
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  View health information
                </p>
              </button>

              <button className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-6 text-left hover:shadow-lg hover:-translate-y-1 transition">
                <div className="text-3xl mb-4">✨</div>

                <h4 className="font-semibold">
                  AI Assistant
                </h4>

                <p className="text-sm text-blue-100 mt-1">
                  Get health information assistance
                </p>
              </button>

            </div>

          </div>

        </main>
      </div>
    );
  }

  // LOGIN
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

      <div className="w-full max-w-6xl min-h-[650px] bg-white rounded-3xl shadow-xl overflow-hidden flex">

        {/* LEFT */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 flex-col justify-between">

          <div>
            <div className="flex items-center gap-3 mb-16">

              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                ♥
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  Family Medicine
                </h1>

                <p className="text-blue-100 text-sm">
                  Tracker
                </p>
              </div>

            </div>

            <h2 className="text-5xl font-bold leading-tight">
              Better health
              <br />
              management
              <br />
              for your family.
            </h2>

            <p className="mt-6 text-blue-100 text-lg leading-relaxed max-w-md">
              Manage medicines, health records and family
              medical information in one simple platform.
            </p>
          </div>

          <div className="space-y-5">

            <p>✓ Medicine Management</p>
            <p>♥ Family Health Records</p>
            <p>✦ AI-Assisted Insights</p>

          </div>

        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">

          <div className="w-full max-w-md">

            <p className="text-blue-600 font-semibold text-sm mb-2">
              WELCOME BACK
            </p>

            <h2 className="text-4xl font-bold text-slate-900">
              Sign in
            </h2>

            <p className="text-slate-500 mt-3 mb-8">
              Access your family's health dashboard.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3.5 pr-16 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in →"}
              </button>

            </form>

            <p className="text-center text-xs text-slate-400 mt-10">
              Family Medicine Tracker © 2026
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;