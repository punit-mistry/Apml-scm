const express = require('express');
const { Client,LocalAuth  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const client = new Client({
    authStrategy: new LocalAuth()
});
 

let isWhatsAppReady = false;

app.get('/qrcode', async (req, res) => {
  if (!isWhatsAppReady) {
    let qrData = '';

    // Create a promise to wait for the QR code generation
    const waitForQRCode = new Promise((resolve) => {
      // Generate and display the QR code in the terminal
      client.on('qr', (qr) => {
        console.log(qr);
        qrData = qr;
        qrcode.generate(qr, { small: true });
        
        // Resolve the promise once the QR code is generated
        resolve();
      });
    });

    // Listen for the 'authenticated' event to know when WhatsApp is ready
    client.on('authenticated', (session) => {
      console.log('WhatsApp authenticated');
      isWhatsAppReady = true;
    });

    // Initialize the WhatsApp client
    client.initialize();

    // Wait for the QR code to be generated before sending the response
    await waitForQRCode;

    // Respond with QR code data as JSON
    res.json({ qrCodeData: qrData });
  } else {
    res.send(`
      <div class="flex gap-5">
        <input
          type="text"
          className="w-60 border-2 border-black h-10 p-2 rounded-lg"
          placeholder="Send WhatsApp Message.."
          id="messageInput"
        />
        <button
          className="bg-green-600 p-2 rounded-lg text-white font-bold"
          id="sendMessageButton"
        >
          💬 Send Message
        </button>
      </div>
    `);
  }
});

app.get('/chat/messages/:username', async (req, res) => {
  if (isWhatsAppReady) {
    try {
      const { username } = req.params;

      // Find the chat by username
      const chat = await client.getChatById(username);

      // Check if the chat exists
      if (chat) {
        // Define search options to retrieve messages
        const searchOptions = {
          limit: 10, // Number of messages to retrieve (adjust as needed)
        };

        // Fetch messages from the chat
        const messages = await chat.fetchMessages(searchOptions);

        // Extract relevant message information
        const messageData = messages.map((message) => ({
          id: message.id.id,
          content: message.body,
          timestamp: message.timestamp,
          FromMe:message.id.fromMe
        }));

        res.json(messageData);
      } else {
        res.status(404).send('Chat not found');
      }
    } catch (error) {
      console.error('Error retrieving chat messages:', error);
      res.status(500).send('Error retrieving chat messages.');
    }
  } else {
    res.status(400).send('WhatsApp is not yet ready.');
  }
});


app.post('/send-message', async (req, res) => {
  const { message,DriverNumber } = req.body;
  const targetContact = `91${DriverNumber}@c.us`; // Replace with the recipient's phone number

  if (isWhatsAppReady) {
    try {
    //   const chat = await client.getChatById(targetContact);
      await client.sendMessage(targetContact,message);
      res.send('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).send('Error sending message.');
    }
  } else {
    res.status(400).send('WhatsApp is not yet ready.');
  }
});

client.on('ready', () => {
  console.log('WhatsApp Client is ready!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
