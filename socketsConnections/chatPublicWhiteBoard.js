const whiteBoardChat = require('../controllers/chatPublicWhiteBoardController.js')
module.exports = (io) => {
    io.on('connection', (socket) => {
        try {
            socket.on('whiteboard:join', whiteBoardChat.join(socket,io));
            socket.on('whiteboard:activeSockets', whiteBoardChat.activeSockets(io));
            socket.on('whiteboard:sendMessage', whiteBoardChat.sendMessage(socket, io));
            socket.on('whiteboard:sendMessagePrivate', whiteBoardChat.sendMessagePrivate(socket));
            socket.on('whiteboard:messages', whiteBoardChat.getAllMessages(io));
            socket.on('whiteboard:bellNotification', whiteBoardChat.bellNotification(socket , io));
            socket.on('whiteboard:uploadimage', whiteBoardChat.uploadimage(socket, io));
            socket.on('whiteboard:avatarStatus', whiteBoardChat.avatarStatus(socket, io));
            socket.on('whiteboard:changeColor', whiteBoardChat.changeColor(socket));
            socket.on('whiteboard:deleteMessages', whiteBoardChat.deleteAllMessages(io));
            socket.on('disconnect', whiteBoardChat.deleteDataToDataBase(socket, io));
console.log(socket.on('whiteboard:messages', whiteBoardChat.getAllMessages(io)));
        } catch (error) {
            console.log(error)
        }
    });

   
}

