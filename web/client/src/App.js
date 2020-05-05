import React, { Component } from 'react';
import './App.css';
import Logo from './eris.png';
import Machine from './components/machines.js';
import Create from './components/create.js';

class App extends Component {

  render() {
    return (
        <div className="App">
            <header className="App-header">
                <div className="navbar-left">
                    <img className="App-logo" src={Logo} alt="Logo"></img>
                    <h1 className="App-title">Eris</h1>
                </div>
                <div className="navbar-right">
                    <ul className="navRightLinks">
                        <li className="navItem"><a href="/#">Login</a></li>
                        <li className="navItem"><a href="/#">Machines</a></li>
                    </ul>
                </div>
            </header>

            {/* <Machine/> */}
            <Create/>
        </div>
    );
  }

}

export default App;
