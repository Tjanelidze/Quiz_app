import { Route, BrowserRouter as Router, Routes } from "react-router";
import { QuizList } from "./components/QuizList";
import { QuizEditor } from "./components/QuizEditor/QuizEditor";
import QuizView from "./components/QuizView/QuizView";
import { ROUTES } from "./constants/routes";
import RootLayout from "./components/RootLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path={ROUTES.HOME} element={<QuizList />} />
          <Route path={ROUTES.QUIZ_EDIT} element={<QuizEditor />} />
          <Route path={ROUTES.QUIZ_VIEW} element={<QuizView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
