const mongoose = require('mongoose');
const url = process.env.MONGO_URL;

const connect = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, {useNewUrlParser: true,
              useUnifiedTopology: true ,
              useFindAndModify: false});
        let db = mongoose.connection;
        db.on('error', (error) => reject(error));
        db.once('open', function() {
            resolve();
            console.log('connected to mongoDB');
        });
    })
}

module.exports = {
    connect
}
