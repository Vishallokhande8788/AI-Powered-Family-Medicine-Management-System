import { useEffect, useState } from "react";
import api from "../api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import MedicineCard from "../components/MedicineCard";
import QuickActionCard from "../components/QuickActionCard";

function Dashboard({ username, onLogout }) {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");

    api.defaults.headers.common["Authorization"] =
      `Bearer ${accessToken}`;

    // Get Family Members
    api
      .get("family/family-members/")
      .then((response) => {
        console.log("Family Members:", response.data);
        setFamilyMembers(response.data);
      })
      .catch((error) => {
        console.log(
          "Family Members Error:",
          error.response?.data
        );
      });

    // Get Medicines
    api
      .get("medicines/medicines/")
      .then((response) => {
        console.log("Medicines:", response.data);
        setMedicines(response.data);
      })
      .catch((error) => {
        console.log(
          "Medicines Error:",
          error.response?.data
        );
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        username={username}
        onLogout={onLogout}
      />

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
              value={medicines.length}
            />

            <StatCard
              icon="✓"
              title="Medicines Taken"
              value="1"
              valueColor="text-emerald-600"
            />

            <StatCard
              icon="⏰"
              title="Pending"
              value="0"
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
                {medicines.length} Medicines
              </span>

            </div>

            {/* MEDICINE LIST */}
            {medicines.length > 0 ? (
              medicines.map((medicine) => (
                <MedicineCard
                  key={medicine.id}
                  name={medicine.name}
                  dosage={medicine.dosage}
                  mealRelation={medicine.instructions}
                  time="Scheduled"
                  status="pending"
                />
              ))
            ) : (
              <div className="text-center py-10 text-slate-500">
                No medicines found.
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