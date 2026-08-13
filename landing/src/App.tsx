import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MenuGallery from './components/MenuGallery'
import About from './components/About'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import RestaurantShowcase from './components/RestaurantShowcase'
import AppDownload from './components/AppDownload'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MenuGallery />
        <About />
        <HowItWorks />
        <Features />
        <RestaurantShowcase />
        <Testimonials />
        <AppDownload />
      </main>
      <Footer />
    </>
  )
}
