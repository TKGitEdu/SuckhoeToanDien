import FeaturesSection from "../components/feature";
import Footer from "../components/footer";
import Header from "../components/header";
import HeroSection from "../components/HeroSection";



const HomePage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
    <Header />
    <HeroSection/>
    <FeaturesSection/>
    <Footer/>
  </div>
);

export default HomePage;