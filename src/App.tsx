import { Suspense, useState, useEffect } from "react";
import { Routes, Route, useRoutes, RouteObject } from "react-router-dom";
import Home from "./components/home";

// Type for tempo routes
interface TempoRoutesComponentProps {
  routes: RouteObject[];
}

function App() {
  // Tempo routes are only loaded in development when explicitly enabled
  const TempoRoutes = () => {
    if (!import.meta.env.DEV || import.meta.env.VITE_TEMPO !== "true") {
      return null;
    }

    const [routes, setRoutes] = useState<RouteObject[] | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      // Only attempt to import if we're in the right environment
      if (import.meta.env.DEV && import.meta.env.VITE_TEMPO === "true") {
        try {
          // Using a dynamic import with a template literal to prevent static analysis
          const modulePath = 'tempo-routes';
          import(/* @vite-ignore */ modulePath)
            .then(module => {
              if (module?.default) {
                setRoutes(module.default);
              }
            })
            .catch(err => {
              console.warn("Tempo routes not available. Running without tempo devtools.");
              setError(err);
            });
        } catch (err) {
          console.warn("Error setting up tempo routes:", err);
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    }, []);

    if (error || !routes) {
      return null;
    }

    return <TempoRoutesRenderer routes={routes} />;
  };

  // Separate component to use useRoutes hook
  const TempoRoutesRenderer = ({ routes }: TempoRoutesComponentProps) => {
    const element = useRoutes(routes);
    return element;
  };

  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="animate-pulse text-cyan-400">Loading...</div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes here as needed */}
      </Routes>
      
      {/* Include TempoRoutes component */}
      <TempoRoutes />
    </Suspense>
  );
}

export default App;
