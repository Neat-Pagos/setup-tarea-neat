import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdoptionReview from './components/AdoptionReview';
import { MainLayout } from './components/MainLayout';
import { PokemonList } from './components/PokemonList';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<AdoptionReview />} />
            <Route path="/pokemons" element={<PokemonList />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;