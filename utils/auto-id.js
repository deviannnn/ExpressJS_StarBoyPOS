const generateId = (prefix) => {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}${timestamp}${randomNum}`;
};

module.exports = { generateId };