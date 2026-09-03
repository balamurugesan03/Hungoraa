import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import MenuGallery from './components/MenuGallery'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import SplitBill from './components/SplitBill'
import About from './components/About'
import RestaurantShowcase from './components/RestaurantShowcase'
import Testimonials from './components/Testimonials'
import AppDownload from './components/AppDownload'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <MenuGallery />
        <HowItWorks />
        <Features />
        <SplitBill />
        <About />
        <RestaurantShowcase />
        <Testimonials />
        <AppDownload />
      </main>
      <Footer />
    </>
  )
}
