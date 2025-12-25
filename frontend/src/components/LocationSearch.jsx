export default function LocationSearch({ placeholder, value, onChange }) {
  return (
    <input
      className="border p-2 w-full rounded"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
