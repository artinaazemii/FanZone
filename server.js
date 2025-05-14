// server.js  ― run with:  node server.js
const express       = require('express');
const cors          = require('cors');
const { StreamChat } = require('stream-chat');

const app = express();
app.use(cors());
app.use(express.json());

// ← replace with the values from Chat → Overview → “App Access Keys”
const API_KEY    = 'a4z5xvayerar';
const API_SECRET = 'eaf5e2gdjzyusmwndbgwhqbmju36b497rrnmw54z5a8gfhmshkcezmt3enmvx28t';

const serverClient = StreamChat.getInstance(API_KEY, API_SECRET);

// optional health‑check so GET / shows something
app.get('/', (_, res) => res.send('🔑 Stream token server is running'));

app.post('/stream-token', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const token = serverClient.createToken(userId);
  res.json({ token });
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🔑 Stream token server up at http://localhost:${PORT}`)
);
