import Navbar from "../components/header/Navbar"
import HeaderStrip from '../components/header/HeaderStrip'
import HighlightBanner from '../components/header/HighlightBanner'
import ResultBoard from '../components/header/ResultBoard'
import ResultsTable from "../components/main/ResultsTable"
import Footer from '../components/main/Footer'
import WhatsAppButton from '../components/main/WhatsAppButton'

import GameChartTable from "../components/main/GameChartTable"

export default function Home() {
    return (
        <>
            <Navbar />
            <HeaderStrip />
            <HighlightBanner />
            <ResultBoard />
            <ResultsTable />
            <GameChartTable />
            <Footer />
            <WhatsAppButton />

        </>
    )
}
