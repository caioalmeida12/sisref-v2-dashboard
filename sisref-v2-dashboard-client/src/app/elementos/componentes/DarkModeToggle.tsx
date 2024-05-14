import React, { useState, useEffect } from 'react';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [userSelectedDarkMode, setUserSelectedDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemPrefersDark = mediaQuery.matches;

    // Se o usuário ainda não fez uma escolha, use a preferência do sistema
    if (userSelectedDarkMode === null) {
      setDarkMode(systemPrefersDark);
    } else {
      setDarkMode(userSelectedDarkMode);
    }

    // Adiciona ou remove a classe 'dark' dependendo da preferência do usuário ou do sistema
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [userSelectedDarkMode, darkMode]);

  const toggleDarkMode = () => {
    const toggledDarkMode = !darkMode;
    setDarkMode(toggledDarkMode);
    setUserSelectedDarkMode(toggledDarkMode);
  };

  return (
    <button onClick={toggleDarkMode} className="p-2 bg-blue-500 text-white dark:text-cinza-400">
      Mudar Dark Mode
    </button>
  );
};

export default DarkModeToggle;