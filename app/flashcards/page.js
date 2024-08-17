import ProtectedRoute from "../components/protectedroute.js";
import FlashCards from "../components/flashcards";
import Navbar from '../components/Navbar';

export default function FlashChild() {
  return (
    <ProtectedRoute>
    <>
    <Navbar />  
    <FlashCards />
    </>
    </ ProtectedRoute>
  )
}