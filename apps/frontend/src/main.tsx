import ReactDOM from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import App from "./App";
import { AuthProvider } from "./features/auth/AuthProvider";

import "./App.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <PrimeReactProvider value={{ ripple: true }}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </PrimeReactProvider>,
);
