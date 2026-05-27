import Layout from './components/Layout';
import Hero from './components/Hero';
import Employment from './sections/Employment';
import SectorAnalysis from './sections/SectorAnalysis';
import CountryAdoption from './sections/CountryAdoption';
import Environmental from './sections/Environmental';
import EconomicParadox from './sections/EconomicParadox';
import SkillsGap from './sections/SkillsGap';
import MLInsights from './sections/MLInsights';
import Methodology from './sections/Methodology';
import About from './sections/About';

export default function App() {
  return (
    <Layout>
      <Hero />
      <About />
      <Employment />
      <SectorAnalysis />
      <CountryAdoption />
      <Environmental />
      <EconomicParadox />
      <SkillsGap />
      <MLInsights />
      <Methodology />
    </Layout>
  );
}
