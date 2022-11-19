import AllRoutes from "../../api";

module.exports = (app) => {
    AllRoutes.forEach(eachRoute => {
        app.use('/api/v1/', eachRoute);
    });
};