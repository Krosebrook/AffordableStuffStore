import { Route, Routes } from "react-router-dom";

import { CookieConsentProvider } from "./contexts/cookie-consent-context";
import { CookieConsent } from "./components/cookie-consent";
import { PageNotFound } from "./pages/404";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import MarketplacePage from "@/pages/marketplace";
import PackDetailPage from "@/pages/pack-detail";
import PromptBuilderPage from "@/pages/prompt-builder";
import PackEditorPage from "@/pages/pack-editor";

function App() {
  return (
    <CookieConsentProvider>
      <CookieConsent />
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<DocsPage />} path="/docs" />
        <Route element={<PricingPage />} path="/pricing" />
        <Route element={<BlogPage />} path="/blog" />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<MarketplacePage />} path="/marketplace" />
        <Route element={<PackDetailPage />} path="/marketplace/:id" />
        <Route element={<PromptBuilderPage />} path="/prompt-builder" />
        <Route element={<PackEditorPage />} path="/pack-editor" />
        <Route element={<PageNotFound />} path="*" />
      </Routes>
    </CookieConsentProvider>
  );
}

export default App;
