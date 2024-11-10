import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader == null || authHeader == undefined) {
        return res.status(401).json({statusCode: 401, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    console.log(token);
    // * Verfied token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log(err);
        if(err) {
            return res.status(403).json({statusCode: 403, message: "Forbidden" });
        }

        req.user = user;
        next();
    });   
};

export default authMiddleware;