const generateId = (prefix) => {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${timestamp}-${randomNum}`;
};

module.exports = { generateId };