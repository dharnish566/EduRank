import CollegeList from './pages/CollegeList'
import LandingPage from './pages/LandingPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/college" element={<CollegeList />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
