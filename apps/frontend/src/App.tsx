import { AppRouter } from "./router/AppRouter";
import { AppSplash } from "./features/splash/AppSplash";

export default function App() {
  return (
    <AppSplash>
      <AppRouter />
    </AppSplash>
  );
}
