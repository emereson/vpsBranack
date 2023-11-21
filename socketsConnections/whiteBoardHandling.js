
const WhiteBoardController = require('../controllers/whiteBoardController')
const events = require('../enums/whiteBoardEvents');
const {getTeacher, getSudent} = require ('../graphQL/queries');
const {makeQuery} = require ('../graphQL/GraphQLClient');
const AccessDeniedError = require('../errors/AccessDeniedError');

const voiceCallController = require('../controllers/voiceCallController');
const videoCallController = require('../controllers/videoCallController');


module.exports = (io) => {

  const whiteBoardNameSpace = io.of('/whiteBoard');

  whiteBoardNameSpace.use(async (socket, next) => {
    // TODO
    // validate user token
    // If user isAdmin join any room (dangerous to send from client)
    const userId = socket.handshake.query.userId;
    const token = socket.handshake.query.token;
    const graphqlEndpoint = socket.handshake.query.graphqlEndpoint;
    const classRoomIdRequest = socket.handshake.query.classRoomId;
    const isTeacher = JSON.parse(socket.handshake.query.isTeacher);
    console.log(`Attempting to connnect to whiteBoard namespace classroom ${classRoomIdRequest}`);
    try {
      const query = isTeacher ? getTeacher : getSudent;
      const variables = {
        id: userId
      }
      const result = await makeQuery(graphqlEndpoint, token, query, variables);
      if (!result) {
        const error = new AccessDeniedError(`teacher or student with id ${userId} not found`);
        console.error(error)
        next(error);
      }
      const classRoomId = isTeacher ? result.getTeacher.classRoomId : result.getStudent.classRoomId; 
      if (classRoomIdRequest !== classRoomId) {
        const error = `userId ${userId} is not assigned to the classRoom ${classRoomIdRequest}`
        next(new AccessDeniedError(`you are not assigned to the classRoom ${classRoomIdRequest}, ask your teacher`));
      }
      else {
        socket.classRoomId = classRoomId;
        socket.join(classRoomId);
        next();
        console.log(`connected to whiteBoard namespace classroom ${classRoomIdRequest}`);
       }
    }
    catch(error) {
      console.error(`error connecting to whiteBoard namespace classRoom ${classRoomIdRequest}`);
      console.error(error);
      next(new Error(`error connecting userId ${userId} to whiteBoard`));
    }
  });

  whiteBoardNameSpace.on('connection', (socket) => {
    try {
      socket.emit('SOCKET_ID', socket.id);
      socket.on(events.DRAW_EVENT, WhiteBoardController.onDrawEvent(socket));
      socket.on(events.CLEAR_ALL, WhiteBoardController.onClearAll(socket));
      socket.on(events.REMOVE_SHAPE, WhiteBoardController.onRemoveShape(socket));
      socket.on(events.ADD_SHAPE, WhiteBoardController.onAddShape(socket));
      socket.on(events.SET_PAGE, WhiteBoardController.onSetShape(socket));
      //EVENT FOR CHANGE MODE TO WHITEBOARD
      socket.on(events.SET_MODE, WhiteBoardController.onSetModeWhiteboard(socket));
      //BLUR MODE EVENT
      socket.on(events.MODE_BLUR, WhiteBoardController.onWhiteboardBlur(socket));
      
      //event for calling video
      socket.on(events.CALLING_VIDEO, videoCallController.callingVideo(socket));
      socket.on(events.VIDEO_CALL_ACCEPTED, videoCallController.videoCallAccepted(socket));
      socket.on(events.EXIT_VIDEO_CALL, videoCallController.exitVideoCall(socket));
      socket.on(events.VIDEO_CALL_CANCELLED, videoCallController.videoCallCancelled(socket));

      //event for calling voice
      socket.on(events.CALLING_VOICE ,  voiceCallController.callingVoice(socket));
      socket.on(events.VOICE_CALL_ACCEPTED ,  voiceCallController.voiceCallAccepted(socket));
      socket.on(events.EXIT_VOICE_CALL ,  voiceCallController.exitVoiceCall(socket));
      socket.on(events.VOICE_CALL_CANCELLED ,  voiceCallController.voiceCallCancelled(socket));
      socket.on(events.SILENCE_REMOTE_VOICE_CALL ,voiceCallController.silenceRemoteVoiceCall(socket));
      socket.on(events.DELETE_USER_VOICE_CALL ,voiceCallController.deleteUserVoiceCall(socket));
      socket.on(events.GUEST_CONNECTED_VOICE_CALL ,voiceCallController.guestConnectedVoiceCall(socket));
      
      
    } catch (error) {
      console.error(error)
    }
  });
}
