const jwt = require('jsonwebtoken');
const { catchAsync } = require('@helpers');
const { userService } = require('@services');

const authenticateToken = catchAsync(async (req, res, next) => {
    const token = req.cookies.jwt;
    // const authHeader = req.headers.authorization;
    // const token = authHeader && authHeader.split(' ')[1];
    // if (token == null) return res.sendStatus(401);
    if (token == null) {
        delete req.app.locals.user;
        return next();
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, userId) => {
        // console.log(err);
        if (err) return next();
        const user = await userService.getOneById(userId.id);
        req.app.locals = { user };
        next();
    });
});

module.exports = authenticateToken;
