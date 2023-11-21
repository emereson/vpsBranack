const events = require('../enums/whiteBoardEvents');

const callingVideo = (socket) => (data) => {
  socket.broadcast.to(socket.classRoomId).emit(events.CALLING_VIDEO, data);
};

const videoCallAccepted = (socket) => (data) => {
  socket.broadcast.to(socket.classRoomId).emit(events.VIDEO_CALL_ACCEPTED, data);
};

const videoCallCancelled = (socket) => (user) => () => {
  socket.broadcast
    .to(socket.classRoomId)
    .emit(events.VIDEO_CALL_CANCELLED, user);
};

const exitVideoCall = (socket) => (user) => {
  socket.emit(events.EXIT_VIDEO_CALL, user);
};

module.exports = {
  callingVideo,
  videoCallAccepted,
  videoCallCancelled,
  exitVideoCall,
};
