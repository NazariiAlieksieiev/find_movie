const openAI = require('openai')
const express = require('express');
const router = express.Router();
const needle = require('needle');

const API_KEY = process.env.REACT_APP_API_KEY;
const URL = process.env.REACT_APP_URL;

router.get('/', async (req, res) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    };
    
    const data = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Як справи?` }
      ]
    };
    
    const respApi = await needle('post', 'https://api.openai.com/v1/chat/completions', data, { headers });
    const message = respApi.body.choices[0].message

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({error})
  }
})


module.exports = router
