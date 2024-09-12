import { useState } from 'react';

const SwitcherThree = () => {
  const [enabled, setEnabled] = useState(false);

  const handleToggle = () => {
    setEnabled(!enabled);
    // Vous pouvez ajouter des actions ici si nécessaire lorsque l'état du bouton change
  };

  return (
    <div>
      <label
        htmlFor="toggleSwitch"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="toggleSwitch"
            className="sr-only"
            checked={enabled}
            onChange={handleToggle}
          />
          <div className="block h-8 w-14 rounded-full bg-black"></div>
          <div
            className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
              enabled && '!right-1 !translate-x-full'
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default SwitcherThree;
