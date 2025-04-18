const fs = require('fs').promises;

const filename = './db.json';
let data = [];

module.exports = {
    async init() {
        try {
            const fileContents = await fs.readFile(filename, 'utf-8');
            data = JSON.parse(fileContents);
        } catch (e) {
            data = [];
        }
    },
    getItems() {
        return data;
    },
    async addItem(item) {
        data.push(item);
        await this.save();
    },
    async save() {
        await fs.writeFile(filename, JSON.stringify(data, null, 2));
    },
    async deleteItem(id) {
        const index = data.findIndex(item => item.id === id)
        if (index === -1) {
            return false
        }
        data.splice(index, 1);
        await this.save();
        return true;
    }
};
