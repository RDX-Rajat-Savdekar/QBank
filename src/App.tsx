import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ArticlePage } from "./pages/ArticlePage";
import { Articles } from "./pages/Articles";
import { Companies } from "./pages/Companies";
import { CompanyPage } from "./pages/CompanyPage";
import { Contribute } from "./pages/Contribute";
import { Home } from "./pages/Home";
import { Lab } from "./pages/Lab";
import { QuestionPage } from "./pages/QuestionPage";
import { TypePage } from "./pages/TypePage";
import { Types } from "./pages/Types";

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Lab />} />
          <Route path="lab" element={<Lab />} />
          <Route path="questions" element={<Home />} />
          <Route path="q/:id" element={<QuestionPage />} />
          <Route path="companies" element={<Companies />} />
          <Route path="company/:slug" element={<CompanyPage />} />
          <Route path="types" element={<Types />} />
          <Route path="type/:id" element={<TypePage />} />
          <Route path="articles" element={<Articles />} />
          <Route path="article/:id" element={<ArticlePage />} />
          <Route path="contribute" element={<Contribute />} />
          <Route path="paths" element={<Navigate to="/articles" replace />} />
          <Route path="path/:id" element={<Navigate to="/articles" replace />} />
          <Route path="practice" element={<Navigate to="/" replace />} />
          <Route path="drill" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
