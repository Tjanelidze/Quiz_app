import { Route, BrowserRouter as Router, Routes } from "react-router";
import { QuizList } from "./components/QuizList";
import { QuizEditor } from "./components/QuizEditor";
import { QuizRenderer } from "./components/QuizRenderer";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/quiz/edit/:id" element={<QuizEditor />} />
          <Route path="/quiz/view/:id" element={<QuizRenderer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
