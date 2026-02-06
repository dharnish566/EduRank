import CollegeDetails from './pages/CollegeDetails';
import CollegeList from './pages/CollegeList'
import LandingPage from './pages/LandingPage'
import Dump from './pages/dummpy'
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/college" element={<CollegeList />} />
          <Route path="/collegeName" element={<CollegeDetails />} />
          <Route path="/dump" element={<Dump/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
