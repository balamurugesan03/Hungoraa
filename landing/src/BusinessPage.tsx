import Navbar from './components/Navbar'
import Business from './components/Business'
import AppDownload from './components/AppDownload'
import Footer from './components/Footer'

export default function BusinessPage() {
  return (
    <>
      <Navbar onHome={false} />
      <main>
        <Business />
        <AppDownload />
      </main>
      <Footer onHome={false} />
    </>
  )
}
