import React from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './samples/Main';

function App(): React.ReactElement {
  return (
    <>
      <div style={{ height: "100vh" }}>
        <div style={{ height: "20vmin" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", height: "20vmin", backgroundColor: "#282c34" }}>
            <div style={{ transform: "scale(0.20)" }}>
              <Logo />
            </div>
          </div>
        </div>

        <div style={{ height: "80vmin", overflow: "hidden" }}>
          <Main />
        </div>
      </div>
    </>
  );
}

function Logo(): React.ReactElement {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
