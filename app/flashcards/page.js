import ProtectedRoute from "../components/protectedroute.js";
import FlashCards from "../components/flashcards";
import Navbar from "../components/Navbar.js";

export default function Flashcardpage() {
  return (
    <ProtectedRoute>
      <>
      <Navbar />
      <FlashCards/>
      </>
    </ProtectedRoute>
  )
}