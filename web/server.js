const express = require('express');
const app = express();
const mysql = require('mysql');
const dbConfig = require('./config.json')

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

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);