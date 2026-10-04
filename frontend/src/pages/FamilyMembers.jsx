import { useEffect, useState } from "react";
import api from "../api";

function FamilyMembers() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");

    api.defaults.headers.common["Authorization"] =
      `Bearer ${accessToken}`;

    api
      .get("family/family-members/")
      .then((response) => {
        console.log("Family Members Page:", response.data);
        setFamilyMembers(response.data);
      })
      .catch((error) => {
        console.log(
          "Family Members Page Error:",
          error.response?.data
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <p className="text-blue-600 font-semibold text-sm">
              FAMILY
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
              Family Members
            </h1>

            <p className="text-slate-500 mt-2">
              Manage your family's health profiles.
            </p>
          </div>

          <button className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
            + Add Member
          </button>

        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
            Loading family members...
          </div>
        ) : familyMembers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <div className="text-5xl mb-4">👨‍👩‍👧</div>

            <h2 className="text-xl font-bold text-slate-900">
              No family members yet
            </h2>

            <p className="text-slate-500 mt-2">
              Add your first family member to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition"
              >

                <div className="flex items-center gap-4 mb-5">

                  <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                    👤
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {member.name}
                    </h2>

                    <p className="text-sm text-blue-600 font-medium">
                      {member.relation}
                    </p>
                  </div>

                </div>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Date of Birth
                    </span>

                    <span className="font-medium text-slate-800">
                      {member.date_of_birth || "Not added"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Gender
                    </span>

                    <span className="font-medium text-slate-800">
                      {member.gender || "Not added"}
                    </span>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default FamilyMembers;