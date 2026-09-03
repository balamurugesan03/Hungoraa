import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ExploreSouthIndia from './components/ExploreSouthIndia'
import BookYourTable from './components/BookYourTable'
import ExperienceCards from './components/ExperienceCards'
import MenuExperience from './components/MenuExperience'
import Gallery from './components/Gallery'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="mx-auto max-w-[1320px] px-8">
          <span className="hairline block" />
        </div>
        <ExploreSouthIndia />
        <BookYourTable />
        <ExperienceCards />
        <MenuExperience />
        <Gallery />
      </main>
      <Footer />
    </>
  )
}
