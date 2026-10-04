function QuickActionCard({
  icon,
  title,
  description,
  highlighted = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl p-6 border transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
        highlighted
          ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="text-3xl mb-4">
        {icon}
      </div>

      <h4 className="font-semibold">
        {title}
      </h4>

      <p
        className={`text-sm mt-1 ${
          highlighted ? "text-blue-100" : "text-slate-500"
        }`}
      >
        {description}
      </p>
    </button>
  );
}

export default QuickActionCard;