import React, { Component } from 'react';

import Canvas from './containers/Canvas';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Drawing Ellipses</h1>
        </header>
        <main>
          <Canvas />
        </main>
      </div>
    );
  }
}

export default App;
