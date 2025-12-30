export default function AlertBanner() {
  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl px-6 py-4 flex justify-between items-center shadow">
      <div>
        <div className="font-semibold">⚠️ Landslide Warning Active</div>
        <div className="text-sm opacity-90">High: 7 · Moderate: 35 · Watch</div>
      </div>

      <button className="bg-white/20 px-4 py-2 rounded-lg text-sm">
        Details
      </button>
    </div>
  );
}
