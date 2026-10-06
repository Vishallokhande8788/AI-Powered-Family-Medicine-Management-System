import { useEffect, useState } from "react";
import api from "../api";

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(null);

  const [editingMedicine, setEditingMedicine] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const [savingMedicine, setSavingMedicine] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);

  const [deletingMedicine, setDeletingMedicine] = useState(false);
  const [deletingSchedule, setDeletingSchedule] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [medicineForm, setMedicineForm] = useState({
    family_member: "",
    name: "",
    dosage: "",
    quantity: "",
    instructions: "",
    start_date: "",
    end_date: "",
  });

  const [scheduleForm, setScheduleForm] = useState({
    time: "",
    dosage: "",
    meal_relation: "anytime",
    start_date: "",
    end_date: "",
  });

  // --------------------------------
  // LOAD DATA
  // --------------------------------

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("access");

      api.defaults.headers.common["Authorization"] =
        `Bearer ${accessToken}`;

      const [
        medicineResponse,
        familyResponse,
        scheduleResponse,
      ] = await Promise.all([
        api.get("medicines/medicines/"),
        api.get("family/family-members/"),
        api.get("medicines/schedules/"),
      ]);

      setMedicines(medicineResponse.data);
      setFamilyMembers(familyResponse.data);
      setSchedules(scheduleResponse.data);

      console.log("Medicines:", medicineResponse.data);
      console.log("Family Members:", familyResponse.data);
      console.log("Schedules:", scheduleResponse.data);
    } catch (error) {
      console.log(
        "Medicines Page Error:",
        error.response?.data
      );

      setError("Failed to load medicine information.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // COMMON HELPERS
  // --------------------------------

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  const resetMedicineForm = () => {
    setMedicineForm({
      family_member: "",
      name: "",
      dosage: "",
      quantity: "",
      instructions: "",
      start_date: "",
      end_date: "",
    });

    setEditingMedicine(null);
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      time: "",
      dosage: "",
      meal_relation: "anytime",
      start_date: "",
      end_date: "",
    });

    setEditingSchedule(null);
  };

  const getFamilyMemberName = (id) => {
    const member = familyMembers.find(
      (item) => item.id === id
    );

    return member
      ? `${member.name} (${member.relation})`
      : "Family Member";
  };

  const getMealRelation = (value) => {
    const labels = {
      before_food: "Before Food",
      after_food: "After Food",
      with_food: "With Food",
      anytime: "Anytime",
    };

    return labels[value] || value;
  };

  // --------------------------------
  // MEDICINE FORM
  // --------------------------------

  const handleMedicineChange = (e) => {
    setMedicineForm({
      ...medicineForm,
      [e.target.name]: e.target.value,
    });
  };

  const openAddMedicine = () => {
    clearMessages();
    resetMedicineForm();
    setShowMedicineForm(true);
  };

  const openEditMedicine = (medicine) => {
    clearMessages();

    setEditingMedicine(medicine);

    setMedicineForm({
      family_member: medicine.family_member,
      name: medicine.name,
      dosage: medicine.dosage,
      quantity: medicine.quantity ?? "",
      instructions: medicine.instructions || "",
      start_date: medicine.start_date,
      end_date: medicine.end_date || "",
    });

    setShowMedicineForm(true);
  };

  const closeMedicineForm = () => {
    setShowMedicineForm(false);
    resetMedicineForm();
    clearMessages();
  };

  const handleMedicineSubmit = async (e) => {
    e.preventDefault();

    clearMessages();

    if (
      !medicineForm.family_member ||
      !medicineForm.name.trim() ||
      !medicineForm.dosage.trim() ||
      !medicineForm.start_date
    ) {
      setError(
        "Please fill Family Member, Medicine Name, Dosage and Start Date."
      );
      return;
    }

    if (
      medicineForm.end_date &&
      medicineForm.end_date < medicineForm.start_date
    ) {
      setError(
        "End Date cannot be before Start Date."
      );
      return;
    }

    setSavingMedicine(true);

    const data = {
      family_member: Number(
        medicineForm.family_member
      ),
      name: medicineForm.name.trim(),
      dosage: medicineForm.dosage.trim(),
      quantity: medicineForm.quantity
        ? Number(medicineForm.quantity)
        : 0,
      instructions:
        medicineForm.instructions.trim(),
      start_date: medicineForm.start_date,
      end_date:
        medicineForm.end_date || null,
    };

    try {
      if (editingMedicine) {
        const response = await api.put(
          `medicines/medicines/${editingMedicine.id}/`,
          data
        );

        setMedicines((previous) =>
          previous.map((medicine) =>
            medicine.id === editingMedicine.id
              ? response.data
              : medicine
          )
        );

        setMessage(
          "Medicine updated successfully."
        );
      } else {
        const response = await api.post(
          "medicines/medicines/",
          data
        );

        setMedicines((previous) => [
          ...previous,
          response.data,
        ]);

        setMessage(
          "Medicine added successfully."
        );
      }

      resetMedicineForm();
      setShowMedicineForm(false);
    } catch (error) {
      console.log(
        "Medicine Save Error:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
          "Failed to save medicine."
      );
    } finally {
      setSavingMedicine(false);
    }
  };

  // --------------------------------
  // DELETE MEDICINE
  // --------------------------------

  const handleDeleteMedicine = async (medicine) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${medicine.name}"?\n\nIts schedules will also be removed.`
    );

    if (!confirmed) {
      return;
    }

    clearMessages();
    setDeletingMedicine(true);

    try {
      await api.delete(
        `medicines/medicines/${medicine.id}/`
      );

      setMedicines((previous) =>
        previous.filter(
          (item) => item.id !== medicine.id
        )
      );

      setSchedules((previous) =>
        previous.filter(
          (item) =>
            item.medicine !== medicine.id
        )
      );

      setMessage(
        "Medicine deleted successfully."
      );
    } catch (error) {
      console.log(
        "Delete Medicine Error:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
          "Failed to delete medicine."
      );
    } finally {
      setDeletingMedicine(false);
    }
  };

  // --------------------------------
  // SCHEDULE FORM
  // --------------------------------

  const handleScheduleChange = (e) => {
    setScheduleForm({
      ...scheduleForm,
      [e.target.name]: e.target.value,
    });
  };

  const openAddSchedule = (medicineId) => {
    clearMessages();

    resetScheduleForm();

    setShowScheduleForm(medicineId);
  };

  const openEditSchedule = (schedule) => {
    clearMessages();

    setEditingSchedule(schedule);

    setScheduleForm({
      time: schedule.time || "",
      dosage: schedule.dosage || "",
      meal_relation:
        schedule.meal_relation || "anytime",
      start_date: schedule.start_date || "",
      end_date: schedule.end_date || "",
    });

    setShowScheduleForm(schedule.medicine);
  };

  const closeScheduleForm = () => {
    setShowScheduleForm(null);
    resetScheduleForm();
    clearMessages();
  };

  const handleScheduleSubmit = async (
    e,
    medicineId
  ) => {
    e.preventDefault();

    clearMessages();

    if (
      !scheduleForm.time ||
      !scheduleForm.dosage.trim() ||
      !scheduleForm.start_date
    ) {
      setError(
        "Please fill Time, Dosage and Start Date."
      );
      return;
    }

    if (
      scheduleForm.end_date &&
      scheduleForm.end_date <
        scheduleForm.start_date
    ) {
      setError(
        "End Date cannot be before Start Date."
      );
      return;
    }

    setSavingSchedule(true);

    const data = {
      medicine: medicineId,
      time: scheduleForm.time,
      dosage: scheduleForm.dosage.trim(),
      meal_relation:
        scheduleForm.meal_relation,
      start_date: scheduleForm.start_date,
      end_date:
        scheduleForm.end_date || null,
    };

    try {
      if (editingSchedule) {
        const response = await api.put(
          `medicines/schedules/${editingSchedule.id}/`,
          data
        );

        setSchedules((previous) =>
          previous.map((schedule) =>
            schedule.id === editingSchedule.id
              ? response.data
              : schedule
          )
        );

        setMessage(
          "Schedule updated successfully."
        );
      } else {
        const response = await api.post(
          "medicines/schedules/",
          data
        );

        setSchedules((previous) => [
          ...previous,
          response.data,
        ]);

        setMessage(
          "Schedule added successfully."
        );
      }

      resetScheduleForm();
      setShowScheduleForm(null);
    } catch (error) {
      console.log(
        "Schedule Save Error:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
          "Failed to save schedule."
      );
    } finally {
      setSavingSchedule(false);
    }
  };

  // --------------------------------
  // DELETE SCHEDULE
  // --------------------------------

  const handleDeleteSchedule = async (
    schedule
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medicine schedule?"
    );

    if (!confirmed) {
      return;
    }

    clearMessages();
    setDeletingSchedule(true);

    try {
      await api.delete(
        `medicines/schedules/${schedule.id}/`
      );

      setSchedules((previous) =>
        previous.filter(
          (item) => item.id !== schedule.id
        )
      );

      setMessage(
        "Schedule deleted successfully."
      );
    } catch (error) {
      console.log(
        "Delete Schedule Error:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail ||
          "Failed to delete schedule."
      );
    } finally {
      setDeletingSchedule(false);
    }
  };

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="min-h-screen bg-slate-50">

      {/* TOP AREA */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                  💊
                </div>

                <div>
                  <p className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                    Treatment Management
                  </p>

                  <h1 className="text-3xl font-bold text-slate-900">
                    Medicines
                  </h1>
                </div>
              </div>

              <p className="text-slate-500 mt-3 max-w-2xl">
                Manage medicines, doses and daily
                schedules for your family members.
              </p>

            </div>

            <button
              onClick={openAddMedicine}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition"
            >
              <span className="text-lg">
                +
              </span>
              Add Medicine
            </button>

          </div>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* SUCCESS */}
        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">

            <span className="text-lg">
              ✓
            </span>

            <p className="font-medium">
              {message}
            </p>

          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">

            <span className="text-lg">
              ⚠
            </span>

            <p className="font-medium">
              {error}
            </p>

          </div>
        )}

        {/* MEDICINE FORM */}
        {showMedicineForm && (
          <div className="mb-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Medicine
                </p>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {editingMedicine
                    ? "Edit Medicine"
                    : "Add Medicine"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeMedicineForm}
                className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleMedicineSubmit}
              className="p-6"
            >

              {/* FAMILY MEMBER */}
              <div className="mb-5">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Family Member *
                </label>

                <select
                  name="family_member"
                  value={
                    medicineForm.family_member
                  }
                  onChange={
                    handleMedicineChange
                  }
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                >

                  <option value="">
                    Select family member
                  </option>

                  {familyMembers.map(
                    (member) => (
                      <option
                        key={member.id}
                        value={member.id}
                      >
                        {member.name} (
                        {member.relation})
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* NAME */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Medicine Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={medicineForm.name}
                    onChange={
                      handleMedicineChange
                    }
                    placeholder="Example: Amlodipine"
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                  />

                </div>

                {/* DOSAGE */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Dosage *
                  </label>

                  <input
                    type="text"
                    name="dosage"
                    value={
                      medicineForm.dosage
                    }
                    onChange={
                      handleMedicineChange
                    }
                    placeholder="Example: 1 tablet"
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                  />

                </div>

                {/* QUANTITY */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="quantity"
                    value={
                      medicineForm.quantity
                    }
                    onChange={
                      handleMedicineChange
                    }
                    placeholder="Example: 30"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                  />

                </div>

                {/* START DATE */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Start Date *
                  </label>

                  <input
                    type="date"
                    name="start_date"
                    value={
                      medicineForm.start_date
                    }
                    onChange={
                      handleMedicineChange
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                  />

                </div>

                {/* END DATE */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="end_date"
                    value={
                      medicineForm.end_date
                    }
                    onChange={
                      handleMedicineChange
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition"
                  />

                </div>

              </div>

              {/* INSTRUCTIONS */}
              <div className="mt-5">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Instructions
                </label>

                <textarea
                  name="instructions"
                  value={
                    medicineForm.instructions
                  }
                  onChange={
                    handleMedicineChange
                  }
                  rows="3"
                  placeholder="Example: After food"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition resize-none"
                />

              </div>

              {/* FORM BUTTONS */}
              <div className="flex flex-wrap gap-3 mt-6">

                <button
                  type="submit"
                  disabled={savingMedicine}
                  className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingMedicine
                    ? "Saving..."
                    : editingMedicine
                    ? "Update Medicine"
                    : "Save Medicine"}
                </button>

                <button
                  type="button"
                  onClick={closeMedicineForm}
                  className="px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

            <div className="text-4xl mb-4">
              💊
            </div>

            <p className="text-slate-500 font-medium">
              Loading medicines...
            </p>

          </div>
        ) : medicines.length === 0 ? (

          /* EMPTY */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

            <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 flex items-center justify-center text-4xl">
              💊
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-5">
              No medicines yet
            </h2>

            <p className="text-slate-500 mt-2">
              Add a medicine to start tracking
              treatment.
            </p>

            <button
              onClick={openAddMedicine}
              className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              + Add First Medicine
            </button>

          </div>

        ) : (

          /* MEDICINE CARDS */
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

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
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden"
                >

                  {/* MEDICINE HEADER */}
                  <div className="p-6">

                    <div className="flex items-start gap-4">

                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">
                        💊
                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                          <div>

                            <h2 className="text-xl font-bold text-slate-900">
                              {medicine.name}
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                              {getFamilyMemberName(
                                medicine.family_member
                              )}
                            </p>

                          </div>

                          <span className="self-start px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                            Active
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* MEDICINE DETAILS */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">

                      <div className="bg-slate-50 rounded-xl p-3">

                        <p className="text-xs text-slate-500">
                          Dosage
                        </p>

                        <p className="font-semibold text-slate-900 mt-1">
                          {medicine.dosage}
                        </p>

                      </div>

                      <div className="bg-slate-50 rounded-xl p-3">

                        <p className="text-xs text-slate-500">
                          Quantity
                        </p>

                        <p className="font-semibold text-slate-900 mt-1">
                          {medicine.quantity}
                        </p>

                      </div>

                      <div className="bg-slate-50 rounded-xl p-3">

                        <p className="text-xs text-slate-500">
                          Start
                        </p>

                        <p className="font-semibold text-slate-900 mt-1">
                          {medicine.start_date}
                        </p>

                      </div>

                      <div className="bg-slate-50 rounded-xl p-3">

                        <p className="text-xs text-slate-500">
                          End
                        </p>

                        <p className="font-semibold text-slate-900 mt-1">
                          {medicine.end_date ||
                            "No end"}
                        </p>

                      </div>

                    </div>

                    {/* INSTRUCTIONS */}
                    {medicine.instructions && (
                      <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-100">

                        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                          Instructions
                        </p>

                        <p className="text-sm text-slate-700 mt-1">
                          {medicine.instructions}
                        </p>

                      </div>
                    )}

                    {/* MEDICINE ACTIONS */}
                    <div className="flex flex-wrap gap-3 mt-5">

                      <button
                        onClick={() =>
                          openEditMedicine(
                            medicine
                          )
                        }
                        className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg font-semibold hover:bg-amber-100 transition"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteMedicine(
                            medicine
                          )
                        }
                        disabled={deletingMedicine}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition disabled:opacity-50"
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                  {/* SCHEDULE SECTION */}
                  <div className="border-t border-slate-100 bg-slate-50/70 p-6">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      <div>

                        <h3 className="font-bold text-slate-900">
                          Medicine Schedule
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          {medicineSchedules.length}{" "}
                          schedule
                          {medicineSchedules.length !==
                          1
                            ? "s"
                            : ""}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          openAddSchedule(
                            medicine.id
                          )
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        + Add Schedule
                      </button>

                    </div>

                    {/* SCHEDULE FORM */}
                    {showScheduleForm ===
                      medicine.id && (
                      <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-5">

                        <div className="flex items-center justify-between mb-5">

                          <div>

                            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                              Schedule
                            </p>

                            <h4 className="text-lg font-bold text-slate-900 mt-1">
                              {editingSchedule
                                ? "Edit Schedule"
                                : "Add Schedule"}
                            </h4>

                          </div>

                          <button
                            type="button"
                            onClick={
                              closeScheduleForm
                            }
                            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
                          >
                            ✕
                          </button>

                        </div>

                        <form
                          onSubmit={(e) =>
                            handleScheduleSubmit(
                              e,
                              medicine.id
                            )
                          }
                        >

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* TIME */}
                            <div>

                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Time *
                              </label>

                              <input
                                type="time"
                                name="time"
                                value={
                                  scheduleForm.time
                                }
                                onChange={
                                  handleScheduleChange
                                }
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                              />

                            </div>

                            {/* DOSAGE */}
                            <div>

                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Dosage *
                              </label>

                              <input
                                type="text"
                                name="dosage"
                                value={
                                  scheduleForm.dosage
                                }
                                onChange={
                                  handleScheduleChange
                                }
                                placeholder="Example: 1 tablet"
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                              />

                            </div>

                            {/* MEAL */}
                            <div>

                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Meal Relation
                              </label>

                              <select
                                name="meal_relation"
                                value={
                                  scheduleForm.meal_relation
                                }
                                onChange={
                                  handleScheduleChange
                                }
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
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

                            {/* START */}
                            <div>

                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Start Date *
                              </label>

                              <input
                                type="date"
                                name="start_date"
                                value={
                                  scheduleForm.start_date
                                }
                                onChange={
                                  handleScheduleChange
                                }
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                              />

                            </div>

                            {/* END */}
                            <div>

                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                End Date
                              </label>

                              <input
                                type="date"
                                name="end_date"
                                value={
                                  scheduleForm.end_date
                                }
                                onChange={
                                  handleScheduleChange
                                }
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                              />

                            </div>

                          </div>

                          <div className="flex flex-wrap gap-3 mt-5">

                            <button
                              type="submit"
                              disabled={
                                savingSchedule
                              }
                              className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                              {savingSchedule
                                ? "Saving..."
                                : editingSchedule
                                ? "Update Schedule"
                                : "Save Schedule"}
                            </button>

                            <button
                              type="button"
                              onClick={
                                closeScheduleForm
                              }
                              className="px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                            >
                              Cancel
                            </button>

                          </div>

                        </form>

                      </div>
                    )}

                    {/* SCHEDULE LIST */}
                    {medicineSchedules.length ===
                    0 ? (
                      <div className="mt-5 p-5 bg-white border border-dashed border-slate-300 rounded-xl text-center">

                        <p className="text-2xl">
                          🕐
                        </p>

                        <p className="text-sm font-semibold text-slate-700 mt-2">
                          No schedule added
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          Add a time to track this
                          medicine.
                        </p>

                      </div>
                    ) : (
                      <div className="mt-5 space-y-3">

                        {medicineSchedules.map(
                          (schedule) => (
                            <div
                              key={schedule.id}
                              className="bg-white border border-slate-200 rounded-xl p-4"
                            >

                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                <div className="flex items-start gap-3">

                                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                                    🕐
                                  </div>

                                  <div>

                                    <p className="font-bold text-slate-900">
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

                                </div>

                                <div className="flex gap-2">

                                  <button
                                    onClick={() =>
                                      openEditSchedule(
                                        schedule
                                      )
                                    }
                                    className="px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold hover:bg-amber-100 transition"
                                  >
                                    ✏️ Edit
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDeleteSchedule(
                                        schedule
                                      )
                                    }
                                    disabled={
                                      deletingSchedule
                                    }
                                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition disabled:opacity-50"
                                  >
                                    🗑️ Delete
                                  </button>

                                </div>

                              </div>

                            </div>
                          )
                        )}

                      </div>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </main>

    </div>
  );
}

export default Medicines;