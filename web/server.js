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

/*
app.get('/api/someEndpoint', (req, res) => {
    if( req.query.someEndpoint === "check" )

    db.query( `select blah blah="${req.query.name}"`, ( err, result ) => {
        res.send( result[0] )
    });
});
*/

app.get('/api/createBox', (req, res) => {

    query = `create table ${req.query.name}(user varchar(20), ports varchar(5), enum varchar(5), accounts varchar(5), services varchar(5) )`;

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

    db.query( query, ( err, result ) => {
        res.send( result[0]['ports'] );
        ret = result[0]['ports'];
        ret = ret.replaceAt( req.query.num, '1' );

        updateQuery = `update ${req.query.box} set ${req.query.field}='${ret}' where user=${req.query.user}`;

        db.query( updateQuery, ( err, result ) => {
            res.send( result[0] )
        });

    });

});



const port = 5000;

app.listen(port, () => `Server running on port ${port}`);