
const ChatController = require('../controllers/homeChat/Chat')
const SubscriberController = require('../controllers/homeChat/Subscriber')

module.exports = (io) => {
  io.on('connection', (socket) => {
    try {
      socket.on('SOCKET_ID',() => { socket.emit(socket.id) })
      socket.on('conversation:create', SubscriberController.createConversation(socket, io))
      socket.on('conversation:join', SubscriberController.joinConversation(socket))
      socket.on('lobby:join', SubscriberController.joinLobby(socket))
      socket.on(`message:send`, ChatController.sendMessage(io))
      socket.on(`conversation:buzz`, ChatController.sendBuzz(io))
      socket.on(`chat:opened`, SubscriberController.chatOpened(io))
      socket.on(`conversation:attended`, SubscriberController.conversationAttended(socket))
      socket.on(`conversation:close`, SubscriberController.closeConversation(socket))
    } catch (error) {
      console.log(error)
    }
  });
}
