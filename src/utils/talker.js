// const fs = require('fs/promises');
// const { join } = require('path');
const { readTalkerFile } = require('./fsUtils');

// const PATH = join(__dirname, '../talker.json');

const validateLogin = async (req, res, next) => {
  const { email, password } = await req.body;
  // const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const regexEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });

  if (!regexEmail.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }

  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  next();
};

const validateName = async (req, res, next) => {
  const { name } = await req.body;

  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;

  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (Number.isNaN(age) || age < 18 || !Number.isInteger(age)) {
    return res.status(400).json({
      message: 'O campo "age" deve ser um número inteiro igual ou maior que 18',
    });
  }

  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  const isFormatDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

  if (!talk) return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  if (!talk.watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!isFormatDate.test(talk.watchedAt)) {
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }

  next();
};

const validateRate = (req, res, next) => {
  const { talk } = req.body;
  if (talk.rate === 0) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  if (!talk.rate) return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  next();
};

const validateRateNumber = (req, res, next) => {
  const { talk } = req.body;
  if (talk.rate < 1 || talk.rate > 5 || !Number.isInteger(talk.rate) || talk.rate === 0) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  next();
};

const validateTalker = async (req, res, next) => {
  const { id } = req.params;
  const talkers = await readTalkerFile();
  const talkerToUpdate = talkers.find((talker) => +id === talker.id);
  if (!talkerToUpdate) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  next();
};

const updateTalkers = async (id, update) => {
  const talkers = await readTalkerFile();

  const talkerToUpdate = talkers.find((talker) => +id === talker.id);

  if (talkerToUpdate) {
    const newTalkers = talkers.map((talker) => {
      if (talker.id === +id) return { ...talker, ...update };
      return talker;
    });
    console.log(newTalkers);
    return newTalkers;
  }
};

module.exports = {
  validateLogin,
  validateName,
  validateAge,
  validateTalk,
  validateRate,
  validateRateNumber,
  updateTalkers,
  validateTalker,
};