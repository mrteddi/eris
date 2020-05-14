import React, { Component, Fragment } from 'react';
const download = require("downloadjs");

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

    async downloadDaemon() {
        const res = await fetch(`/api/downloadDaemon`);
        const blob = await res.blob();
        download(blob, "eris");
    }

    render() {
        return (
            <div className="mainBody">
                <p className="machineTitle">
                    {this.props.box}
                </p>
                <div>
                    <table className="machineTable">
                        <thead>
                        <tr>
                            <th className="machineCol">Type</th>
                            <th className="machineCol">Value</th>
                            <th className="machineCol">Completed</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.files.map( list =>
                            <Fragment>
                                <tr className="machineRow" key={list.fileNum}>
                                    <td className="machineCol" key={list.fileNum}>Filename</td>
                                    <td className="machineCol" key={list.fileName}>{list.fileName}</td>
                                    <td className="machineCol" key={list.points}>{list.points}</td>
                                </tr>
                            </Fragment>
                        )}
                        {this.state.ports.map( list =>
                            <Fragment>
                                <tr className="machineRow">
                                    <td className="machineCol" key={list.portNum}>Port</td>
                                    <td className="machineCol" key ={list.port}>{list.port}</td>
                                    <td className="machineCol" key={list.points}>{list.points}</td>
                                </tr>
                            </Fragment>
                        )}
                        </tbody>
                    </table>
                </div>
                {/* <button className="downloadButton listButton" onClick={this.downloadDaemon}>Download</button> */}
            </div>
        )
    }
}

export default Machine;