function StatCard({ icon, title, value, valueColor = "text-slate-900" }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition duration-200">

      <div className="text-3xl mb-4">
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className={`text-3xl font-bold mt-1 ${valueColor}`}>
        {value}
      </p>

    </div>
  );
}

export default StatCard;