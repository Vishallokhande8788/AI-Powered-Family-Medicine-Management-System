import { useEffect, useState } from "react";
import api from "../api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    family_member: "",
    name: "",
    specialization: "",
    hospital: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [doctorsResponse, familyResponse] = await Promise.all([
        api.get("family/doctors/"),
        api.get("family/family-members/"),
      ]);

      setDoctors(doctorsResponse.data);
      setFamilyMembers(familyResponse.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      family_member: "",
      name: "",
      specialization: "",
      hospital: "",
      phone: "",
      notes: "",
    });

    setEditingDoctor(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.family_member) {
      setError("Please select a family member.");
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter the doctor's name.");
      return;
    }

    try {
      setSaving(true);

      const data = {
        family_member: Number(form.family_member),
        name: form.name.trim(),
        specialization: form.specialization.trim(),
        hospital: form.hospital.trim(),
        phone: form.phone.trim(),
        notes: form.notes.trim(),
      };

      if (editingDoctor) {
        const response = await api.put(
          `family/doctors/${editingDoctor.id}/`,
          data
        );

        setDoctors((previous) =>
          previous.map((doctor) =>
            doctor.id === editingDoctor.id ? response.data : doctor
          )
        );

        setMessage("Doctor updated successfully.");
      } else {
        const response = await api.post("family/doctors/", data);

        setDoctors((previous) => [...previous, response.data]);

        setMessage("Doctor added successfully.");
      }

      resetForm();
    } catch (err) {
      console.error(err);

      const backendError = err.response?.data;

      if (backendError) {
        setError(
          typeof backendError === "string"
            ? backendError
            : "Unable to save doctor. Please check the form."
        );
      } else {
        setError("Unable to save doctor. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);

    setForm({
      family_member: String(doctor.family_member || ""),
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      hospital: doctor.hospital || "",
      phone: doctor.phone || "",
      notes: doctor.notes || "",
    });

    setMessage("");
    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (doctor) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Dr. ${doctor.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.delete(`family/doctors/${doctor.id}/`);

      setDoctors((previous) =>
        previous.filter((item) => item.id !== doctor.id)
      );

      setMessage("Doctor deleted successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to delete doctor. Please try again.");
    }
  };

  const getFamilyMemberName = (familyMemberId) => {
    const member = familyMembers.find(
      (item) => item.id === familyMemberId
    );

    if (!member) {
      return "Unknown family member";
    }

    return `${member.name} (${member.relation})`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-blue-600">
              FAMILY CARE
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Doctors
            </h1>

            <p className="mt-2 text-gray-500">
              Manage doctors and healthcare providers for your family.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setMessage("");
              setError("");
              setEditingDoctor(null);

              setForm({
                family_member: "",
                name: "",
                specialization: "",
                hospital: "",
                phone: "",
                notes: "",
              });

              setShowForm(true);
            }}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Add Doctor
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingDoctor ? "Edit Doctor" : "Add Doctor"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add basic information about the healthcare provider.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                {/* Family Member */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Family Member *
                  </label>

                  <select
                    name="family_member"
                    value={form.family_member}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select family member</option>

                    {familyMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.relation})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Doctor Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Doctor Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Rakesh Sharma"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Specialization
                  </label>

                  <input
                    type="text"
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Cardiologist"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Hospital */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Hospital / Clinic
                  </label>

                  <input
                    type="text"
                    name="hospital"
                    value={form.hospital}
                    onChange={handleChange}
                    placeholder="e.g. City Hospital"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Add any useful notes about this doctor..."
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingDoctor
                    ? "Update Doctor"
                    : "Save Doctor"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="text-sm text-gray-500">
              Loading doctors...
            </p>
          </div>
        ) : doctors.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
              👨‍⚕️
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              No doctors added yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Add your family's doctors and healthcare providers
              to keep important contact information organized.
            </p>

            <button
              type="button"
              onClick={() => {
                setMessage("");
                setError("");
                setEditingDoctor(null);
                setShowForm(true);
              }}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + Add First Doctor
            </button>
          </div>
        ) : (
          /* Doctor Cards */
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Doctor Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                      👨‍⚕️
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold text-gray-900">
                        Dr. {doctor.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {doctor.specialization ||
                          "Healthcare Provider"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Family Member */}
                <div className="mt-5 rounded-xl bg-gray-50 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Family Member
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {getFamilyMemberName(doctor.family_member)}
                  </p>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-3">
                  {doctor.hospital && (
                    <div className="flex gap-3">
                      <span className="text-lg">🏥</span>

                      <div>
                        <p className="text-xs text-gray-400">
                          Hospital / Clinic
                        </p>

                        <p className="text-sm font-medium text-gray-700">
                          {doctor.hospital}
                        </p>
                      </div>
                    </div>
                  )}

                  {doctor.phone && (
                    <div className="flex gap-3">
                      <span className="text-lg">📞</span>

                      <div>
                        <p className="text-xs text-gray-400">
                          Phone
                        </p>

                        <p className="text-sm font-medium text-gray-700">
                          {doctor.phone}
                        </p>
                      </div>
                    </div>
                  )}

                  {doctor.notes && (
                    <div className="flex gap-3">
                      <span className="text-lg">📝</span>

                      <div>
                        <p className="text-xs text-gray-400">
                          Notes
                        </p>

                        <p className="whitespace-pre-wrap text-sm text-gray-600">
                          {doctor.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(doctor)}
                    className="flex-1 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(doctor)}
                    className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Small Disclaimer */}
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-700">
          Keep doctor contact information updated. This section is
          for organizing family healthcare information and does not
          replace professional medical advice.
        </div>
      </div>
    </div>
  );
}

export default Doctors;