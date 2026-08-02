import { create } from 'zustand';

export const useAppStore = create((set) => ({
  location: null,
  selectedCity: null,
  searchQuery: '',
  recentSearches: [],
  cartItems: [],
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
