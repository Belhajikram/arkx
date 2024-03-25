
const logger = (req, res) => {
    const { method, url } = req;
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${method} ${url}`);
};
