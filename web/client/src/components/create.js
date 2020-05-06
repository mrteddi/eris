import React, { Component } from 'react';

class Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            network: '',
            files: [],
            filecount: 1,
            ports: [],
        }
    }

    createBox = (e) => {
        // e.preventDefault();

        let body = {
            'name': this.state.name,
            'network': this.state.network,
            'files': this.state.files,
            'ports': this.state.ports,
        }
        body = JSON.stringify(body);
        var options = {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: body,
        }

        fetch( `/api/createBox`, options )
            .then( res => console.log( res ) );
    }

    changeHandler(e, type, i) {
        switch(type) {
            case 'name':
                this.setState({
                    name: e.target.value
                });
                break;
            case 'files': 
                let tmp = this.state.files;
                tmp[i] = e.target.value.split(',');
                this.setState({
                    files: tmp
                });
                break;
            case 'ports':
                let tmp2 = e.target.value.split(',');
                this.setState({
                    ports: tmp2
                });
                break;
            case 'network':
                this.setState({
                    network: e.target.value,
                });
                break;
            default:
                break;
        }
    }

    updateFileCount = () => {
        let count = this.state.filecount;
        count++;
        this.setState({
            filecount: count,
        });
    }

    render() {

        const files = [];

        for( let i = 0; i < this.state.filecount; i ++ ) {
            files.push( <input key={i} type='text' className="machineCreation" onChange={ e => this.changeHandler( e, 'files', i )}/> )
        }

        return (
            <div className="mainBody">
                Create a machine:
                <form onSubmit={ e => this.createBox(e)}>
                    Name:
                    <input type='text' className="machineCreation" onChange={ e => this.changeHandler( e, 'name' )}/>
                    Files: <button type="button" onClick={this.updateFileCount}>+</button>
                    {files}
                    Ports:
                    <input type='text' className="machineCreation" onChange={ e => this.changeHandler( e, 'ports' )}/>
                    Network Interface:
                    <input type='text' className="machineCreation" onChange={ e => this.changeHandler( e, 'network' )}/>
                    <input type='submit'/>
                </form>
            </div>
        )
    }
}

export default Create;