/**
 * Module dependencies.
 */

var devEnvironment = true;

process.argv.forEach( function( element ) {
    if( element === 'live' ) {
        devEnvironment = false;
    }
} );

var express = require( 'express' );

var http = require( 'http' );

var app = express();
var docs = express();

// all environments
app.set( 'port', process.env.PORT || 3000 );
app.set( 'hostname', process.env.HOSTNAME || 'localhost' );

app.use( express.logger( 'dev' ) );
app.use( express.json() );
app.use( express.urlencoded() );
app.use( express.methodOverride() );

app.use( express.static( __dirname + '/src' ) );
if( devEnvironment ) {
    app.use( express.static( __dirname + '/mock_data' ) );
}
app.use( app.router );

docs.get( '/', function( req, res ) {
    res.render( 'index.html' );
} );


http.createServer( app ).listen( app.get( 'port' ), app.get( 'hostname' ), function() {
    console.log( 'Express server listening on ' + app.get( 'hostname' ) + ':' + app.get( 'port' ) );
} );