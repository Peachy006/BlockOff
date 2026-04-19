import { Navigate } from "react-router-dom";
import { hasOnboarded } from "@/lib/device";
import Home from "./Home";

const Index = () => {
  if (!hasOnboarded()) return <Navigate to="/onboarding" replace />;
  return <Home />;
};

export default Index;
