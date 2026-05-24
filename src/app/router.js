import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from "react-router";
import { RootLayout } from "./root-layout";
import { ErrorBoundary } from "./error-boundary";
import { LoadingSpinner } from "../components/LoadingSpinner";
const LandingPage = () => import("../features/auth/LandingPage").then((m) => ({ Component: m.LandingPage }));
const SignInPage = () => import("../features/auth/SignInPage").then((m) => ({ Component: m.SignInPage }));
const SignUpPage = () => import("../features/auth/SignUpPage").then((m) => ({ Component: m.SignUpPage }));
const AssignmentListPage = () => import("../features/assignments/AssignmentListPage").then((m) => ({
    Component: m.AssignmentListPage,
    loader: m.assignmentListLoader,
}));
const AssignmentDetailPage = () => import("../features/assignments/AssignmentDetailPage").then((m) => ({
    Component: m.AssignmentDetailPage,
}));
const CreateAssignmentPage = () => import("../features/admin/CreateAssignmentPage").then((m) => ({
    Component: m.CreateAssignmentPage,
    loader: m.createAssignmentLoader,
}));
export const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(RootLayout, {}),
        errorElement: _jsx(ErrorBoundary, {}),
        hydrateFallbackElement: _jsx(LoadingSpinner, { className: "min-h-screen" }),
        children: [
            { index: true, lazy: LandingPage },
            { path: "signin", lazy: SignInPage },
            { path: "signup", lazy: SignUpPage },
            { path: "assignments", lazy: AssignmentListPage },
            { path: "assignments/:id", lazy: AssignmentDetailPage },
            { path: "admin/assignments/new", lazy: CreateAssignmentPage },
        ],
    },
]);
