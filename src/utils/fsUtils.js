const fs = require('fs/promises');
const { join } = require('path');

const PATH = join(__dirname, '../talker.json')

const readTalkerFile = async () => {
    try {
        const content = await fs.readFile(PATH);
        return JSON.parse(content);
    } catch (e) {
        return null;
    }
}

// const writeTalkerFile = async (path, newContent) => {
//     await fs.writeFile(path, JSON.stringify(newContent))
// };


const writeTalkerFile = async (path, newContent) => {
    await fs.writeFile(path, JSON.stringify(newContent));
};

module.exports = { readTalkerFile, writeTalkerFile }