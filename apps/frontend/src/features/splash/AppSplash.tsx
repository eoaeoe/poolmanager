import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

export function AppSplash({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const startExit = globalThis.window.setTimeout(() => {
      setLeaving(true);
    }, 1300);

    const removeSplash = globalThis.window.setTimeout(() => {
      setVisible(false);
    }, 1800);

    return () => {
      globalThis.window.clearTimeout(startExit);
      globalThis.window.clearTimeout(removeSplash);
    };
  }, []);

  return (
    <>
      {children}

      {visible && (
        <div className={`app-splash ${leaving ? "app-splash--leaving" : ""}`}>
          <img src={logo} alt="PoolManager" className="app-splash-logo" />
          <h1>PoolManager</h1>
        </div>
      )}
    </>
  );
}
