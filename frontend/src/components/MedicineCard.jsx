function MedicineCard({
  name,
  dosage,
  mealRelation,
  time,
  status,
}) {
  const isTaken = status === "taken";

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition">

      {/* MEDICINE INFO */}
      <div className="flex items-center gap-4">

        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
          💊
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">
            {name}
          </h4>

          <p className="text-sm text-slate-500">
            {dosage} • {mealRelation}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            {time}
          </p>
        </div>

      </div>

      {/* STATUS */}
      <span
        className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
          isTaken
            ? "bg-emerald-100 text-emerald-700"
            : "bg-orange-100 text-orange-700"
        }`}
      >
        {isTaken ? "✓ Taken" : "⏰ Pending"}
      </span>

    </div>
  );
}

export default MedicineCard;