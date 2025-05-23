import jsonServer from 'json-server'
var server = jsonServer.create()
var router = jsonServer.router( require( './backend/db.js' )() )
var middlewares = jsonServer.defaults()

server.use( middlewares )
server.use( router )
server.listen( 3000, function () {
  console.debug( 'JSON Server is running' )
} )
