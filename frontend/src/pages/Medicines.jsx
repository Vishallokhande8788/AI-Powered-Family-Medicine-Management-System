import { useEffect, useState } from "react";
import api from "../api";

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(null);

  const [saving, setSaving] = useState(false);
  const [scheduleSaving, setScheduleSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    family_member: "",
    name: "",
    dosage: "",
    quantity: "",
    instructions: "",
    start_date: "",
    end_date: "",
  });

  const [scheduleData, setScheduleData] = useState({
    time: "",
    dosage: "",
    meal_relation: "anytime",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("access");

    api.defaults.headers.common["Authorization"] =
      `Bearer ${accessToken}`;

    Promise.all([
      api.get("medicines/medicines/"),
      api.get("family/family-members/"),
      api.get("medicines/schedules/"),
    ])
      .then(
        ([
          medicineResponse,
          familyResponse,
          scheduleResponse,
        ]) => {
          console.log("Medicines:", medicineResponse.data);
          console.log(
            "Family Members:",
            familyResponse.data
          );
          console.log(
            "Schedules:",
            scheduleResponse.data
          );

          setMedicines(medicineResponse.data);
          setFamilyMembers(familyResponse.data);
          setSchedules(scheduleResponse.data);
        }
      )
      .catch((error) => {
        console.log(
          "Medicines Page Error:",
          error.response?.data
        );

        setError("Failed to load medicines.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // -----------------------------
  // MEDICINE FORM
  // -----------------------------

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

    if (
      !formData.family_member ||
      !formData.name ||
      !formData.dosage ||
      !formData.start_date
    ) {
      setError(
        "Please fill Family Member, Medicine Name, Dosage and Start Date."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await api.post(
        "medicines/medicines/",
        {
          family_member: Number(
            formData.family_member
          ),
          name: formData.name,
          dosage: formData.dosage,
          quantity: formData.quantity
            ? Number(formData.quantity)
            : 0,
          instructions: formData.instructions,
          start_date: formData.start_date,
          end_date: formData.end_date || null,
        }
      );

      console.log(
        "Medicine Created:",
        response.data
      );

      setMedicines((prev) => [
        ...prev,
        response.data,
      ]);

      setMessage(
        "Medicine added successfully."
      );

      setFormData({
        family_member: "",
        name: "",
        dosage: "",
        quantity: "",
        instructions: "",
        start_date: "",
        end_date: "",
      });

      setShowForm(false);
    } catch (error) {
      console.log(
        "Create Medicine Error:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
          "Failed to add medicine."
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // SCHEDULE FORM
  // -----------------------------

  const handleScheduleChange = (e) => {
    setScheduleData({
      ...scheduleData,
      [e.target.name]: e.target.value,
    });
  };

  const handleScheduleSubmit = async (
    e,
    medicineId
  ) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !scheduleData.time ||
      !scheduleData.dosage ||
      !scheduleData.start_date
    ) {
      setError(
        "Please fill Time, Dosage and Start Date."
      );
      return;
    }

    setScheduleSaving(true);

    try {
      const response = await api.post(
        "medicines/schedules/",
        {
          medicine: medicineId,
          time: scheduleData.time,
          dosage: scheduleData.dosage,
          meal_relation:
            scheduleData.meal_relation,
          start_date: scheduleData.start_date,
          end_date:
            scheduleData.end_date || null,
        }
      );

      console.log(
        "Schedule Created:",
        response.data
      );

      setSchedules((prev) => [
        ...prev,
        response.data,
      ]);

      setMessage(
        "Medicine schedule added successfully."
      );

      setScheduleData({
        time: "",
        dosage: "",
        meal_relation: "anytime",
        start_date: "",
        end_date: "",
      });

      setShowScheduleForm(null);
    } catch (error) {
      console.log(
        "Create Schedule Error:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
          "Failed to add schedule."
      );
    } finally {
      setScheduleSaving(false);
    }
  };

  // -----------------------------
  // FAMILY MEMBER NAME
  // -----------------------------

  const getFamilyMemberName = (id) => {
    const member = familyMembers.find(
      (item) => item.id === id
    );

    return member
      ? `${member.name} (${member.relation})`
      : "Family Member";
  };

  // -----------------------------
  // MEAL RELATION DISPLAY
  // -----------------------------

  const getMealRelation = (value) => {
    const labels = {
      before_food: "Before Food",
      after_food: "After Food",
      with_food: "With Food",
      anytime: "Anytime",
    };

    return labels[value] || value;
  };

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">

          <p className="text-blue-600 font-semibold text-sm">
            MEDICINES
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Medicines
          </h1>

          <p className="text-slate-500 mt-2">
            Manage medicines and treatment information
            for your family.
          </p>

          <button
            onClick={() => {
              setShowForm(true);
              setMessage("");
              setError("");
            }}
            className="mt-5 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            + Add Medicine
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

        {/* ADD MEDICINE FORM */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">

            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Add Medicine
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
                  required
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
                      {member.name} (
                      {member.relation})
                    </option>
                  ))}

                </select>

              </div>

              {/* FORM GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* MEDICINE NAME */}
                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Medicine Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Metformin"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* DOSAGE */}
                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Dosage *
                  </label>

                  <input
                    type="text"
                    name="dosage"
                    placeholder="e.g. 1 tablet"
                    value={formData.dosage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* QUANTITY */}
                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="quantity"
                    placeholder="e.g. 30"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* START DATE */}
                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date *
                  </label>

                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* END DATE */}
                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>

              {/* INSTRUCTIONS */}
              <div className="mt-5">

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Instructions
                </label>

                <textarea
                  name="instructions"
                  rows="3"
                  placeholder="e.g. After food"
                  value={formData.instructions}
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
                    : "Save Medicine"}
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

        {/* MEDICINES LIST */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
            Loading medicines...
          </div>
        ) : medicines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">

            <div className="text-5xl mb-4">
              💊
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              No medicines yet
            </h2>

            <p className="text-slate-500 mt-2">
              Add a medicine to start tracking
              treatment.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {medicines.map((medicine) => {

              const medicineSchedules =
                schedules.filter(
                  (schedule) =>
                    schedule.medicine ===
                    medicine.id
                );

              return (
                <div
                  key={medicine.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition"
                >

                  {/* MEDICINE HEADER */}
                  <div className="flex items-start gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                      💊
                    </div>

                    <div className="flex-1">

                      <h2 className="text-lg font-bold text-slate-900">
                        {medicine.name}
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        {getFamilyMemberName(
                          medicine.family_member
                        )}
                      </p>

                    </div>

                  </div>

                  {/* MEDICINE DETAILS */}
                  <div className="grid grid-cols-2 gap-4 mt-6">

                    <div>

                      <p className="text-sm text-slate-500">
                        Dosage
                      </p>

                      <p className="font-semibold text-slate-900 mt-1">
                        {medicine.dosage}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-slate-500">
                        Quantity
                      </p>

                      <p className="font-semibold text-slate-900 mt-1">
                        {medicine.quantity}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-slate-500">
                        Start Date
                      </p>

                      <p className="font-semibold text-slate-900 mt-1">
                        {medicine.start_date}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-slate-500">
                        End Date
                      </p>

                      <p className="font-semibold text-slate-900 mt-1">
                        {medicine.end_date ||
                          "--"}
                      </p>

                    </div>

                  </div>

                  {/* INSTRUCTIONS */}
                  {medicine.instructions && (
                    <div className="mt-5 pt-4 border-t border-slate-100">

                      <p className="text-sm text-slate-500">
                        Instructions
                      </p>

                      <p className="text-sm text-slate-700 mt-1">
                        {medicine.instructions}
                      </p>

                    </div>
                  )}

                  {/* ADD SCHEDULE */}
                  <div className="mt-6 pt-5 border-t border-slate-100">

                    <button
                      onClick={() => {
                        setShowScheduleForm(
                          medicine.id
                        );

                        setMessage("");
                        setError("");
                      }}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition"
                    >
                      + Add Schedule
                    </button>

                    {/* SCHEDULE FORM */}
                    {showScheduleForm ===
                      medicine.id && (
                      <form
                        onSubmit={(e) =>
                          handleScheduleSubmit(
                            e,
                            medicine.id
                          )
                        }
                        className="mt-5 bg-slate-50 rounded-xl p-5"
                      >

                        <h3 className="font-bold text-slate-900 mb-4">
                          Add Medicine Schedule
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          {/* TIME */}
                          <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Time *
                            </label>

                            <input
                              type="time"
                              name="time"
                              value={
                                scheduleData.time
                              }
                              onChange={
                                handleScheduleChange
                              }
                              required
                              className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                            />

                          </div>

                          {/* DOSAGE */}
                          <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Dosage *
                            </label>

                            <input
                              type="text"
                              name="dosage"
                              placeholder="e.g. 1 tablet"
                              value={
                                scheduleData.dosage
                              }
                              onChange={
                                handleScheduleChange
                              }
                              required
                              className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                            />

                          </div>

                          {/* MEAL RELATION */}
                          <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Meal Relation
                            </label>

                            <select
                              name="meal_relation"
                              value={
                                scheduleData.meal_relation
                              }
                              onChange={
                                handleScheduleChange
                              }
                              className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                            >

                              <option value="before_food">
                                Before Food
                              </option>

                              <option value="after_food">
                                After Food
                              </option>

                              <option value="with_food">
                                With Food
                              </option>

                              <option value="anytime">
                                Anytime
                              </option>

                            </select>

                          </div>

                          {/* START DATE */}
                          <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Start Date *
                            </label>

                            <input
                              type="date"
                              name="start_date"
                              value={
                                scheduleData.start_date
                              }
                              onChange={
                                handleScheduleChange
                              }
                              required
                              className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                            />

                          </div>

                          {/* END DATE */}
                          <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              End Date
                            </label>

                            <input
                              type="date"
                              name="end_date"
                              value={
                                scheduleData.end_date
                              }
                              onChange={
                                handleScheduleChange
                              }
                              className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                            />

                          </div>

                        </div>

                        {/* SCHEDULE BUTTONS */}
                        <div className="flex gap-3 mt-5">

                          <button
                            type="submit"
                            disabled={
                              scheduleSaving
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
                          >
                            {scheduleSaving
                              ? "Saving..."
                              : "Save Schedule"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setShowScheduleForm(
                                null
                              )
                            }
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold"
                          >
                            Cancel
                          </button>

                        </div>

                      </form>
                    )}

                    {/* EXISTING SCHEDULES */}
                    {medicineSchedules.length >
                      0 && (
                      <div className="mt-5">

                        <p className="text-sm font-semibold text-slate-700 mb-3">
                          Schedules
                        </p>

                        <div className="space-y-2">

                          {medicineSchedules.map(
                            (schedule) => (
                              <div
                                key={
                                  schedule.id
                                }
                                className="bg-blue-50 rounded-xl px-4 py-3"
                              >

                                <p className="font-semibold text-slate-900">
                                  🕐{" "}
                                  {schedule.time}
                                </p>

                                <p className="text-sm text-slate-600 mt-1">
                                  {
                                    schedule.dosage
                                  }{" "}
                                  •{" "}
                                  {getMealRelation(
                                    schedule.meal_relation
                                  )}
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                  {
                                    schedule.start_date
                                  }
                                  {" → "}
                                  {schedule.end_date ||
                                    "No end date"}
                                </p>

                              </div>
                            )
                          )}

                        </div>

                      </div>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default Medicines;