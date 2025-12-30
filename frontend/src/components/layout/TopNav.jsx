export default function TopNav() {
  return (
    <div className="h-[72px] bg-white border-b flex items-center justify-between px-8">
      <div className="font-bold text-lg text-blue-700">
        FloodSupport<span className="text-gray-400">.ORG</span>
      </div>

      <div className="flex gap-6 text-sm text-gray-600">
        <span className="font-medium text-blue-600">Home</span>
        <span>SOS</span>
        <span>Nearby Search</span>
        <span>Map</span>
        <span>Road Maps</span>
        <span>Volunteers</span>
        <span>Aid Portal</span>
      </div>

      <div className="flex gap-3">
        <button className="bg-green-600 text-white px-4 py-2 rounded-full text-sm">
          Am I Safe?
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded-full text-sm">
          Emergency
        </button>
      </div>
    </div>
  );
}
