import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TaskList from './components/TaskList';

class App extends Component {
  constructor() {
    super();
    this.apiUrl = 'http://localhost:3001/api';
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <TaskList apiUrl={this.apiUrl} />

      </div>
    );
  }
}

export default App;
