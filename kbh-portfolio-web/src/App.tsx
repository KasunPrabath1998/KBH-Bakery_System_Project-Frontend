import { Routes, Route } from "react-router-dom"; 
import { Header } from "./components/PortfolioWebComponents/Header";
import { HeroSection } from "./components/PortfolioWebComponents/HeroSection";
import { Categories } from "./components/PortfolioWebComponents/Categories";
import { OfferBanner } from "./components/PortfolioWebComponents/OfferBanner";
import { Products } from "./components/PortfolioWebComponents/Products";
import { AboutUs } from "./components/PortfolioWebComponents/AboutUs";
import { FeaturedTreats } from "./components/PortfolioWebComponents/FeaturedTreats";
import { Footer } from "./components/PortfolioWebComponents/Footer";
import LoginPage from "./pages/LoginPage";
import Home from "./components/inventory-components/components/Navigation";
import EditProducts from './components/inventory-components/pages/EditProducts'; 
import TransactionScreen from './components/inventory-components/pages/TansactionScreen'; 
import OrderState from './components/inventory-components/pages/UpdateOrderStatePage'; 
import ProductsPage from "./components/inventory-components/pages/ProductsPage";

export const App = () => {
  return (
    <div className="font-sans">
      <Routes>
        <Route path="/" element={
          <div>
            <Header />
            <HeroSection />
            <Categories />
            <OfferBanner />
            <Products />
            <AboutUs />
            <FeaturedTreats />
            <Footer />
          </div>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/edit-product/:id" element={<EditProducts />} />
        <Route path="/transactions" element={<TransactionScreen />} />
        <Route path="/edit-image/:id" element={<OrderState />} />
      </Routes>
    </div>
  );
};
