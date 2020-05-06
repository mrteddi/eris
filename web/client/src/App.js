import React, { Component } from 'react';
import './App.css';
import Logo from './eris.png';
import MachineList from './components/machinelist.js';
import Machine from './components/machine.js';
import Create from './components/create.js';

class App extends Component {

    constructor() {
        super()
        this.state = {
            mainScreen: true,
            clicked: "default",
        }
    }

    changeComp = (e) => {
        this.setState({
            mainScreen: false,
            clicked: e.target.innerText,
        });
    }

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
                            {/* <li className="navItem"><a href="/#">Login</a></li> */}
                            <li className="navItem"><a href="/">Home</a></li>
                        </ul>
                    </div>
                </header>

                { this.state.mainScreen ?
                    <MachineList clicked={this.state.clicked} changeComp={this.changeComp}/>
                    :
                    this.state.clicked === "Create Machine" ?
                    <Create/>
                    :
                    <Machine box={this.state.clicked}/>
                }
                {/* <Create/> */}
            </div>
        );
    }

}

export default App;
