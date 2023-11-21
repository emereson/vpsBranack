const events = require('../enums/whiteBoardEvents');

const onDrawEvent = socket => payload => {
    payload.socketId = socket.id;
    socket.broadcast.to(socket.classRoomId).emit(events.DRAW_EVENT, payload);
}

const onClearAll = socket => () => {
    socket.broadcast.to(socket.classRoomId).emit(events.CLEAR_ALL);
}

const onRemoveShape = socket => payload => {
    socket.broadcast.to(socket.classRoomId).emit(events.REMOVE_SHAPE, payload);
}

const onAddShape = socket => payload => {
    socket.broadcast.to(socket.classRoomId).emit(events.ADD_SHAPE, payload);
}

const onSetShape = socket => payload => {
    socket.broadcast.to(socket.classRoomId).emit(events.SET_PAGE, payload);
}

const onSetModeWhiteboard = socket => mode => {
    let modewhiteboard = mode;
    socket.broadcast.to(socket.classRoomId).emit(events.GET_MODE, modewhiteboard);
};

const onWhiteboardBlur = socket => blur => {
    socket.broadcast.to(socket.classRoomId).emit(events.MODE_BLUR, blur);
};

const callingVideo = socket => () => {
    socket.broadcast.to(socket.classRoomId).emit(events.CALLING_VIDEO,{});
}

const videoCallAccepted = socket => () => {
    socket.broadcast.to(socket.classRoomId).emit(events.VIDEO_CALL_ACCEPTED,{});
}

const videoCallCancelled = socket => user => () => {
    
    socket.broadcast.to(socket.classRoomId).emit(events.VIDEO_CALL_CANCELLED, user );
}

const exitVideoCall = socket => user => {
   // socket.broadcast.to(socket.classRoomId).emit(events.EXIT_VIDEO_CALL, user);

    socket.emit(events.EXIT_VIDEO_CALL, user);
}

module.exports = {
    onDrawEvent,
    onClearAll,
    onRemoveShape,
    onAddShape,
    onSetShape,
    onSetModeWhiteboard,
    onWhiteboardBlur,
    callingVideo,
    videoCallAccepted,
    videoCallCancelled,
    exitVideoCall
}
