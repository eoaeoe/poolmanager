import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

export function AppSplash({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeout = globalThis.window.setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => globalThis.window.clearTimeout(timeout);
  }, []);

  if (showSplash) {
    return (
      <div className="app-splash">
        <img src={logo} alt="PoolManager" className="app-splash-logo" />
        <h1>PoolManager</h1>
      </div>
    );
  }

  return children;
}
