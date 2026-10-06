import { useEffect, useState } from "react";
import api from "../api";

const emptyForm = {
  family_member: "",
  blood_pressure: "",
  blood_sugar: "",
  pulse_rate: "",
  spo2: "",
  weight: "",
  notes: "",
};

function HealthRecords() {
  const [vitals, setVitals] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }

    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [vitalsResponse, membersResponse] = await Promise.all([
        api.get("family/vitals/"),
        api.get("family/family-members/"),
      ]);

      setVitals(vitalsResponse.data);
      setFamilyMembers(membersResponse.data);
    } catch (err) {
      console.error("Health Records Error:", err.response?.data || err);

      setError(
        err.response?.data?.detail ||
          "Failed to load health records. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setMessage("");
    setError("");
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (vital) => {
    setMessage("");
    setError("");

    setEditingId(vital.id);

    setFormData({
      family_member: vital.family_member || "",
      blood_pressure: vital.blood_pressure || "",
      blood_sugar:
        vital.blood_sugar !== null && vital.blood_sugar !== undefined
          ? vital.blood_sugar
          : "",
      pulse_rate:
        vital.pulse_rate !== null && vital.pulse_rate !== undefined
          ? vital.pulse_rate
          : "",
      spo2:
        vital.spo2 !== null && vital.spo2 !== undefined ? vital.spo2 : "",
      weight:
        vital.weight !== null && vital.weight !== undefined
          ? vital.weight
          : "",
      notes: vital.notes || "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
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

    if (
      formData.blood_pressure.trim() === "" &&
      formData.blood_sugar === "" &&
      formData.pulse_rate === "" &&
      formData.spo2 === "" &&
      formData.weight === ""
    ) {
      setError("Please enter at least one health measurement.");
      return;
    }

    if (formData.blood_pressure) {
      const bpPattern = /^\d{2,3}\/\d{2,3}$/;

      if (!bpPattern.test(formData.blood_pressure.trim())) {
        setError("Blood pressure must be in the format 120/80.");
        return;
      }
    }

    setSaving(true);

    const payload = {
      family_member: Number(formData.family_member),
      blood_pressure: formData.blood_pressure.trim(),
      blood_sugar:
        formData.blood_sugar !== ""
          ? Number(formData.blood_sugar)
          : null,
      pulse_rate:
        formData.pulse_rate !== "" ? Number(formData.pulse_rate) : null,
      spo2: formData.spo2 !== "" ? Number(formData.spo2) : null,
      weight: formData.weight !== "" ? Number(formData.weight) : null,
      notes: formData.notes.trim(),
    };

    try {
      if (editingId) {
        const response = await api.put(
          `family/vitals/${editingId}/`,
          payload
        );

        setVitals((previous) =>
          previous.map((vital) =>
            vital.id === editingId ? response.data : vital
          )
        );

        setMessage("Health record updated successfully.");
      } else {
        const response = await api.post("family/vitals/", payload);

        setVitals((previous) => [...previous, response.data]);

        setMessage("Health record added successfully.");
      }

      resetForm();
    } catch (err) {
      console.error(
        "Save Health Record Error:",
        err.response?.data || err
      );

      const apiError = err.response?.data;

      if (typeof apiError === "object" && apiError !== null) {
        const firstError = Object.values(apiError)[0];

        if (Array.isArray(firstError)) {
          setError(firstError[0]);
        } else if (typeof firstError === "string") {
          setError(firstError);
        } else {
          setError("Failed to save health record.");
        }
      } else {
        setError("Failed to save health record. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this health record?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");
    setDeletingId(id);

    try {
      await api.delete(`family/vitals/${id}/`);

      setVitals((previous) =>
        previous.filter((vital) => vital.id !== id)
      );

      setMessage("Health record deleted successfully.");

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(
        "Delete Health Record Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to delete health record. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getMember = (memberId) => {
    return familyMembers.find(
      (member) => member.id === memberId
    );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
              Health
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Health Records
            </h1>

            <p className="mt-2 max-w-2xl text-slate-500">
              Track important health measurements for your family in
              one place.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            <span className="text-xl">+</span>
            Add Health Record
          </button>
        </div>

        {/* MESSAGES */}
        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
            <span className="text-lg">✓</span>
            <p className="font-medium">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            <span className="text-lg">⚠</span>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-blue-600">
                    {editingId ? "EDIT RECORD" : "NEW RECORD"}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {editingId
                      ? "Edit Health Record"
                      : "Add Health Record"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter the available health measurements.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg px-3 py-2 text-xl text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  aria-label="Close form"
                >
                  ×
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              {/* FAMILY MEMBER */}
              <div className="mb-6">
                <label className={labelClass}>
                  Family Member <span className="text-red-500">*</span>
                </label>

                <select
                  name="family_member"
                  value={formData.family_member}
                  onChange={handleChange}
                  className={inputClass}
                  required
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

              {/* MEASUREMENTS */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">

                {/* BP */}
                <div>
                  <label className={labelClass}>
                    Blood Pressure
                  </label>

                  <input
                    type="text"
                    name="blood_pressure"
                    value={formData.blood_pressure}
                    onChange={handleChange}
                    placeholder="120/80"
                    className={inputClass}
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Example: 120/80
                  </p>
                </div>

                {/* SUGAR */}
                <div>
                  <label className={labelClass}>
                    Blood Sugar
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="blood_sugar"
                    value={formData.blood_sugar}
                    onChange={handleChange}
                    placeholder="110"
                    className={inputClass}
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    mg/dL
                  </p>
                </div>

                {/* PULSE */}
                <div>
                  <label className={labelClass}>
                    Pulse Rate
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="pulse_rate"
                    value={formData.pulse_rate}
                    onChange={handleChange}
                    placeholder="72"
                    className={inputClass}
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    bpm
                  </p>
                </div>

                {/* SPO2 */}
                <div>
                  <label className={labelClass}>
                    SpO₂
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    name="spo2"
                    value={formData.spo2}
                    onChange={handleChange}
                    placeholder="98"
                    className={inputClass}
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    %
                  </p>
                </div>

                {/* WEIGHT */}
                <div>
                  <label className={labelClass}>
                    Weight
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="70"
                    className={inputClass}
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    kg
                  </p>
                </div>
              </div>

              {/* NOTES */}
              <div className="mt-6">
                <label className={labelClass}>
                  Notes
                </label>

                <textarea
                  name="notes"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional health notes..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* FORM BUTTONS */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Health Record"
                    : "Save Health Record"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl bg-slate-100 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

            <p className="font-medium text-slate-600">
              Loading health records...
            </p>
          </div>
        ) : vitals.length === 0 ? (
          /* EMPTY STATE */
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm md:p-16">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
              ❤️
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              No health records yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Add blood pressure, sugar, pulse, SpO₂, weight, or
              other health information to start tracking your family
              health.
            </p>

            <button
              type="button"
              onClick={openAddForm}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              + Add First Health Record
            </button>
          </div>
        ) : (
          /* RECORDS */
          <div className="grid grid-cols-1 gap-5">
            {vitals.map((vital) => {
              const member = getMember(vital.family_member);

              return (
                <div
                  key={vital.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* RECORD HEADER */}
                  <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                        ❤️
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {member?.name || "Family Member"}
                        </h2>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {member?.relation && (
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                              {member.relation}
                            </span>
                          )}

                          {vital.created_at && (
                            <span className="text-xs text-slate-400">
                              {formatDate(vital.created_at)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(vital)}
                        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-600 ring-1 ring-slate-200 transition hover:bg-blue-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(vital.id)}
                        disabled={deletingId === vital.id}
                        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-600 ring-1 ring-slate-200 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === vital.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>

                  {/* VALUES */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">

                      {/* BP */}
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Blood Pressure
                        </p>

                        <p className="mt-2 text-xl font-bold text-slate-900">
                          {vital.blood_pressure || "--"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          mmHg
                        </p>
                      </div>

                      {/* SUGAR */}
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Blood Sugar
                        </p>

                        <p className="mt-2 text-xl font-bold text-slate-900">
                          {vital.blood_sugar ?? "--"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          mg/dL
                        </p>
                      </div>

                      {/* PULSE */}
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Pulse
                        </p>

                        <p className="mt-2 text-xl font-bold text-slate-900">
                          {vital.pulse_rate ?? "--"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          bpm
                        </p>
                      </div>

                      {/* SPO2 */}
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          SpO₂
                        </p>

                        <p className="mt-2 text-xl font-bold text-slate-900">
                          {vital.spo2 ?? "--"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          %
                        </p>
                      </div>

                      {/* WEIGHT */}
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Weight
                        </p>

                        <p className="mt-2 text-xl font-bold text-slate-900">
                          {vital.weight ?? "--"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          kg
                        </p>
                      </div>
                    </div>

                    {/* NOTES */}
                    {vital.notes && (
                      <div className="mt-5 rounded-xl border border-slate-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Notes
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                          {vital.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MEDICAL INFORMATION DISCLAIMER */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm leading-6 text-amber-800">
            <strong>Note:</strong> These records are for personal
            health tracking only. They are not a medical diagnosis.
            Always consult a qualified doctor for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HealthRecords;