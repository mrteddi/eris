const express = require('express');
const app = express();
const mysql = require('mysql');
const dbConfig = require('./config.json');
const { spawn } = require('child_process');
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

app.get('/api/createBox', (req, res) => {

    // Required params
    // box

    query = `create table ${req.query.box}(user varchar(20), ports varchar(5), enum varchar(5), accounts varchar(5), services varchar(5) )`;

    db.query( query, ( err, result ) => {
        res.send( result[0] )
    });

});

app.get('/api/newUser', (req, res) => {

    // Requried params
    // box user ports enum accounts services

    query = `insert into ${req.query.box} set user=${req.query.user}, ports=${req.query.ports}, enum=${req.query.enum}, accounts=${req.query.accounts}, services=${req.query.services}`;

    console.log( query );

    db.query( query, ( err, result ) => {
        res.send( result[0] )
    });

});

app.get('/api/updateUser', (req, res) => {

    // Required params
    // box user field num

    query = `select ${req.query.field} from ${req.query.box} where user=${req.query.user}`

    console.log( )
    db.query( query, ( err, result ) => {
        ret = result[0][ req.query.field ];
        ret = ret.replaceAt( req.query.num, '1' );

        updateQuery = `update ${req.query.box} set ${req.query.field}='${ret}' where user=${req.query.user}`;

        db.query( updateQuery, ( err, res2 ) => {
            //res.send( res2[0] );
        });

        db.query( `select * from ${req.query.box} where user=${req.query.user}`, ( err, res3 ) => {
            res.send( res3[0] );
        });

    });

});

app.get(`/api/getInfo`, (req, res) => {

    query = `select * from ${req.query.box} where user=${req.query.user}`;

    db.query( query, ( err, result ) => {
        res.send( result );
    });

});

app.get(`/api/getAnswer`, (req, res) => {

    query = `select * from machines where box='${req.query.box}'`;

    db.query( query, ( err, result ) => {
        res.send( result[0] );
    });

});

app.post('/api/receiveDaemon', (req, res ) => {
    console.log( req.body );
    console.log( req.body['Type'] );

    res.send( "erisServer Okay" );
});

app.get( `/api/genDaemon`, ( req, res ) => {

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

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);