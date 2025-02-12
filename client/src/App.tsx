import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Generator from './pages/generator/Generator';

function App(): JSX.Element {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Generator />} />
      </Routes>
    </Router>
  )
}

export default App
