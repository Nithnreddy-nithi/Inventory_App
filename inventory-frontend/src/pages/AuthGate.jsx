import { useAuth } from "../context/AuthContext";

export default function AuthGate({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return children;
}
