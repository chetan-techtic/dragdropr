import * as React from 'react';
import './App.scss';

import logo from './logo.svg';
import Preview from './components/preview/preview';

class App extends React.Component {

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <div className="container preview">
          <Preview />
        </div>
      </div>
    );
  }
}

export default App;
