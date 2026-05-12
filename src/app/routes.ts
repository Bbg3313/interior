import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { LandingPage } from "./pages/LandingPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { PortfolioDetailPage } from "./pages/PortfolioDetailPage";
import { EstimatePage } from "./pages/EstimatePage";
import { AdminPage } from "./pages/AdminPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "portfolio", Component: PortfolioPage },
      { path: "portfolio/:id", Component: PortfolioDetailPage },
      { path: "estimate", Component: EstimatePage },
      { path: "privacy", Component: PrivacyPolicyPage },
      { path: "terms", Component: TermsOfServicePage },
      { path: "admin", Component: AdminPage },
    ],
  },
]);
