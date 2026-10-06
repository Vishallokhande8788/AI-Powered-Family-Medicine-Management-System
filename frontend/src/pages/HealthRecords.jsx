import { useEffect, useState } from "react";
import api from "../api";

function HealthRecords() {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    family_member: "",
    blood_pressure: "",
    blood_sugar: "",
    pulse_rate: "",
    spo2: "",
    weight: "",
    notes: "",
  });

  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");

    api.defaults.headers.common["Authorization"] =
      `Bearer ${accessToken}`;

    // Get health records
    api
      .get("family/vitals/")
      .then((response) => {
        console.log("Vitals:", response.data);
        setVitals(response.data);
      })
      .catch((error) => {
        console.log(
          "Vitals Error:",
          error.response?.data
        );
      });

    // Get family members
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.family_member) {
      setError("Please select a family member.");
      return;
    }

    setSaving(true);

    try {
      const response = await api.post(
        "family/vitals/",
        {
          family_member: Number(formData.family_member),
          blood_pressure: formData.blood_pressure,
          blood_sugar: formData.blood_sugar
            ? Number(formData.blood_sugar)
            : null,
          pulse_rate: formData.pulse_rate
            ? Number(formData.pulse_rate)
            : null,
          spo2: formData.spo2
            ? Number(formData.spo2)
            : null,
          weight: formData.weight
            ? Number(formData.weight)
            : null,
          notes: formData.notes,
        }
      );

      console.log("Health Record Created:", response.data);

      setVitals((prevVitals) => [
        ...prevVitals,
        response.data,
      ]);

      setMessage("Health record added successfully.");

      setFormData({
        family_member: "",
        blood_pressure: "",
        blood_sugar: "",
        pulse_rate: "",
        spo2: "",
        weight: "",
        notes: "",
      });

      setShowForm(false);
    } catch (error) {
      console.log(
        "Create Health Record Error:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
          "Failed to add health record. Please check the entered data."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-blue-600 font-semibold text-sm">
            HEALTH
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Health Records
          </h1>

          <p className="text-slate-500 mt-2">
            Track important health measurements for your family.
          </p>

          <button
            onClick={() => {
              setShowForm(true);
              setMessage("");
              setError("");
            }}
            className="mt-5 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            + Add Health Record
          </button>
        </div>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700 font-medium">
            ✓ {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* ADD HEALTH RECORD FORM */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">

            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Add Health Record
            </h2>

            <form onSubmit={handleSubmit}>

              {/* FAMILY MEMBER */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Family Member *
                </label>

                <select
                  name="family_member"
                  value={formData.family_member}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select family member
                  </option>

                  {familyMembers.map((member) => (
                    <option
                      key={member.id}
                      value={member.id}
                    >
                      {member.name} ({member.relation})
                    </option>
                  ))}
                </select>
              </div>

              {/* FORM GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* BLOOD PRESSURE */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Blood Pressure
                  </label>

                  <input
                    type="text"
                    name="blood_pressure"
                    placeholder="e.g. 120/80"
                    value={formData.blood_pressure}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* BLOOD SUGAR */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Blood Sugar
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="blood_sugar"
                    placeholder="e.g. 110"
                    value={formData.blood_sugar}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* PULSE RATE */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pulse Rate
                  </label>

                  <input
                    type="number"
                    name="pulse_rate"
                    placeholder="e.g. 72"
                    value={formData.pulse_rate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* SPO2 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SpO₂
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="spo2"
                    placeholder="e.g. 98"
                    value={formData.spo2}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* WEIGHT */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Weight (kg)
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="weight"
                    placeholder="e.g. 70"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              {/* NOTES */}
              <div className="mt-5">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>

                <textarea
                  name="notes"
                  rows="4"
                  placeholder="Add any additional health notes..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 mt-6">

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Health Record"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                    setMessage("");
                  }}
                  className="px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        {/* CONTENT */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
            Loading health records...
          </div>
        ) : vitals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">

            <div className="text-5xl mb-4">
              ❤️
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              No health records yet
            </h2>

            <p className="text-slate-500 mt-2">
              Add health measurements to start tracking.
            </p>

          </div>
        ) : (
          <div className="space-y-5">

            {vitals.map((vital) => {

              const member = familyMembers.find(
                (item) =>
                  item.id === vital.family_member
              );

              return (
                <div
                  key={vital.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6"
                >

                  {/* MEMBER */}
                  <div className="mb-5">
                    <h2 className="text-lg font-bold text-slate-900">
                      {member?.name || "Family Member"}
                    </h2>

                    {member?.relation && (
                      <p className="text-sm text-slate-500">
                        {member.relation}
                      </p>
                    )}
                  </div>

                  {/* HEALTH VALUES */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

                    {/* BLOOD PRESSURE */}
                    <div>
                      <p className="text-sm text-slate-500">
                        Blood Pressure
                      </p>

                      <p className="text-xl font-bold text-slate-900 mt-1">
                        {vital.blood_pressure || "--"}
                      </p>
                    </div>

                    {/* BLOOD SUGAR */}
                    <div>
                      <p className="text-sm text-slate-500">
                        Blood Sugar
                      </p>

                      <p className="text-xl font-bold text-slate-900 mt-1">
                        {vital.blood_sugar ?? "--"}
                      </p>
                    </div>

                    {/* PULSE */}
                    <div>
                      <p className="text-sm text-slate-500">
                        Pulse
                      </p>

                      <p className="text-xl font-bold text-slate-900 mt-1">
                        {vital.pulse_rate ?? "--"}
                      </p>
                    </div>

                    {/* SPO2 */}
                    <div>
                      <p className="text-sm text-slate-500">
                        SpO₂
                      </p>

                      <p className="text-xl font-bold text-slate-900 mt-1">
                        {vital.spo2 ?? "--"}
                      </p>
                    </div>

                    {/* WEIGHT */}
                    <div>
                      <p className="text-sm text-slate-500">
                        Weight
                      </p>

                      <p className="text-xl font-bold text-slate-900 mt-1">
                        {vital.weight ?? "--"} kg
                      </p>
                    </div>

                  </div>

                  {/* NOTES */}
                  {vital.notes && (
                    <div className="mt-5 pt-4 border-t border-slate-100">

                      <p className="text-sm text-slate-500">
                        Notes
                      </p>

                      <p className="text-sm text-slate-700 mt-1">
                        {vital.notes}
                      </p>

                    </div>
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

export default HealthRecords;