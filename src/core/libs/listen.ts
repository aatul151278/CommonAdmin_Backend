module.exports = (app) => {
    const port = process.env.port || 3000;
    app.listen(port, () => {
        return console.log(`Server is listening at http://localhost:${port}`);
    });
};