// streamClient.js
import { StreamChat } from 'stream-chat';

// ← from Chat Overview → App Access Keys
const API_KEY = 'a4z5xvayerar';

export const chatClient = StreamChat.getInstance(API_KEY);
