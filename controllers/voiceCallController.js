const events = require('../enums/whiteBoardEvents');


const callingVoice = socket => roomId => {

    socket.broadcast.emit(events.CALLING_VOICE, roomId);
}

const voiceCallAccepted = socket => () => {
    socket.broadcast.emit(events.VOICE_CALL_ACCEPTED,{});
}

const voiceCallCancelled = socket => roomId => {
    socket.broadcast.emit(events.VOICE_CALL_CANCELLED, roomId);
}


const exitVoiceCall = socket => user => {

    socket.emit(events.EXIT_VOICE_CALL, user);
}

const silenceRemoteVoiceCall = socket => user => {

    socket.broadcast.emit(events.SILENCE_REMOTE_VOICE_CALL, user);
}

const deleteUserVoiceCall = socket => user => {

    socket.broadcast.emit(events.DELETE_USER_VOICE_CALL,user);
}

const guestConnectedVoiceCall = socket => data => {

    socket.broadcast.emit(events.GUEST_CONNECTED_VOICE_CALL,data);
}

module.exports = {
    callingVoice,
    voiceCallAccepted,
    voiceCallCancelled,
    exitVoiceCall,
    silenceRemoteVoiceCall,
    deleteUserVoiceCall,
    guestConnectedVoiceCall
}