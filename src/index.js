const fs = require('fs/promises');
const crypto = require('crypto');
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

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const content = await fs.readFile(PATH);
  const talkers = JSON.parse(content);
  const findTalker = talkers.find((talker) => talker.id === Number(id));

  if (!findTalker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(findTalker);
});

app.post('/login', async (req, res) => {
  // const { email, password } = req.params;
  // const entryValues = [email, password];

  // if (entryValues.includes(undefined)) return;

  const token = crypto.randomBytes(8).toString('hex');

  res.status(200).json({ token });
});