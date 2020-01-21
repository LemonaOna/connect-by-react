import React from 'react';
import './App.css';
import {Main} from "./Main";
import logo from './logo.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <h1>Welcome to Connect4!</h1>
      </header>
      <Main/>
      <footer>
          <small>created with</small>
          <img src={logo} className="App-logo" alt="logo" />
          <small>by Leona Kuse</small>
      </footer>
    </div>
  );
}

export default App;
