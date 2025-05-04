import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      
      toggleTheme: () => set((state) => ({ 
        isDarkMode: !state.isDarkMode 
      })),
      
      setDarkMode: (isDark: boolean) => set({ 
        isDarkMode: isDark 
      }),
    }),
    {
      name: 'quran-theme',
    }
  )
);

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const isDarkMode = e.matches;
    // Only update if user hasn't explicitly set a preference
    if (!localStorage.getItem('quran-theme')) {
      useThemeStore.getState().setDarkMode(isDarkMode);
    }
  });
}