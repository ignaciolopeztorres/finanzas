//const responseHelpers = require('../lib/helpers');

const userErrorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
}

const requestUser = (req, res, next) => {
    // Middleware logic here
    console.log("User middleware");
    return (req, res, next) => {
        req.user = { idUser: "<user_id>", name: "<user_name>" }; // Example user assignment
        next();
    };
};

export {
    userErrorHandler,
    requestUser,
};