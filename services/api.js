import axios from 'axios';

const API_KEY = 'YOUR_API_KEY'; // Replace with your actual key
const BASE_URL = '833e9df22ebde8b6f2037fbcf67055fd';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-apisports-key': API_KEY,
  },
});

export const getFixturesByDate = async (date) => {
  try {
    const response = await api.get('/fixtures', {
      params: {
        date, // format: '2023-04-10'
      },
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return [];
  }
};
