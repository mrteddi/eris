const express = require('express');
const app = express();
const mysql = require('mysql');
const dbConfig = require('./config.json');
const { spawn } = require('child_process');
const request = require('request');
fs = require('fs');

app.use(express.json())

String.prototype.replaceAt=function(index, char) {
    var a = this.split("");
    a[index] = char;
    return a.join("");
}

// Create connection
const db = mysql.createConnection({
    host     : dbConfig.host,
    user     : dbConfig.user,
    password : dbConfig.password,
    database : dbConfig.database
});

// Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

app.post( `/api/createBox`, (req, res) => {

    query = `create table ${req.body['name']} (network varchar(60), fileNum int, portNum int, `;
    insertQuery = `insert into ${req.body['name']} set network = "${req.body['network']}", `
    insertQuery += `fileNum = ${req.body['files'].length}, portNum = ${req.body['ports'].length}, `

    filesJson = {
        'files': []
    }

    for (let i = 0; i < req.body['files'].length; i++) {
        query += `file${i} varchar(60), file${i}Point varchar(5), `;
        insertQuery += `file${i} = "${req.body['files'][i][0]}", `;
        let obj = {};
        obj['fileName'] = req.body['files'][i][0];
        obj['time'] = req.body['files'][i][1];
        filesJson['files'].push( obj );
    }
    filesJson = JSON.stringify(filesJson);
    for (let i = 0; i < req.body['ports'].length; i++) {
        query += `port${i} varchar(60), port${i}Point varchar(5), `
        insertQuery += `port${i} = "${req.body['ports'][i]}", `
    }
    query = query.slice(0, -2);
    insertQuery = insertQuery.slice(0, -2);
    query += ` );`
    insertQuery += `;`

    // console.log( query );
    // console.log( insertQuery );

    db.query( query, ( err, result ) => {
        if( err ) {
            console.log( err );
            return;
        }
    });

    db.query( insertQuery, ( err, result ) => {
        if( err ) {
            console.log( err );
            return;
        }
    });

    db.query( `insert into machines set box="${req.body['name']}"`, ( err, result ) => {
        if( err ) {
            console.log( err );
            return;
        }
    });

    query = `http://10.0.0.206:5000/api/genDaemon?name=${req.body['name']}&network=${req.body['network']}&ports=${req.body['ports']}&files=${filesJson}`;
    request.get( query );
});

app.get( `/api/getBoxes`, ( req, res ) => {

    query = `select * from machines`;

    db.query( query, ( err, result ) => {
        res.send( result );
    });
});

/*
    Retrieve all the info from a machine's table
*/
app.get(`/api/getInfo`, (req, res) => {

    query = `select * from ${req.query.box}`;

    db.query( query, ( err, result ) => {
        for (let i = 0; i < result[0]['fileNum']; i++) {
            if( result[0][`file${i}Point`] === null ) {
                result[0][`file${i}`] = "??";
                result[0][`file${i}Point`] = "✗";
            }   
        }
        for (let i = 0; i < result[0]['portNum']; i++) {
            if( result[0][`port${i}Point`] === null ) {
                result[0][`port${i}`] = "??";
                result[0][`port${i}Point`] = "✗";
            }   
        }

        delete result[0]['network'];
        res.send( result );
    });

});

app.post('/api/receiveDaemon', (req, res ) => {
    console.log( req.body );
    console.log( req.body['Type'] );

    name = req.body['Name'];
    type = req.body['Type'];
    ans = req.body['Body'];

    query = `select * from ${name}`

    db.query( query, ( err, result ) => {
        result = result[0];
        for (let i = 0; i < result[`${type}Num`]; i++) {
            if( result[`${type}${i}`] == ans ) {
                query = `update ${name} set ${type}${i}Point = '✓'`
                db.query( query, ( err, result ) => {
                    res.send( `${type}${i}Point updated to 1` );
                });
            }
        }
    });
});

app.get( `/api/genDaemon`, ( req, res ) => {

    name = req.query.name;
    network = req.query.network;
    ports = req.query.ports;
    fileString = "";
    files = JSON.parse( req.query.files )['files'];
    let jsonKeys = Object.keys( files );

    jsonKeys.forEach( file => {
        let obj = files[file];
        fileString += `"${obj['fileName']}": "${obj['time']}",
        `
    });

    erisConfig = `
    package erisconfig

    // Name configs
    var Name string = "${name}"

    // Network interface configs
    var Network string = "${network}"

    // Ports configs
    var Ports []int = []int{${ports}}

    // Files configs
    var Files map[string]string = map[string]string{
        ${fileString}
    }
    `
    fs.writeFile('/home/conor/go/src/daemon/erisconfig/erisconfig.go', erisConfig, function( err ) {
        if (err) return console.log(err);
    })
    const build = spawn('go', ['build', '-o', './eris', '/home/conor/go/src/daemon']);
    build.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    res.send( "Eris Daemon Successfully created" );
});

app.get( `/api/downloadDaemon`, ( req, res ) => {
    res.download( './eris' );
})

app.get( `/api/installer`, ( req, res ) => {
    fs.readFile('./install.sh', 'utf8', function(err, data) {
        if (err) throw err;
        res.send( data );
    });
})

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);