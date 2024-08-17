import ProtectedRoute from "../components/protectedroute.js";
import FlashCards from "../components/flashcards";
import Navbar from "../components/Navbar.js";
import PriceBox from "../components/pricebox.js";

export default function Flashcardpage() {
  return (
    <ProtectedRoute>
      <Navbar/>
      <FlashCards/>
      <PriceBox/>
    </ProtectedRoute>
  )
}