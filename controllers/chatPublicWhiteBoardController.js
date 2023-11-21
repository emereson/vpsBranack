
const MessgesChatPublicWhiteBoard =  require('../models/messgesChatPublicWhiteBoard');


//init de todo el sistema de chat
const join = ( socket , io) => (roomid) => {
    socket.leaveAll();
    socket.join(roomid, () => {
       // let notification = `${name} joined the class`;
        console.log('chat whiteboard conectaddo...', roomid);
       // socket.broadcast.to(roomid).emit('whiteboard:notification', { notification : notification});
    });
}

//envio de mensaje por el alumno
const sendMessage = (socket, io) => data => {
    console.log('cargando mensaje nuevo..')

    let message = null;

    if(data.private){
        message = new MessgesChatPublicWhiteBoard({
            message:data.message,
            autorid:data.autorid,
            name:data.name,
            avatar: data.avatar,
            avatarStatus:data.avatarStatus,
            color:data.color, 
            isAdmin:data.isAdmin,
            roomid:data.roomid,
            private:true,
            recipient:data.recipient,
        });
    }else{
        message = new MessgesChatPublicWhiteBoard({
            message:data.message,
            autorid:data.autorid,
            name:data.name,
            avatar: data.avatar,
            avatarStatus:data.avatarStatus,
            color:data.color, 
            isAdmin:data.isAdmin,
            roomid:data.roomid
        });
    }

    message.save((err) => {
        if (err) {throw err}
        console.log('WHITEBOARD NEW MESSAGE...');
        socket.broadcast.to(data.roomid).emit('whiteboard:sendMessagePrivate', { recipient:data.recipient });  
    });

    //io.sockets.in(data.roomid).emit('whiteboard:alert', {});
}

//todos los mensajes de la clase
const getAllMessages =  (io) => async (roomid)  => {
    console.log("enviando mensaje nuevo...")
    let messages =  await MessgesChatPublicWhiteBoard.find({"roomid": roomid });
    io.sockets.in(roomid).emit('whiteboard:messages', { messages : messages});
}

//NOTIFI PARA EL USUARIO DESDE EL ADMIN
const bellNotification = (socket , io) => bell => {
    //socket.broadcast.to
  
    io.sockets.in(bell.roomid).emit('whiteboard:bellNotificationChange', {
         status: bell.status,
         user_id: bell.userId,
         send_id: bell.send_id
    }); //version personal
}

const uploadimage = ( socket , io )=> ({
    url,
    roomid,
    userId
 }) => {
    
    console.log('WHITEBOARD AVATAR UPDATE FOR USER...')

    MessgesChatPublicWhiteBoard.updateMany({ "roomid": roomid, "autorid": userId },
        { $set: { avatar: url, avatarStatus:true } },
        function(err) {
          if (err) {
           console.log(err)
          }
          io.sockets.in(roomid).emit('whiteboard:alert', {});
        }
      );

      
 }
 
 const avatarStatus = (socket, io) => ({
    status,
    roomid,
    userId
 }) => {
    console.log('WHITEBOARD AVATAR UPDATE FOR USER...')

    MessgesChatPublicWhiteBoard.updateMany({ "roomid": roomid, "autorid": userId },
        { $set: { avatarStatus: status} },
        function(err) {
          if (err) {
           console.log(err);
          }
        }
      );

      io.sockets.in(roomid).emit('whiteboard:alert', {});
 }


 const changeColor = (socket) => ({roomid, textColor }) => {

    console.log('WHITEBOARD COLOR UPDATE FOR USER...');

    console.log(roomid , textColor)
    socket.broadcast.to(roomid).emit('whiteboard:changeColor', {textColor:textColor});
}

const deleteDataToDataBase = (socket , io) => ( ) => {

  console.log('SALIENDO...')
    
}


const sendMessagePrivate = (socket) => messagePrivate => {
    console.log(messagePrivate)
    socket.broadcast.to(messagePrivate.roomid).emit('whiteboard:sendMessagePrivate', {
        message:messagePrivate.message , 
        recipient:messagePrivate.recipient ,
         issuer:messagePrivate.issuer,
         issuerId:messagePrivate.issuerId

   }); 
}


// delete all whiteboard messages
const deleteAllMessages = (io) => async (object) => {
    // deleting
    await MessgesChatPublicWhiteBoard.deleteMany(object).then(() => {
        io.sockets.in(object.roomid).emit('whiteboard:deletedSuccess', null)
    }).catch((error) => {
        console.error(error)
    })
}

// latency
const activeSockets = (io) => async (object) => {
    console.log("activating the websockets again in the room", object.roomid)
    io.sockets.in(object.roomid).emit('whiteboard:reloadingSockets', null)
}



module.exports = {
    join,
    getAllMessages,
    sendMessage,
    sendMessagePrivate,
    bellNotification,
    avatarStatus,
    uploadimage,
    changeColor,
    activeSockets,
    deleteDataToDataBase,
    deleteAllMessages,
}
