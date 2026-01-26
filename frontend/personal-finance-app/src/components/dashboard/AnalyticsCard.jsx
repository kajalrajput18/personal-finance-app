const AnalyticsCard = ({ title, value, icon, color = "blue", subtitle }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    red: "bg-red-50 border-red-200",
    yellow: "bg-yellow-50 border-yellow-200",
  };

  const iconColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
  };

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-md border-l-4 hover:shadow-lg transition-shadow ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <h2 className="text-3xl font-bold mt-2 text-gray-800">{value}</h2>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`text-4xl ${iconColorClasses[color]} opacity-80`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCard;
