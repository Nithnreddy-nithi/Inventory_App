import axios from "./axios";

export const getDashboardSummary = () => axios.get("/dashboard/summary");
