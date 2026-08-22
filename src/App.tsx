import React from "react";
import { FoodProvider, useFood } from "./context/FoodContext";
import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";
import { CompareFloatingBar } from "./components/common/CompareFloatingBar";
import { FoodDetailModal } from "./components/food/FoodDetailModal";
import { ScanCameraModal } from "./components/scan/ScanCameraModal";
import { BarcodeScannerModal } from "./components/scan/BarcodeScannerModal";
import { LabelScannerModal } from "./components/scan/LabelScannerModal";
import { MealAnalyzerView } from "./components/meal/MealAnalyzerView";
import { FoodCompareView } from "./components/compare/FoodCompareView";
import { AskFoodoraDrawer } from "./components/assistant/AskFoodoraDrawer";
import { PersonalDashboardView } from "./components/dashboard/PersonalDashboardView";
import { FoodMemoriesView } from "./components/dashboard/FoodMemoriesView";
import { WeeklyInsightsView } from "./components/dashboard/WeeklyInsightsView";
import { GlobalDatabaseView } from "./components/database/GlobalDatabaseView";
import { GlobalCuisinesView } from "./components/cuisines/GlobalCuisinesView";
import { CategoriesView } from "./components/categories/CategoriesView";
import { CommunityView } from "./components/community/CommunityView";
import { PartnersView } from "./components/partners/PartnersView";
import { CollaborationsView } from "./components/collaborations/CollaborationsView";
import { ImageUploadDropzone } from "./components/scan/ImageUploadDropzone";
import { AboutViews } from "./components/info/AboutViews";
import { HomeView } from "./components/home/HomeView";
import { RecipeGeneratorView } from "./components/recipes/RecipeGeneratorView";

const MainContent: React.FC = () => {
  const { currentView, activeFoodDetail, setActiveFoodDetail } = useFood();

  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return <HomeView />;
      case "recipes":
        return <RecipeGeneratorView />;
      case "database":
        return <GlobalDatabaseView />;
      case "categories":
        return <CategoriesView />;
      case "cuisines":
        return <GlobalCuisinesView />;
      case "dashboard":
        return <PersonalDashboardView />;
      case "meal-analyzer":
        return <MealAnalyzerView />;
      case "compare":
        return <FoodCompareView />;
      case "memories":
        return <FoodMemoriesView />;
      case "insights":
        return <WeeklyInsightsView />;
      case "community":
        return <CommunityView />;
      case "partners":
        return <PartnersView />;
      case "collaborations":
        return <CollaborationsView />;
      case "upload":
      case "upload-image":
        return <ImageUploadDropzone />;
      case "about":
        return <AboutViews />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Header */}
      <Header />

      {/* Main View Body */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Global Modals & Drawers */}
      <FoodDetailModal
        food={activeFoodDetail}
        onClose={() => setActiveFoodDetail(null)}
      />
      <ScanCameraModal />
      <BarcodeScannerModal />
      <LabelScannerModal />
      <AskFoodoraDrawer />
      <CompareFloatingBar />
    </div>
  );
};

export default function App() {
  return (
    <FoodProvider>
      <MainContent />
    </FoodProvider>
  );
}
