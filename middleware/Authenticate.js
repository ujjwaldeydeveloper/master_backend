import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader === null || authHeader === undefined) {
        return res.status(401).json({statusCode: 401, message: "Unauthorized" });
    }

    console.log("The token is", authHeader);

    const token = authHeader.split(" ")[1];
    // * Verfied token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            console.log('verfiy token error' + user);
            return res.status(403).json({statusCode: 403, message: "Forbidden" });
        }

        req.user = user;
        next();
    });   
};

export default authMiddleware;