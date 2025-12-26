import { Route, Routes } from "react-router-dom";

import { CookieConsentProvider } from "./contexts/cookie-consent-context";
import { CookieConsent } from "./components/cookie-consent";
import { PageNotFound } from "./pages/404";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import FlashFusionPage from "@/pages/flashfusion";

function App() {
  return (
    <CookieConsentProvider>
      <CookieConsent />
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<PromptBuilderPage />} path="/prompt-builder" />
        <Route element={<ContentStudioPage />} path="/content-studio" />
        <Route element={<CampaignsPage />} path="/campaigns" />
        <Route element={<MarketplacePage />} path="/marketplace" />
        <Route element={<PromptsPage />} path="/prompts" />
        <Route element={<DocsPage />} path="/docs" />
        <Route element={<PricingPage />} path="/pricing" />
        <Route element={<BlogPage />} path="/blog" />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<FlashFusionPage />} path="/flashfusion" />
        <Route element={<PageNotFound />} path="*" />
      </Routes>
    </CookieConsentProvider>
  );
}

export default App;
