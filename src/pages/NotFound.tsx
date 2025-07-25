
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary inline-block text-transparent bg-clip-text">404</h1>
        <p className="text-xl font-medium mb-6">Cette page n'existe pas</p>
        <Button asChild>
          <a href="/">Retour à l'accueil</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
