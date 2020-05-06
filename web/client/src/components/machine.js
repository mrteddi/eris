import React, { Component } from 'react';

class Machine extends Component {
    constructor(props) {
        super(props)
        this.state = {
            refresh: 0,
            machine: [],
            files: [],
            ports: [],
        }
    }

    runFetch() {
        fetch( `/api/getInfo?box=` + this.props.box )
        .then( res => res.json() )
        .then( res => {
            // console.log( res[0] );

            this.setState({
                files: [],
                ports: [],
            })
            
            for (let i = 0; i < res[0]['fileNum']; i++) {
                let tmp = this.state.files;
                tmp.push( { 'fileName' : `${res[0][`file${i}`]}`, 'points' : `${res[0][`file${i}Point`]}` } )
            }
            for (let i = 0; i < res[0]['portNum']; i++) {
                let tmp = this.state.ports;
                tmp.push( { 'port' : `${res[0][`port${i}`]}`, 'points' : `${res[0][`port${i}Point`]}` } )
            }

            this.setState({
                machine: res[0],
            })
        });
    }

    componentDidMount() {
        this.runFetch();
        this.interval = setInterval( () => {
            this.runFetch();
        }, 5000);
    }

    render() {
        return (
            <div className="mainBody">
                {this.props.box}
                <div>
                    {this.state.files.map( list =>
                        <p>Filename : {list.fileName} | Points : {list.points} </p>
                    )}
                    {this.state.ports.map( list =>
                        <p>Port : {list.port} | Points : {list.points} </p>
                    )}
                </div>
            </div>
        )
    }
}

export default Machine;