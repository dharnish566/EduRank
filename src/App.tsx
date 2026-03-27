import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { AboutSection } from "./components/home/AboutSection";
import { AnalyticsPreviewSection } from "./components/home/AnalyticsPreviewSection";
import { BenefitsSection } from "./components/home/BenefitsSection";
import { CTASection } from "./components/home/CTASection";
import { DataSourcesSection } from "./components/home/DataSourcesSection";
import { FeaturesSection } from "./components/home/FeaturesSection";
import { Footer } from "./components/home/Footer";
import { HeroSection } from "./components/home/HeroSection";
import { HowItWorksSection } from "./components/home/HowItWorksSection";
import { Navbar } from "./components/home/Navbar";
import { TopCollegesSection } from "./components/home/TopCollegesSection";

import { AnalyticsDashboardPage } from "./pages/AnalyticsDashboardPage"
import { CollegeDetailsPage } from "./pages/CollegeDetailsPage";
import { CollegeFinderPage } from "./pages/CollegeFinderPage";
import { ComparePage } from "./pages/ComparePage";
import { RankingsPage } from "./pages/RankingsPage";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="font-body antialiased">
      <Navbar
        onNavigateToRankings={() => navigate("/rankings")}
        onNavigateToCompare={() => navigate("/compare")}
        onNavigateToAnalytics={() => navigate("/analytics")}
        onNavigateToFinder={() => navigate("/finder")}
      />

      <main>
        <HeroSection onNavigateToRankings={() => navigate("/rankings")} />
        <AboutSection />
        <FeaturesSection />
        <DataSourcesSection />
        <HowItWorksSection />
        <TopCollegesSection onNavigateToRankings={() => navigate("/rankings")} />
        <AnalyticsPreviewSection onNavigateToAnalytics={() => navigate("/analytics")} />
        <BenefitsSection />
        <CTASection
          onNavigateToRankings={() => navigate("/rankings")}
          onNavigateToCompare={() => navigate("/compare")}
        />
      </main>

      <Footer
        onNavigateToCompare={() => navigate("/compare")}
        onNavigateToAnalytics={() => navigate("/analytics")}
        onNavigateToFinder={() => navigate("/finder")}
      />
    </div>
  );
}

function CollegeDetailsWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [compareIds, setCompareIds] = useState<number[]>([]);

  const handleAddToCompare = (cid: number) => {
    setCompareIds((prev) =>
      prev.includes(cid)
        ? prev.filter((v) => v !== cid)
        : prev.length < 4
        ? [...prev, cid]
        : prev
    );
  };

  return (
    <CollegeDetailsPage
      collegeId={Number(id)}
      onNavigateBack={() => navigate("/rankings")}
      onAddToCompare={handleAddToCompare}
      compareIds={compareIds}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const [compareIds, setCompareIds] = useState<number[]>([]);

  return (
    <Routes>

      <Route path="/" element={<HomePage />} />

      <Route
        path="/rankings"
        element={
          <RankingsPage
            onNavigateHome={() => navigate("/")}
            onNavigateToCompare={(ids) => {
              setCompareIds(ids);
              navigate("/compare");
            }}
            onNavigateToDetails={(id) => navigate(`/college/${id}`)}
            compareIds={compareIds}
            onCompareIdsChange={setCompareIds}
          />
        }
      />

      <Route
        path="/compare"
        element={
          <ComparePage
            initialIds={compareIds}
            onNavigateHome={() => navigate("/")}
            onNavigateToRankings={() => navigate("/rankings")}
          />
        }
      />

      <Route path="/college/:id" element={<CollegeDetailsWrapper />} />

      <Route
        path="/analytics"
        element={
          <AnalyticsDashboardPage
            onNavigateHome={() => navigate("/")}
            onNavigateToRankings={() => navigate("/rankings")}
            onNavigateToCompare={() => navigate("/compare")}
            onNavigateToDetails={(id) => navigate(`/college/${id}`)}
          />
        }
      />

      <Route
        path="/finder"
        element={
          <CollegeFinderPage
            onNavigateHome={() => navigate("/")}
            onNavigateToDetails={(id) => navigate(`/college/${id}`)}
            onNavigateToCompare={() => navigate("/compare")}
          />
        }
      />

    </Routes>
  );
}