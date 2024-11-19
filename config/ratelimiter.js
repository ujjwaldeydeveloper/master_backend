import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    standarHeader: false,
    message: "You have exceeded the 10 requests in 1 Minute limit!",
    headers: true,
});