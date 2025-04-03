
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import HomePage from "@/pages/HomePage";
import NewGamePage from "@/pages/NewGamePage";
import GamePage from "@/pages/GamePage";
import NotFound from "@/pages/NotFound";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new" element={<NewGamePage />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="py-4 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          Belote Score Analyzer &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
