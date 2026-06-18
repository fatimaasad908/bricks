export default function Placeholder({ title }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-300">{title} Module</h2>
        <p className="text-gray-500 text-sm">This module is under development.</p>
      </div>
    </div>
  );
}
