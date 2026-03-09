import { useState } from "react";
import { AboutSection } from "./components/AboutSection";
import { AnalyticsPreviewSection } from "./components/AnalyticsPreviewSection";
import { BenefitsSection } from "./components/BenefitsSection";
import { CTASection } from "./components/CTASection";
import { DataSourcesSection } from "./components/DataSourcesSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { Navbar } from "./components/Navbar";
import { TopCollegesSection } from "./components/TopCollegesSection";
import { AnalyticsDashboardPage } from "./pages/AnalyticsDashboardPage";
import { CollegeDetailsPage } from "./pages/CollegeDetailsPage";
import { CollegeFinderPage } from "./pages/CollegeFinderPage";
import { ComparePage } from "./pages/ComparePage";
import { RankingsPage } from "./pages/RankingsPage";

type Page =
  | "home"
  | "rankings"
  | "compare"
  | "details"
  | "analytics"
  | "finder";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(
    null,
  );

  const navigateToRankings = () => {
    setCurrentPage("rankings");
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    setCurrentPage("home");
    window.scrollTo(0, 0);
  };

  const navigateToCompare = (ids: number[] = []) => {
    setCompareIds(ids);
    setCurrentPage("compare");
    window.scrollTo(0, 0);
  };

  const navigateToDetails = (id: number) => {
    setSelectedCollegeId(id);
    setCurrentPage("details");
    window.scrollTo(0, 0);
  };

  const navigateToAnalytics = () => {
    setCurrentPage("analytics");
    window.scrollTo(0, 0);
  };

  const navigateToFinder = () => {
    setCurrentPage("finder");
    window.scrollTo(0, 0);
  };

  const handleAddToCompare = (id: number) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((cid) => cid !== id)
        : prev.length < 4
          ? [...prev, id]
          : prev,
    );
  };

  if (currentPage === "rankings") {
    return (
      <RankingsPage
        onNavigateHome={navigateToHome}
        onNavigateToCompare={navigateToCompare}
        onNavigateToDetails={navigateToDetails}
        compareIds={compareIds}
        onCompareIdsChange={setCompareIds}
      />
    );
  }

  if (currentPage === "compare") {
    return (
      <ComparePage
        initialIds={compareIds}
        onNavigateHome={navigateToHome}
        onNavigateToRankings={navigateToRankings}
      />
    );
  }

  if (currentPage === "details" && selectedCollegeId !== null) {
    return (
      <CollegeDetailsPage
        collegeId={selectedCollegeId}
        onNavigateBack={navigateToRankings}
        onAddToCompare={handleAddToCompare}
        compareIds={compareIds}
      />
    );
  }

  if (currentPage === "analytics") {
    return (
      <AnalyticsDashboardPage
        onNavigateHome={navigateToHome}
        onNavigateToRankings={navigateToRankings}
        onNavigateToCompare={() => navigateToCompare([])}
        onNavigateToDetails={navigateToDetails}
      />
    );
  }

  if (currentPage === "finder") {
    return (
      <CollegeFinderPage
        onNavigateHome={navigateToHome}
        onNavigateToDetails={navigateToDetails}
        onNavigateToCompare={navigateToCompare}
      />
    );
  }

  return (
    <div className="font-body antialiased">
      <Navbar
        onNavigateToRankings={navigateToRankings}
        onNavigateToCompare={() => navigateToCompare([])}
        onNavigateToAnalytics={navigateToAnalytics}
        onNavigateToFinder={navigateToFinder}
      />
      <main>
        <HeroSection onNavigateToRankings={navigateToRankings} />
        <AboutSection />
        <FeaturesSection />
        <DataSourcesSection />
        <HowItWorksSection />
        <TopCollegesSection onNavigateToRankings={navigateToRankings} />
        <AnalyticsPreviewSection onNavigateToAnalytics={navigateToAnalytics} />
        <BenefitsSection />
        <CTASection
          onNavigateToRankings={navigateToRankings}
          onNavigateToCompare={() => navigateToCompare([])}
        />
      </main>
      <Footer
        onNavigateToCompare={() => navigateToCompare([])}
        onNavigateToAnalytics={navigateToAnalytics}
        onNavigateToFinder={navigateToFinder}
      />
    </div>
  );
}



// import CollegeDetails from './pages/CollegeDetails';
// import CollegeList from './pages/CollegeList'
// import LandingPage from './pages/LandingPage'
// import { BrowserRouter, Routes, Route } from 'react-router-dom';


// function App() {
//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/college" element={<CollegeList />} />
//           <Route path="/collegeName" element={<CollegeDetails />} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   )
// }

// export default App
