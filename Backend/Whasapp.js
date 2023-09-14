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
    // Generate and display the QR code in the terminal
    client.on('qr', (qr) => {
      console.log(qr);
      qrcode.generate(qr, { small: true });
    });

    // Listen for the 'authenticated' event to know when WhatsApp is ready
    client.on('authenticated', (session) => {
      console.log('WhatsApp authenticated');
      isWhatsAppReady = true;
    });

    // Initialize the WhatsApp client
    client.initialize();
    
    res.send(`
      <p>Scan the QR code with WhatsApp to continue.</p>
    `);
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
