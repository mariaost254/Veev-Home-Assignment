const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../databases/users.json');

const getAllUsers = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Error reading users file: ${error.message}`);
    }
};

const getById = async (email) => {
    try {
        const users = await getAllUsers();
        return users.find(user => user.email === email);
    } catch (error) {
        throw new Error(`Error getting user by ID: ${error.message}`);
    }
};
module.exports = {
  getById
};