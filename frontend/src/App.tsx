import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdoptionReview from './components/AdoptionReview';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<AdoptionReview />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;