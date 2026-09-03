import { create } from 'zustand';

export const useAppStore = create((set) => ({
  location: null,
  selectedCity: null,
  searchQuery: '',
  recentSearches: [],
  cartItems: [],

  // Dining intent chosen from the post-login popup ('book' | 'dinein' | null).
  // `modeChooserShown` is NOT persisted, so the popup shows once per app launch.
  diningMode: null,
  modeChooserShown: false,
  setDiningMode: (diningMode) => set({ diningMode, modeChooserShown: true }),
  markModeChooserShown: () => set({ modeChooserShown: true }),
  selectedFilters: {
    cuisine: [],
    priceRange: [],
    rating: null,
    distance: null,
    sortBy: 'relevance',
  },

  setLocation: (location) => set({ location }),
  setCity: (city) => set({ selectedCity: city }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  addRecentSearch: (term) =>
    set((state) => ({
      recentSearches: [term, ...state.recentSearches.filter((s) => s !== term)].slice(0, 10),
    })),

  clearRecentSearches: () => set({ recentSearches: [] }),

  setFilters: (filters) =>
    set((state) => ({ selectedFilters: { ...state.selectedFilters, ...filters } })),

  resetFilters: () =>
    set({
      selectedFilters: {
        cuisine: [],
        priceRange: [],
        rating: null,
        distance: null,
        sortBy: 'relevance',
      },
    }),
}));
