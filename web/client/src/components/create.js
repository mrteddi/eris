import React, { Component } from 'react';

class Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            info: false,
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

    updateFileCount(sign) {
        let count = this.state.filecount;
        count += ( 1 * sign )
        if( count < 1 ) {
            return;
        }
        this.setState({
            filecount: count,
        });
    }

    revealInfo() {
        let tmp = !this.state.info;
        this.setState({
            info: tmp,
        })
    }

    render() {

        const files = [];

        for( let i = 0; i < this.state.filecount; i ++ ) {
            files.push( <input key={i} type='text' className="machineCreation" onChange={ e => this.changeHandler( e, 'files', i )}/> )
        }

        return (
            <div className="mainBody creationBody">
                <p>Create a machine:</p>
                <button onClick={ e => this.revealInfo()} className="listButton createInfo">
                    Input information
                </button>
                {this.state.info ?
                    <div className="createExpand">
                        <div>
                            Files input must be in the form:
                            <p>fullFilePath,EpochTimestamp</p>
                            <p>Ex) /home/user/user.txt,1588896333</p>
                            <p>Command:</p>
                            <p className="createCommand">stat --format %X filename</p>
                        </div>
                        <div>
                            Port input must be in the form:
                            <p>port1,port2</p>
                            <p>Ex) 21,22,23</p>
                        </div>
                        <div>
                            Network interface can be found from
                            <p>ifconfig, ip a, or iw</p>
                            <p>Command:</p>
                            <p className="createCommand">iw dev | awk '$1=="Interface"{'{'}print $2{'}'}'</p>
                        </div>
                    </div>
                    :
                    null
                }
                <form onSubmit={ e => this.createBox(e)}>
                    <div className="machineInfo">
                        Name:
                    </div>
                    <input type='text' className="machineCreation" onChange={ e => this.changeHandler( e, 'name' )}/>
                    <div className="fileLine machineInfo">Files:
                    {/* <p>Full filepath, Epoch Timestamp</p> */}
                    <button className="machineCreation machineButton" type="button" onClick={ e => this.updateFileCount(1)}>+</button>
                    <button className="machineCreation machineButton" type="button" onClick={ e => this.updateFileCount(-1)}>-</button>
                    </div>
                    {files}
                    <div className="machineInfo">
                        Ports:
                        {/* <p>Port, Port</p> */}
                    </div>
                    <input type='text' className="machineCreation" onChange={ e => this.changeHandler( e, 'ports' )}/>
                    <div className="machineInfo">
                        Network Interface:
                        {/* <p>ifconfig to get interface</p> */}
                    </div>
                    <input type='text' className="machineCreation" onChange={ e => this.changeHandler( e, 'network' )}/>
                    <div className="createAfter">
                        Copy this before submitting. Paste into vulnerable machine after submitting.
                        <p>sudo sh -c "$(curl http://10.0.0.206:5000/api/installer)"</p>
                    </div>
                    <input type='submit' className="machineCreation machineButton machineSubmit"/>
                </form>
            </div>
        )
    }
}

export default Create;