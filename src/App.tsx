import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "@/components/layout/Layout";

const HomePage = lazy(() => import("@/pages/HomePage"));
const ProductsPage = lazy(() => import("@/pages/ProductsPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const StoryPage = lazy(() => import("@/pages/StoryPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-[70svh] bg-cream" aria-busy="true" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="produkte" element={<ProductsPage />} />
          <Route path="dienstleistungen" element={<ServicesPage />} />
          <Route path="ueber-uns" element={<AboutPage />} />
          <Route path="daehler-story" element={<StoryPage />} />
          <Route path="kontakt" element={<ContactPage />} />
          <Route path="datenschutz" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
