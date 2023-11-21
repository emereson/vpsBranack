var Twilio = require('twilio'); // see docs at https://www.twilio.com/docs/video/api/participants
const {
  HEROKU,
  TEACHER_PAS,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_ACCOUNT_SID,
} = process.env
var AudioVideoConference = require('../services/AudioVideoConference');

var imagebg = [];

var randomColor = require('randomcolor');
var colors = ['white', 'rgb(216, 252, 197)', 'rgb(249, 212, 244)', '#AEC6CF'];
var teacherColor = 'rgb(212, 243, 252)';
var chatHistory = {};
var rooms = {};
var roomColors = {};
var canvasStates = {};
var iconsColor = 'black';

/* Twilio Configuration */
var twilioClient = new Twilio(
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  { accountSid: TWILIO_ACCOUNT_SID }
);

function getColor(room) {
  if (roomColors[room].length > 0) return roomColors[room].shift();
  return randomColor({
    luminosity: 'light',
    format: 'rgb'
  });
}

function getRoomState(room) {
  if (rooms[room] == undefined) rooms[room] = true;
  return rooms[room];
}

function setRoomState(room, state) {
  console.log('room ' + room + ' set to ' + state);
  rooms[room] = state;
}

/*Twilio user has diconnnected from call*/
async function conferenceUserDisconected() {
  console.log('conferenceUserDisconected');
  //check if there are other users in the room
  try {
    var participantsConnected = await getConferenceParticipants();
    //if there is at least one participant connected there is an ongoing audio or video call
    if (participantsConnected.length > 0) return;
    AudioVideoConference.setAudioConferenceState(false);
    AudioVideoConference.setVideoConferenceState(false);
  } catch (err) {
    console.log(err);
  }
}

function getConferenceParticipants() {
  return twilioClient.video
    .rooms('testRoom')
    .participants.list({ status: 'connected' });
}


module.exports = (io) => {

  io.on('connection', function (socket) {
    socket.on('get icon color', function () {
      socket.emit('set icon color', iconsColor);
    });

    socket.on('getConferenceState', function () {
      console.log('getConferenceState');
      socket.emit(
        'getConferenceState',
        AudioVideoConference.getAudioVideoConferenceState()
      );
    });

    socket.on('twilioError', conferenceUserDisconected);

    socket.on('AudioCall', function () {
      AudioVideoConference.setAudioConferenceState(true);
      socket.broadcast.emit('AudioCall');
    });

    socket.on('VideoCall', function () {
      AudioVideoConference.setVideoConferenceState(true);
      socket.broadcast.emit('VideoCall');
    });

    socket.on('set icon color', function (color) {
      iconsColor = color;
      wbCtrl.updateClients(socket, 'set icon color', color);
    });

    socket.on('get total Pages', function (room) {
      socket.emit('total pages', wbCtrl.getTotalPages(room));
    });

    socket.on('get room state', function (data) {
      wbCtrl.joinWB(socket, data.room + ':' + data.index);
      socket.join(data.room);
      var state = wbCtrl.getWBState(socket);
      socket.emit('room state', {
        state: state,
        index: data.index
      });
    });

    socket.on('get world snapshot', function (data) {
      wbCtrl.joinWB(socket, data.room + ':' + data.index);
      socket.join(data.room);
      var state = wbCtrl.getWBState(socket);
      socket.emit('world state', {
        index: data.index,
        state: state
      });
    });

    socket.on('change wb', function (data) {
      wbCtrl.joinWB(socket, data.room + ':' + data.index);
      socket.join(data.room);
      socket.broadcast.to(data.room).emit('change wb', data);
    });

    var wbCtrl = require('../../whiteBoardCtrl');

    socket.on('set room background', function (data) {
      console.log('new bg ');
      wbCtrl.setRoomBackground(data.roomID, data.background);
      wbCtrl.updateClients(socket, 'set room background', data.background);
    });

    socket.on('get room background', function (data) {
      var bg = wbCtrl.getRoomBackground(data.roomID);
      if (bg) socket.emit('set room background', bg);
    });

    socket.on('create wb', function (data) {
      console.log('creating');
      //register whiteboard if it doesnt exist
      wbCtrl.createWB(data.room, data.count - 1);
      //join room for this white board int he form roomID:whiteBoard
      wbCtrl.joinWB(socket, data.room + ':' + data.count);
      io.to(data.room).emit('total pages', wbCtrl.getTotalPages(data.room));
    });

    socket.on('update room', function (state) {
      wbCtrl.updateWB(socket, state);
    });

    socket.on('update canvas', function (data) {
      console.log('WB: ' + data.index);
      wbCtrl.updateWB(data.canvas, data.room, data.index - 1);
      canvasStates[data.room] = data.canvas;
      console.log('updated');
    });

    socket.on('get canvas state', function (data) {
      /*if(canvasStates[data.room])
      socket.emit('update canvas',canvasStates[data.room]);*/
      var state = wbCtrl.getWBState(data.room, data.count - 1);
      var data2 = {
        img: state,
        wbIndex: data.count,
        wb: data.count
      };
      socket.emit('update canvas', data2);
    });

    socket.on('teacher socket', function (data) {
      console.log(data);
      if (data.pass === TEACHER_PAS) {
        socket.isTeacher = true;
        //color asginado al director
        socket.color = teacherColor;
      }
    });

    socket.username = 'participante ';

    if (HEROKU === 'true') {
      io.set('transports', ['xhr-polling']);
      io.set('polling duration', 20);
    }

    socket.on('chat-history', function (room) {
      socket.join(room);
      socket.currentRoom = room;
      if (chatHistory[socket.currentRoom]) {
        console.log(chatHistory[socket.currentRoom]);
      } else {
        chatHistory[socket.currentRoom] = [];
      }
      socket.emit('chat-history', chatHistory[socket.currentRoom]);
    });

    socket.on('chat message', function (msg) {
      if (!roomColors[msg.room]) {
        roomColors[msg.room] = colors.slice();
      }
      if (!socket.color) {
        socket.color = getColor(msg.room);
      }
      socket.currentRoom = msg.room;
      socket.join(msg.room);
      var msgObj = {
        msg: msg.msg,
        user: socket.isTeacher ? 'Director' : socket.username,
        color: socket.color,
        time: new Date()
      };
      io.to(msg.room).emit('chat message', msgObj);
      if (chatHistory[msg.room]) {
        chatHistory[msg.room].push(msgObj);
      } else {
        chatHistory[msg.room] = [];
      }
    });

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    socket.on('hung-up', function () {
      wbCtrl.updateClients(socket, 'hung-up');
    });

    // Start listening for mouse move events
    socket.on('mousemove', function (data) {
      //socket.broadcast.to(data.room).emit('moving', data);
      //console.log(socket.rooms);
      wbCtrl.updateClients(socket, 'moving', data);
    });

    socket.on('handDown', function (data) {
      wbCtrl.updateClients(socket, 'handDown', data);
    });

    socket.on('unique id', function () {
      socket.emit('unique id', socket.id);
    });

    //20 HZ
    var updateRate = 100;
    setInterval(function () {
      //update clients of the world state
      //io.to()
      //console.log(roomState)
    }, 1000 / updateRate);

    socket.on('stroke path', function (data) {
      data.id = socket.id;
      wbCtrl.updateClients(socket, 'stroke path', data);
    });

    socket.on('up', function (data) {
      wbCtrl.updateClients(socket, 'up', data);
    });

    var roomState = {};
    socket.on('handPoint', function (data) {
      data.id = socket.id;
      var room = wbCtrl.getCurrentRoom(socket);
      if (!roomState[room]) {
        roomState[room] = {};
      }
      if (data.type == 'add') {
        if (!roomState[room][socket.id]) {
          roomState[room][socket.id] = [{ x: data.x, y: data.y }];
        } else {
          roomState[room][socket.id].push({ x: data.x, y: data.y });
        }
      }
      if (data.type == 'up') {
        roomState[room][socket.id] = [];
      }
    });

    socket.on('handUp', function (data) {
      wbCtrl.updateClients(socket, 'handUp', data);
    });

    socket.on('paint', function (data) {
      wbCtrl.updateClients(socket, 'paint', data);
    });

    socket.on('circle', function (data) {
      wbCtrl.updateClients(socket, 'circle', data);
    });

    socket.on('bin', function (data) {
      wbCtrl.updateClients(socket, 'bin', data);
    });

    socket.on('arrow', function (data) {
      wbCtrl.updateClients(socket, 'arrow', data);
    });

    socket.on('erase', function (data) {
      data.id = socket.id;
      wbCtrl.updateClients(socket, 'erase', data);
    });

    socket.on('rectangle', function (data) {
      wbCtrl.updateClients(socket, 'rectangle', data);
    });

    socket.on('segment', function (data) {
      wbCtrl.updateClients(socket, 'segment', data);
    });

    socket.on('clickpoint', function (data) {
      wbCtrl.updateClients(socket, 'clickpointser', data);
    });

    socket.on('clearall', function (data) {
      wbCtrl.updateClients(socket, 'clearallser', data);
    });
    socket.on('coordinates', function (data) {
      console.log(data);
    });

    socket.on('fileperaltri', function (data) {
      wbCtrl.updateClients(socket, 'fileperaltriser', data);
      imagebg.push(data.fileperaltri + '_' + data.room);
      if (imagebg.length > 50) {
        imagebg.shift();
      }
    });

    socket.on('imagefore', function (data) {
      wbCtrl.updateClients(socket, 'imageforeser', data);
    });

    socket.on('undo', function (data) {
      wbCtrl.updateClients(socket, 'undo', data);
    });

    socket.on('redo', function (data) {
      wbCtrl.updateClients(socket, 'redo', data);
    });

    socket.on('image upload', function (data) {
      wbCtrl.updateClients(socket, 'image upload', data);
    });

    socket.on('text json', function (data) {
      wbCtrl.updateClients(socket, 'text json', data);
    });

    socket.on('controlstudents', function (data) {
      setRoomState(data.room, data.controlstudents);
      socket.broadcast.to(data.room).emit('change student permission', data);
    });

    socket.on('get student permission', function (data) {
      socket.emit('controlstudents', getRoomState(data.room));
    });

    socket.on('writetext', function (data) {
      wbCtrl.updateClients(socket, 'writetextser', data);
    });

    socket.on('removestream', function (data) {
      socket.broadcast.to(data.room).emit('removestreamser', data.data);
    });

    socket.on('message', function (data) {
      socket.broadcast.to(data.room).emit('message', data.data);
    });
  });
}


