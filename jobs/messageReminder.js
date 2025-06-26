const Message = require('../models/Message');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

async function checkUnreadMessages() {
  const threshold = new Date(Date.now() - 30 * 60 * 1000); // 30 mins ago

  const results = await Message.aggregate([
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: '$userId',
        lastMessage: { $first: '$$ROOT' }
      }
    },
    {
      $match: {
        'lastMessage.timestamp': { $lte: threshold },
        'lastMessage.read': false,
        'lastMessage.sender': 'user'
      }
    }
  ]);

  for (const entry of results) {
    const user = await User.findById(entry._id);
    await sendEmail({
      to: 'admin@example.com',
      subject: `⏰ Unread message from ${user.name || 'User'}`,
      text: `You have not replied to the user (${user.email}) in over 30 minutes.\n\nMessage:\n${entry.lastMessage.content}`
    });
  }
}

setInterval(checkUnreadMessages, 5 * 60 * 1000); // every 5 minutes
console.log('⏱️ Message reminder job is running...');
