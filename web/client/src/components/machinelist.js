import React, { Component } from 'react';

class MachineList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            boxes: [],
        };
    }

    componentDidMount() {
        fetch( `/api/getBoxes` )
            .then( res => res.json() )
            .then( result => {
                this.setState({
                    boxes: result,
                });
            });
    }

    createBox() {
        fetch( `/api/createBox` )
    }

    render() {
        return (
            <div>
                <button onClick={ () => this.createBox() }>Create Machine</button>
                {this.state.boxes.map( list =>
                    <button className="machineList" key={list.id}>{list.box}</button>
                )}
            </div>

        );
    }
}

export default MachineList;