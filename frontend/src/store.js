import { create } from 'zustand';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const useStore = create((set, get) => ({
  developers: [],
  selectedDevId: null,
  metrics: null,
  charts: null,
  insights: null,
  loading: false,
  insightsLoading: false,
  error: null,

  fetchDevelopers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/developers`);
      if (!res.ok) throw new Error("Failed to load developers");
      const data = await res.json();
      set({ developers: data, loading: false });
    } catch (err) {
      console.error(err);
      set({ error: "Failed to connect to the backend service. Make sure it is running on port 5000.", loading: false });
    }
  },

  selectDeveloper: async (id) => {
    set({ selectedDevId: id, metrics: null, charts: null, insights: null, error: null });
    if (!id) return;
    
    // Fetch metrics and charts
    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/metrics/${id}`);
      if (!res.ok) throw new Error("Failed to fetch metrics");
      const data = await res.json();
      
      set({ 
        metrics: data.metrics, 
        charts: data.charts, 
        loading: false 
      });

      // After metrics load successfully, trigger AI insights generation in parallel
      get().fetchInsights(id);
    } catch (err) {
      console.error(err);
      set({ error: "Failed to fetch metrics for developer.", loading: false });
    }
  },

  fetchInsights: async (id) => {
    set({ insightsLoading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/insights/${id}`);
      if (!res.ok) throw new Error("Failed to fetch AI insights");
      const data = await res.json();
      set({ insights: data, insightsLoading: false });
    } catch (err) {
      console.error(err);
      // Fallback inside service should handle errors, but just in case:
      set({ 
        insights: {
          riskLevel: "UNKNOWN",
          bottleneck: "Unable to retrieve insights from the AI engine at this time.",
          nextSteps: [
            "Verify backend connection to Google AI Studio.",
            "Manually check the cycle time and bug rate values above.",
            "Promote peer code review check-ins to unblock changes."
          ]
        },
        insightsLoading: false 
      });
    }
  }
}));
