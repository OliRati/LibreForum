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