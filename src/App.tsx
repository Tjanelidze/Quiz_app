import { Route, BrowserRouter as Router, Routes } from "react-router";
import { QuizList } from "./components/QuizList";
import { QuizEditor } from "./components/QuizEditor/QuizEditor";
import QuizView from "./components/QuizView/QuizView";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/quiz/edit/:id" element={<QuizEditor />} />
          <Route path="/quiz/view/:id" element={<QuizView />} />
        </Routes>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10B981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
