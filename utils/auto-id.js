const generateId = (prefix) => {
    const timestamp = Date.now().toString();
    const randomNumbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${timestamp}-${randomNumbers}`;
};

module.exports = generateId;