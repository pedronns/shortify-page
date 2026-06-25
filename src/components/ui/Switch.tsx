'use client';

type Props = {
  checked: boolean,
  onChange: (checked: boolean) => void
}

export default function Switch({ checked, onChange }: Props) {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />

      <div
        className={`w-12 h-6 rounded-full p-1 transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full transition-transform ${
            checked ? 'translate-x-6' : ''
          }`}
        />
      </div>
    </label>
  );
}