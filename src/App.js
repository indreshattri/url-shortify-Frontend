import React from 'react';
import './App.css';
import URLShortener from './components/urlShortener'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <URLShortener />
        </div>
      </header>
    </div>
  );
}

export default App;
