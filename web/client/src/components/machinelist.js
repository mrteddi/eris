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

    render() {
        return (
            <div className="mainList">
                <button className="listButton createButton" onClick={this.props.changeComp}>Create Machine</button>
                <p>Current Machines:</p>
                {this.state.boxes.map( list =>
                    <button className="machineList listButton" onClick={this.props.changeComp} key={list.id}>{list.box}</button>
                )}
            </div>

        );
    }
}

export default MachineList;