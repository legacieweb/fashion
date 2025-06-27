const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const Message = require('./models/Message');
require('dotenv').config();
require('./jobs/messageReminder'); // ✅ Import background job

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Allowed frontend domains
const allowedOrigins = [
  'https://fashion-q1zg.onrender.com', // For local dev
  'https://iyonicfashion.iyonicorp.com' // ✅ Your live frontend domain
];

// ✅ Configure Socket.IO with strict CORS
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI;

// ====================
// ✅ Middleware
// ====================
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(bodyParser.json());

// ====================
// ✅ API Routes
// ====================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/messages', require('./routes/messages'));

app.get('/', (req, res) => res.send('✅ Iyonic Fashion API is live'));

// ====================
// ✅ WebSocket Events
// ====================
io.on('connection', (socket) => {
  console.log('🔌 New socket connected:', socket.id);

  socket.on('join', ({ userId, isAdmin }) => {
    const room = isAdmin ? 'admin-room' : `user-${userId}`;
    socket.join(room);
    console.log(`👤 Joined room: ${room}`);
  });

  socket.on('chatMessage', async ({ from, to, content, sender }) => {
    try {
      const msg = new Message({ userId: to, sender, content });
      await msg.save();

      const room = sender === 'admin' ? `user-${to}` : 'admin-room';

      io.to(room).emit('chatMessage', {
        from,
        content,
        sender,
        timestamp: msg.timestamp
      });
    } catch (err) {
      console.error('❌ Error saving message:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

// ====================
// ✅ Connect MongoDB and Start Server
// ====================
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  server.listen(port, () => {
    console.log(`🚀 Server + WebSocket running on port ${port}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});
