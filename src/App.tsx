import { Route, BrowserRouter as Router, Routes } from "react-router";
import { QuizList } from "./components/QuizList";
import { QuizEditor } from "./components/QuizEditor/QuizEditor";
import QuizView from "./components/QuizView/QuizView";
import { Toaster } from "react-hot-toast";
import { ROUTES } from "./constants/routes";

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ background: "var(--color-background)", color: "var(--color-text-primary)" }}>
        <Routes>
          <Route path={ROUTES.HOME} element={<QuizList />} />
          <Route path={ROUTES.QUIZ_EDIT} element={<QuizEditor />} />
          <Route path={ROUTES.QUIZ_VIEW} element={<QuizView />} />
        </Routes>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "var(--color-success-500)",
                secondary: "var(--color-text-primary)",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "var(--color-danger-500)",
                secondary: "var(--color-text-primary)",
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
