import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import TopicPage from "../pages/TopicPage";
import NewTopicPage from "../pages/NewTopicPage";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import CategoryPage from "../pages/CategoryPage";
import ProfilePage from "../pages/ProfilePage";
import SearchPage from "../pages/SearchPage";
import ModerationReportsPage from '../pages/moderation/ModerationReportsPage';
import MentionsLegales from '../pages/legal/MentionsLegales';
import CGU from '../pages/legal/CGU';
import PolitiqueConfidentialite from '../pages/legal/PolitiqueConfidentialite';
import PolitiqueCookies from '../pages/legal/PolitiqueCookies';
import Contact from '../pages/legal/Contact';
import FAQ from '../pages/FAQ';
import Moderation from '../pages/Moderation';
import Signalement from '../pages/Signalement';

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <AppLayout />,
            children: [
                { index: true, element: <HomePage /> },
                { path: "login", element: <LoginPage /> },
                { path: "register", element: <RegisterPage /> },
                { path: "topic/:id", element: <TopicPage /> },
                { path: "category/:id", element: <CategoryPage /> },
                { path: "profile/:id", element: <ProfilePage /> },
                { path: "search", element: <SearchPage /> },
                { path: "mentions-legales", element: <MentionsLegales /> },
                { path: "cgu", element: <CGU /> },
                { path: "confidentialite", element: <PolitiqueConfidentialite /> },
                { path: "cookies", element: <PolitiqueCookies /> },
                { path: "contact", element: <Contact /> },
                { path: "faq", element: <FAQ /> },
                { path: "moderation", element: <Moderation /> },
                { path: "signalement", element: <Signalement /> },
                { 
                    path: "moderation/reports",
                    element: (
                        <ProtectedRoute>
                            <ModerationReportsPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "new-topic",
                    element: (
                        <ProtectedRoute>
                            <NewTopicPage />
                        </ProtectedRoute>
                    ),
                },
            ],
        },
    ],
    {
        basename: '/app'
    }
);