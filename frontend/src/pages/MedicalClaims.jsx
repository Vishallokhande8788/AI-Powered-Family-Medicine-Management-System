import { useEffect, useState } from "react";
import api from "../api";

function MedicalClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");

    api.defaults.headers.common["Authorization"] =
      `Bearer ${accessToken}`;

    api
      .get("family/medical-claims/")
      .then((response) => {
        console.log("Medical Claims:", response.data);
        setClaims(response.data);
      })
      .catch((error) => {
        console.log(
          "Medical Claims Error:",
          error.response?.data
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getDaysRemaining = (renewalDate) => {
    const today = new Date();
    const renewal = new Date(renewalDate);

    today.setHours(0, 0, 0, 0);
    renewal.setHours(0, 0, 0, 0);

    return Math.ceil(
      (renewal - today) / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <p className="text-blue-600 font-semibold text-sm">
            INSURANCE
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Medical Claims
          </h1>

          <p className="text-slate-500 mt-2">
            Track your medical claim and renewal dates.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
            Loading medical claims...
          </div>
        ) : claims.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <div className="text-5xl mb-4">🛡️</div>

            <h2 className="text-xl font-bold text-slate-900">
              No medical claims
            </h2>

            <p className="text-slate-500 mt-2">
              Add a medical claim to track its renewal date.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {claims.map((claim) => {
              const daysRemaining = getDaysRemaining(
                claim.renewal_date
              );

              const isExpired = daysRemaining < 0;
              const isUrgent =
                daysRemaining >= 0 && daysRemaining <= 7;

              return (
                <div
                  key={claim.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                      🛡️
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {claim.claim_name}
                      </h2>

                      <p className="text-sm text-slate-500">
                        Renewal tracking
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-slate-500">
                      Renewal Date
                    </p>

                    <p className="text-lg font-semibold text-slate-900 mt-1">
                      {claim.renewal_date}
                    </p>
                  </div>

                  <div
                    className={`px-4 py-3 rounded-xl text-sm font-semibold ${
                      isExpired
                        ? "bg-red-50 text-red-600"
                        : isUrgent
                        ? "bg-orange-50 text-orange-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {isExpired
                      ? `⚠️ Expired ${Math.abs(daysRemaining)} days ago`
                      : isUrgent
                      ? `⚠️ Renewal in ${daysRemaining} days`
                      : `✓ ${daysRemaining} days remaining`}
                  </div>

                  {claim.notes && (
                    <p className="text-sm text-slate-500 mt-4">
                      {claim.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicalClaims;