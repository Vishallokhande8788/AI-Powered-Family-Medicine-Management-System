import { useEffect, useState } from "react";

import api from "../api";
import Sidebar from "../components/Sidebar";

function Dashboard({ username, onLogout, onNavigate }) {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [claims, setClaims] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        familyResponse,
        medicinesResponse,
        schedulesResponse,
        logsResponse,
        claimsResponse,
      ] = await Promise.all([
        api.get("family/family-members/"),
        api.get("medicines/medicines/"),
        api.get("medicines/schedules/"),
        api.get("medicines/logs/"),
        api.get("family/medical-claims/"),
      ]);

      setFamilyMembers(familyResponse.data);
      setMedicines(medicinesResponse.data);
      setSchedules(schedulesResponse.data);
      setLogs(logsResponse.data);
      setClaims(claimsResponse.data);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        "Unable to load dashboard data. Please login again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Today's date
  const today = new Date().toISOString().split("T")[0];

  // Today's schedules
  const todaysSchedules = schedules.filter((schedule) => {
    return (
      schedule.start_date <= today &&
      (!schedule.end_date || schedule.end_date >= today)
    );
  });

  // Today's logs
  const todaysLogs = logs.filter((log) => log.date === today);

  // Taken medicines
  const takenCount = todaysLogs.filter(
    (log) => log.status === "taken"
  ).length;

  // Pending medicines
  const pendingCount = todaysSchedules.length - takenCount;

  // Get medicine information
  const getMedicine = (medicineId) => {
    return medicines.find(
      (medicine) => medicine.id === medicineId
    );
  };

  // Get today's medicine status
  const getScheduleStatus = (scheduleId) => {
    const log = todaysLogs.find(
      (item) => item.schedule === scheduleId
    );

    if (!log) {
      return "pending";
    }

    return log.status;
  };

  // Medical claim renewal
  const getClaimDaysRemaining = (renewalDate) => {
    const todayDate = new Date();
    const renewal = new Date(renewalDate);

    todayDate.setHours(0, 0, 0, 0);
    renewal.setHours(0, 0, 0, 0);

    const difference =
      renewal.getTime() - todayDate.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  const upcomingClaim = claims
    .map((claim) => ({
      ...claim,
      daysRemaining: getClaimDaysRemaining(
        claim.renewal_date
      ),
    }))
    .filter((claim) => claim.daysRemaining >= 0)
    .sort(
      (a, b) =>
        a.daysRemaining - b.daysRemaining
    )[0];

  // Format time
  const formatTime = (time) => {
    if (!time) {
      return "";
    }

    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

          <p className="text-sm text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <Sidebar
        currentPage="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 overflow-y-auto">

        {/* Top Header */}
        <header className="border-b border-gray-200 bg-white px-6 py-5 md:px-8">

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm font-medium text-blue-600">
                GOOD MORNING 👋
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                Welcome back{username ? `, ${username}` : ""}!
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Here's what's happening with your family's health today.
              </p>
            </div>

          </div>

        </header>

        <div className="space-y-6 p-6 md:p-8">

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Medical Claim Alert */}
          {upcomingClaim && (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                  🛡️
                </div>

                <div className="flex-1">

                  <h3 className="font-semibold text-gray-900">
                    Medical Claim Renewal Alert
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    <strong>
                      {upcomingClaim.claim_name}
                    </strong>{" "}
                    renewal is due on{" "}
                    <strong>
                      {upcomingClaim.renewal_date}
                    </strong>.
                  </p>

                  <div className="mt-3 inline-flex rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-700">
                    ⚠️ Renewal in{" "}
                    {upcomingClaim.daysRemaining}{" "}
                    days
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Family */}
            <button
              type="button"
              onClick={() => onNavigate("family")}
              className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Family Members
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {familyMembers.length}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  👨‍👩‍👧
                </div>

              </div>
            </button>

            {/* Medicines */}
            <button
              type="button"
              onClick={() => onNavigate("medicines")}
              className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Today's Medicines
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {todaysSchedules.length}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-xl">
                  💊
                </div>

              </div>
            </button>

            {/* Taken */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Medicines Taken
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {takenCount}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-xl">
                  ✓
                </div>

              </div>

            </div>

            {/* Pending */}
            <button
              type="button"
              onClick={() => onNavigate("medicines")}
              className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Pending
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {Math.max(pendingCount, 0)}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-xl">
                  ⏰
                </div>

              </div>
            </button>

          </div>

          {/* Today's Medicines */}
          <section>

            <div className="mb-4">

              <h2 className="text-xl font-bold text-gray-900">
                Today's Medicines
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Keep track of today's medicine schedule.
              </p>

            </div>

            {todaysSchedules.length === 0 ? (

              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">

                <div className="text-4xl">
                  💊
                </div>

                <h3 className="mt-3 font-semibold text-gray-900">
                  No medicines scheduled for today
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add a medicine schedule to start tracking.
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {todaysSchedules.map((schedule) => {

                  const medicine = getMedicine(
                    schedule.medicine
                  );

                  const status =
                    getScheduleStatus(
                      schedule.id
                    );

                  return (
                    <div
                      key={schedule.id}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                    >

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-start gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                            💊
                          </div>

                          <div>

                            <h3 className="font-semibold text-gray-900">
                              {medicine?.name ||
                                "Medicine"}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              {schedule.dosage}
                              {" • "}
                              {schedule.meal_relation
                                ?.replaceAll(
                                  "_",
                                  " "
                                )}
                            </p>

                          </div>

                        </div>

                        <div className="flex items-center gap-4">

                          <div className="text-right">

                            <p className="text-sm font-semibold text-gray-900">
                              {formatTime(
                                schedule.time
                              )}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              ⏰{" "}
                              {status === "taken"
                                ? "Taken"
                                : status === "missed"
                                ? "Missed"
                                : "Pending"}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            )}

          </section>

          {/* Quick Actions */}
          <section>

            <div className="mb-4">

              <h2 className="text-xl font-bold text-gray-900">
                Quick Actions
              </h2>

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Family */}
              <button
                type="button"
                onClick={() => onNavigate("family")}
                className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-2xl">
                  👨‍👩‍👧
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  Family Members
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Manage family profiles
                </p>
              </button>

              {/* Claims */}
              <button
                type="button"
                onClick={() => onNavigate("claims")}
                className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-2xl">
                  🛡️
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  Medical Claims
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Track renewal dates
                </p>
              </button>

              {/* Medicines */}
              <button
                type="button"
                onClick={() => onNavigate("medicines")}
                className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-2xl">
                  💊
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  Medicines
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Manage medicine schedules
                </p>
              </button>

              {/* Health */}
              <button
                type="button"
                onClick={() => onNavigate("health")}
                className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-2xl">
                  ❤️
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  Health Records
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  View health information
                </p>
              </button>

              {/* Documents */}
              <button
                type="button"
                onClick={() => onNavigate("documents")}
                className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-2xl">
                  📄
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  Documents
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Manage medical documents
                </p>
              </button>

              {/* AI */}
              <button
                type="button"
                onClick={() => onNavigate("ai")}
                className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-2xl">
                  ✨
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  AI Assistant
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Get health information assistance
                </p>
              </button>

            </div>

          </section>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;