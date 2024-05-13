import React, { useState, useEffect } from 'react';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [userSelectedDarkMode, setUserSelectedDarkMode] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemPrefersDark = mediaQuery.matches;

    // Se o usuário ainda não fez uma escolha, use a preferência do sistema
    if (userSelectedDarkMode === null) {
      setDarkMode(systemPrefersDark);
    }
  }, [userSelectedDarkMode]);

  const toggleDarkMode = () => {
    const root = window.document.documentElement;
    const toggledDarkMode = !darkMode;
    setDarkMode(toggledDarkMode);
    setUserSelectedDarkMode(toggledDarkMode);

    if (toggledDarkMode) {
      root.classList.add('dark');
      console.log('dark mode enabled');
    } else {
      root.classList.remove('dark');
      console.log('dark mode disabled');
    }
  };

  return (
    <button onClick={toggleDarkMode} className="p-2 bg-blue-500 text-white">
      Toggle Dark Mode
    </button>
  );
};

export default DarkModeToggle;