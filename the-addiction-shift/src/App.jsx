import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './sections/About';
import Mortality from './sections/Mortality';
import Substances from './sections/Substances';
import Behavioral from './sections/Behavioral';
import Demographics from './sections/Demographics';
import EconomicCost from './sections/EconomicCost';
import Treatment from './sections/Treatment';
import Global from './sections/Global';
import Methodology from './sections/Methodology';

export default function App() {
  return (
    <Layout>
      <Hero />
      <About />
      <Mortality />
      <Substances />
      <Behavioral />
      <Demographics />
      <EconomicCost />
      <Treatment />
      <Global />
      <Methodology />
    </Layout>
  );
}
