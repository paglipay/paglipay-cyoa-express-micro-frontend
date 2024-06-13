const express = require("express");
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require("./config/passport");
const session = require('express-session');
const config = require("./config/extra-config");

const mongoose = require("mongoose");
const routes = require("./routes");

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage }).single('file')
const cors = require('cors');
const app = express();
app.use(cors());

const server = require('http').Server(app);
const io = require('socket.io')(server, {cors: {origin: "*"}});

// Enable CORS from client-side
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
const authCheck = require('./config/middleware/attachAuthenticationStatus');

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '500kb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session({ secret: config.sessionKey, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(authCheck);

const PORT = process.env.PORT || 3001;

app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});

// POST route from contact form
app.post('/contact', (req, res) => {

    // Instantiate the SMTP server
    const smtpTrans = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASS
        }
    })

    // Specify what the email will look like
    const mailOpts = {
        from: 'Your sender info here', // This is ignored by Gmail
        to: GMAIL_USER,
        subject: 'New message from contact form at tylerkrys.ca',
        text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
    }

    // Attempt to send the email
    smtpTrans.sendMail(mailOpts, (error, response) => {
        if (error) {
            res.render('contact-failure') // Show a page indicating failure
        }
        else {
            res.render('contact-success') // Show a page indicating success
        }
    })
})

// Define middleware here
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}
// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI ||
    "mongodb+srv://user1:Pa55w0rd@cluster0.ay0lz.mongodb.net/react-portfolio?retryWrites=true&w=majority");

// // Start the API server
// app.listen(PORT, function() {
//   console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
// });

// Start the API server
server.listen(PORT, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});

//socket stuff that needs to be moved
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const users = {};

io.on('connection', (socket) => {
    if (!users[socket.id]) {
        users[socket.id] = socket.id;
        const { error, user } = addUser({ id: socket.id, name: socket.id, room: 'room' });
    }
    socket.emit('yourID', socket.id);
    // io.sockets.emit('allUsers', users);
    io.sockets.emit('allUsers', getUsersInRoom('room'));
    socket.on('disconnect', () => {
        delete users[socket.id];
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }

        io.sockets.emit('allUsers', getUsersInRoom('room'));
    })

    socket.on('callUser', (data) => {
        io.to(data.userToCall).emit('hey', { signal: data.signalData, from: data.from });
    })

    socket.on('acceptCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })



    socket.on('join', ({ name, room }, callback) => {
        console.log('join: ' + socket.id + ":" + name + ' ' + room)
        const { error, user } = addUser( socket.id, name, room );

        if (error) return callback(error);
        
        console.log('join: ' + socket.id + ":" + user.name + ' ' + user.room)
        socket.join(user.room);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        // callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        console.log('sendMessage: ' + user.room + ":" + message)

        // io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('message', { user: user.name, text: message });

        // callback();
    });

    socket.on('sendLayout', (layout, callback) => {
        const user = getUser(socket.id);
        // console.log('sendLayout: ' + user.room + ":" + str(layout))

        // io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('layout', { user: user.name, layout });

        // callback();
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    })
})  