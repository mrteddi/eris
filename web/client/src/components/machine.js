import React, { Component } from 'react';

class Machine extends Component {
    constructor(props) {
        super(props)
        this.state = {
            machine: [],
        }
    }

    componentDidMount() {
        fetch( `/api/getInfo?box=` + this.props.box )
            .then( res => res.json() )
            .then( res => {
                console.log( res[0] );
                this.setState({
                    machine: res[0],
                })
            });
    }

    render() {
        return (
            <div>
                {this.props.box}
                <div>
                    {this.state.machine['file0']}
                </div>
            </div>
        )
    }
}

export default Machine;