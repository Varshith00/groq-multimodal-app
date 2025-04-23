import axios from 'axios';

const API = axios.create({
  baseURL: 'hackathon-backend-production-124c.up.railway.app', // Replace this with your backend URL
});

// Example function to POST text
export const generateFromText = async (text) => {
  const response = await API.post('/generate', { type: 'text', text });
  return response.data;
};

// Example function to POST image
export const generateFromImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const response = await API.post('/generate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Example function to POST audio
export const generateFromAudio = async (audioFile) => {
  const formData = new FormData();
  formData.append('file', audioFile);

  const response = await API.post('/generate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
