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

console.log("Welcome to Hotelling server and right now it is " + D);
console.log("Today is the " + doy.doy(D) + "day of the year");

/* NOTIFICATION TEST CODE*/
var con_string = 'tcp://postgres@localhost/statemachine';
var pg_client = new pg.Client(con_string);
pg_client.connect();
console.log(pg_client);
pg_client.query('LISTEN createres');

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
var doySelected;
var hoursSelected;

// results for this one desk, this one day: OneDeskReservation
var deskResults;
// results for this one day all the desks: OneDayReservation
var scheduleResults;
// results for authenticated user
var authResults;

// desk is causing holding;
var holding;

// confirmed the users action and saved the results
var broadcastChange;

// socket user and email
var userId=0;

// username is email
var email;

// io open parenthesis
io.on('connection', function (socket) {

  socket.userId = userId ++;
  console.log('a user connected, user id: ' + socket.userId);

  socket.emit('serverConnected', { connected : true });
  console.log(socket);
  //pg_client.connect().then();
  socket.on('readyForData', function(data) {
	console.log(pg_client);

        pg_client.on('notification', function(msg) {
          console.log(msg);
          socket.emit('update', {message: msg});
      });
  });
  
  // the current date
  var ds = JSON.stringify(D);
  let startingstate;
  startingstate = deskstate || {};
 
  io.emit('currentstate', {data: startingstate});
  
  socket.on('holding', function(data) {
     console.log('holding : ')
     console.log(data);  
      //var d = 
 	//pg_client.query('update desks set holding = true where 
    });

  socket.on('released', function (data) {
     console.log('released');
     console.log(data);
  });


   socket.on('removeres', function(data) {

   console.log('remove reservation');
   console.log(data);
  });


   socket.on('email', function(data) {
     console.log('email');
     console.log(data);

  })

  socket.on('doy', function(data) {
    //  var c = new pg.Client;
    //  c.connectionParameters.host= '127.0.0.1';
    //  c.connectionParameters.user = 'postgres';
    //  c.connectionParameters.port = 5433;
    //  c.connectionParameters.database = 'statemachine';
   //   c.connect();
console.log('doy')
console.log (data);  
   })


   socket.on('desk', function() { 

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

   pg_client.query('select * from desk', [], (err, response) => {
     if (err) { 
        console.log(err);
      } 
      var results = [];   
      console.log(response.rows);
      for (var i = 0; i < response.rows.length; ++i) {
 	 console.log(response.rows[i]);
         results.push(response.rows[i]);
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
