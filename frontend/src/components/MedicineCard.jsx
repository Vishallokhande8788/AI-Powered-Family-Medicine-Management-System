function MedicineCard({
  name,
  dosage,
  mealRelation,
  time,
  status,
}) {
  const isTaken = status === "taken";

  const formattedTime = time
    ? new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--";

  const formattedMealRelation =
    mealRelation === "after_food"
      ? "After food"
      : mealRelation === "before_food"
      ? "Before food"
      : mealRelation === "with_food"
      ? "With food"
      : mealRelation;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition">

      <div className="flex items-center gap-4">

        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
          💊
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">
            {name}
          </h4>

          <p className="text-sm text-slate-500">
            {dosage} • {formattedMealRelation}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            {formattedTime}
          </p>
        </div>

      </div>

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