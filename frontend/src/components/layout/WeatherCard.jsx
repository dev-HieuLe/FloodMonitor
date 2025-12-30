export default function WeatherCard() {
  return (
    <div className="bg-white rounded-xl p-5 shadow">
      <div className="text-sm text-gray-500 mb-2">Weather · Colombo</div>
      <div className="flex items-center gap-4">
        <div className="text-3xl font-bold">29°</div>
        <div className="text-sm text-gray-500">Clear</div>
      </div>
    </div>
  );
}
