const fs = require('fs/promises');
const express = require('express');
const { join } = require('path');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

// Meu código a partir daqui

const PATH = join(__dirname, '/talker.json');

app.get('/talker', async (req, res) => {
  try {
    const content = await fs.readFile(PATH);
    res.status(200).json(JSON.parse(content));
  } catch (e) {
    res.status(200).json([]);
  }
});