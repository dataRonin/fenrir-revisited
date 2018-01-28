'use strict';

/* load in the node things */ 
var D = new Date(Date.now());
var fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var pg = require('pg');

// custom library returns day of year
var doy = require('/home/enlighted/fenrir/app2/socket.io-unity/Demo/test-server/doy.js');

// updated every minute with current system desk occupancy
var deskstate = require('/home/enlighted/fenrir/app2/socket.io-unity/Demo/test-server/deskstate.json');
//var deskstate = require('../deskstate.json');

console.log("Welcome to Hotelling server and right now it is " + D);
console.log("Today is the " + doy.doy(D) + "day of the year");

/* NOTIFICATION TEST CODE*/
var con_string = 'tcp://postgres@localhost/statemachine';
var pg_client = new pg.Client(con_string);
pg_client.connect();
var query = pg_client.query('LISTEN addedrecord');

pg.host='localhost';
pg.port = 5433;
pg.user='postgres';
pg.database='statemachine';

// this is a test client and will be removed
var c2 = new pg.Client;
c2.connectionParameters.host='127.0.0.1';
c2.connectionParameters.port=5433;
c2.connectionParameters.user='postgres';
c2.connectionParameters.database='statemachine';

// here are some api
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/api', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/desks', function(req, res) {
   res.sendfile(__dirname + '/deskstate.json');
});

/*  OUTPUT STRUCTURES */
// query for one day in future for a certain desk
var deskSeleted;
var deskResults;
var deskResultsQuery = "select * from desks";

// query for all the desks on some future day
var doySelected;
var hoursSelected;
var scheduleResults;
var authResults;
var authResultsQuery;

// desk is causing holding;
var holding;

// confirmed the users action and saved the results
var broadcastChange;;

// socket user and email
var userId=0;
var email;
var valid;

// io open parenthesis
io.on('connection', function (socket) {
  socket.userId = userId ++;
  console.log('a user connected, user id: ' + socket.userId);
  socket.emit('serverConnected', { connected : true });
  socket.on('readyForData', function(data) {

     pg_client.on('notification', function(mac, tf, tt, doy) {
          socket.emit('update', {message: {mac: mac, tf: tf, tt: tt, doy: doy}});
      });
  });
  // FUNCTION 1 : GET USER EMAIL WHEN HEAR 'EMAIL' AND RESPOND WITH VALID OR NOT BOOL
  var cState = new pg.Client;
  cState.connectionParameters.host= '127.0.0.1';
  cState.connectionParameters.user = 'postgres';
  cState.connectionParameters.port = 5433;
  cState.database = 'statemachine';
  cState.connect();

   
  // the current date
  var ds = JSON.stringify(D);
  // for testing
  io.emit('currentstate', {data:
	 { 'mac': '6ed978',
	   'state': 'v', 
           'capture_at': ds, 
           'holding': false, 
           'doy': doy.doy(D) 
          }
   });
   socket.on('doy', function(data) {
      var c = new pg.Client;
      c.connectionParameters.host= '127.0.0.1';
      c.connectionParameters.user = 'postgres';
      c.connectionParameters.port = 5433;
      c.database = 'statemachine';
      c.connect();
   })


   socket.on('desk', function() { 
     var c = new pg.Client;
     c.connectionParameters.host= '127.0.0.1';
     c.connectionParameters.user = 'postgres';
     c.connectionParameters.port = 5433;
     c.database = 'statemachine';
     c.connect();

    var pushDeskDataResults = function (err, results_) {
      if (err) {
        console.log(err);
      }
      deskResults = results_;
      emitAnyResults(null, 'deskdata', {d: deskResults});
    }
  
    var emitAnyResults = function (err, msg, data) {
       if (err) {
 	console.log(err)
       }
       io.emit(msg, data)
    }

   c.query('select * from desk', [], (err, response) => {
     if (err) { 
        console.log(err);
      } 
      var results = [];   
      console.log(response.rows);
      for (var i = 0; i < response.rows.length; ++i) {
 	 console.log(response.rows[i]);
         results.append(response.rows[i]);
      }
      pushDeskDataResults(null, results);
    });
  });

  socket.on('chat', function(msg){
     console.log('message from user#' + socket.userId + ": " + msg);
   
     io.emit('chat', {
      id: socket.userId,
      msg: msg
     });
  });

  //socket.on('disconnect', function(msg) {
  //   console.log('a user disconnected');
  // });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
