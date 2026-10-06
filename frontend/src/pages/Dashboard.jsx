import { useEffect, useState } from "react";
import api from "../api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import MedicineCard from "../components/MedicineCard";
import QuickActionCard from "../components/QuickActionCard";

function Dashboard({ username, onLogout, onNavigate }) {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [claims, setClaims] = useState([]);

  const getDaysRemaining = (renewalDate) => {
    const today = new Date();
    const renewal = new Date(renewalDate);

    today.setHours(0, 0, 0, 0);
    renewal.setHours(0, 0, 0, 0);

    return Math.ceil((renewal - today) / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access");

    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    // Get Family Members
    api
      .get("family/family-members/")
      .then((response) => {
        console.log("Family Members:", response.data);
        setFamilyMembers(response.data);
      })
      .catch((error) => {
        console.log("Family Members Error:", error.response?.data);
      });

    // Get Medicines
    api
      .get("medicines/medicines/")
      .then((response) => {
        console.log("Medicines:", response.data);
        setMedicines(response.data);
      })
      .catch((error) => {
        console.log("Medicines Error:", error.response?.data);
      });

    // Get Medicine Schedules
    api
      .get("medicines/schedules/")
      .then((response) => {
        console.log("Schedules:", response.data);
        setSchedules(response.data);
      })
      .catch((error) => {
        console.log("Schedules Error:", error.response?.data);
      });

    // Get Medical Claims
    api
      .get("family/medical-claims/")
      .then((response) => {
        console.log("Medical Claims:", response.data);
        setClaims(response.data);
      })
      .catch((error) => {
        console.log("Medical Claims Error:", error.response?.data);
      });

    // Get Medicine Logs
    api
      .get("medicines/logs/")
      .then((response) => {
        console.log("Logs:", response.data);
        setLogs(response.data);
      })
      .catch((error) => {
        console.log("Logs Error:", error.response?.data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar username={username} onLogout={onLogout} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10">
          {/* WELCOME */}
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
          {claims.map((claim) => {
            const daysRemaining = getDaysRemaining(claim.renewal_date);

            if (daysRemaining > 30) {
              return null;
            }

            return (
              <div
                key={claim.id}
                className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🛡️</div>

                  <div>
                    <h3 className="font-bold text-orange-800">
                      Medical Claim Renewal Alert
                    </h3>

                    <p className="text-sm text-orange-700 mt-1">
                      {claim.claim_name} renewal is due on{" "}
                      <strong>{claim.renewal_date}</strong>.
                    </p>

                    <p className="text-sm font-semibold text-orange-800 mt-2">
                      ⚠️ Renewal in {daysRemaining} days
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              icon="👨‍👩‍👧"
              title="Family Members"
              value={familyMembers.length}
            />

            <StatCard
              icon="💊"
              title="Today's Medicines"
              value={schedules.length}
            />

            <StatCard
              icon="✓"
              title="Medicines Taken"
              value={logs.filter((log) => log.status === "taken").length}
              valueColor="text-emerald-600"
            />

            <StatCard
              icon="⏰"
              title="Pending"
              value={logs.filter((log) => log.status === "pending").length}
              valueColor="text-orange-500"
            />
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
                {logs.filter((log) => log.status === "taken").length} Taken
              </span>
            </div>

            {schedules.length > 0 ? (
              schedules.map((schedule) => {
                const medicine = medicines.find(
                  (medicine) => medicine.id === schedule.medicine,
                );

                const log = logs.find((log) => log.schedule === schedule.id);

                return (
                  <MedicineCard
                    key={schedule.id}
                    name={medicine?.name || "Medicine"}
                    dosage={schedule.dosage}
                    mealRelation={schedule.meal_relation}
                    time={schedule.time}
                    status={log?.status || "pending"}
                  />
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-500">
                No medicines scheduled for today.
              </div>
            )}
          </div>

          {/* QUICK ACTIONS */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-5">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <QuickActionCard
                icon="👨‍👩‍👧"
                title="Family Members"
                description="Manage family profiles"
                onClick={() => onNavigate("family")}
              />
              <QuickActionCard
                icon="🛡️"
                title="Medical Claims"
                description="Track renewal dates"
                onClick={() => onNavigate("claims")}
              />

              <QuickActionCard
                icon="💊"
                title="Medicines"
                description="Manage medicine schedules"
              />

              <QuickActionCard
                icon="❤️"
                title="Health Records"
                description="View health information"
                onClick={() => onNavigate("health")}
              />

              <QuickActionCard
                icon="✨"
                title="AI Assistant"
                description="Get health information assistance"
                highlighted
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
