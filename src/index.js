// const fs = require('fs/promises');
const crypto = require('crypto');
const express = require('express');
const { join } = require('path');
const {
  validateLogin,
  validateName,
  validateAge,
  validateTalk,
  updateTalkers,
} = require('./utils/talker');
const { readTalkerFile, writeTalkerFile } = require('./utils/fsUtils');
const { findNextId } = require('./utils/findNextId');
const auth = require('./utils/auth');

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

const PATH = join(__dirname, './talker.json');

app.get('/talker', async (req, res) => {
  try {
    const content = await readTalkerFile();
    res.status(200).json(content);
  } catch (e) {
    res.status(200).json([]);
  }
});

// POST

app.post('/talker', auth, validateName, validateAge, validateTalk, async (req, res) => {
  const talkers = await readTalkerFile();
  console.log(talkers);

  const talkerContent = req.body;
  const nextId = findNextId(talkers);
  console.log(`nextId: ${nextId}`);
  const newTalker = { id: nextId, ...talkerContent };
  const newContent = [...talkers, newTalker];
  console.log(newTalker);

  await writeTalkerFile(PATH, newContent);

  res.status(201).json(newTalker);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const content = await readTalkerFile();
  const talkers = JSON.parse(content);
  const findTalker = talkers.find((talker) => talker.id === Number(id));

  if (!findTalker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(findTalker);
});

// PUT

app.put('/talker/:id', auth, validateName, validateAge, validateTalk, async (req, res) => {
  const { id } = req.params;
  const content = req.body;

  await updateTalkers(id, content);

  // res.status(200).json({ MESSAGE: 'created' });
  res.status(200).json(content);
});

// DELETE

app.delete('/talker/:id', auth, async (req, res) => {
  const { id } = req.params;
  const content = await readTalkerFile();
  const newContent = content.filter((talker) => talker.id !== Number(id));

  await writeTalkerFile(PATH, newContent);

  res.status(204).json();
});

app.post('/login', validateLogin, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');

  res.status(200).json({ token });
});