import React, { Component } from 'react';

class Machines extends Component {

    constructor(props) {
        super(props);
        this.state = {
            info: [],
            answers: [],
        };

        fetch('/api/getInfo?box=testing&user="00:db:df:d2:4d:df"')
        .then(res => res.json())
        .then(info => this.setState({info}, () => {
            console.log('Stats fetched...', info);
            let str = this.state.info[0].ports.split("");
            console.log( str );

            fetch( `/api/getAnswer?box=Testing` )
            .then( res => res.json() )
            .then( answers => this.setState( {answers}, () => {
                console.log( answers );
                /*
                for( let i = 0; i < str.length; i++ ) {
                    if( str[i] === "0" ) {
                        answers['scan'+i] = "?";
                    }
                }
                */
            }));

            console.log( this.state.info );
            console.log( this.state.answers );
        }));
        
    }

    render() {
        return (
            <div>
                {this.state.info.map(info =>
                    <div className="mainBody">
                        <div>
                            <h1>Scanning</h1>
                            <p>{this.state.answers['scan1']}</p>
                            <p>{this.state.answers['scan2']}</p>
                            <p>{this.state.answers['scan3']}</p>
                        </div>
                        <div>
                            <h1>Enumeration</h1>
                            <p>{info.enum}</p>
                        </div>
                        <div>
                            <h1>Services</h1>
                            <p>{info.services}</p>
                        </div>
                        <div>
                            <h1>Accounts</h1>
                            <p>{info.accounts}</p>
                        </div>
                    </div>
                    
                )}
            </div>

        );
    }
}

export default Machines;