import { Navigate } from "react-router-dom";
import { hasOnboarded } from "@/lib/device";
import isAuthed from "./Auth";
import Home from "./Home";

const Index = () => {
  if (!hasOnboarded()) return <Navigate to="/onboarding" replace />;
  if (!isAuthed()) return <Navigate to="/auth" replace />;
  return <Home />;
};

export default Index;
