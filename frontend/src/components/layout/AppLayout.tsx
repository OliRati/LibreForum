import { Outlet, Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import SessionExpiredModal from "../SessionExpiredModal";
import MenuBar from "./MenuBar";

export default function AppLayout() {

  return (
    <div className="min-h-screen flex flex-col bg-zinc-400 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-200">
      <MenuBar />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <Footer />
      
      <SessionExpiredModal />
    </div>
  );
}