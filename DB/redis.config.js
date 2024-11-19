import redis from 'express-redis-cache';

const redisCache = redis({
    port: 6379,
    host:"localhost",
    expire: 60,
    prefix: "cache",
    onerror: function (err) {
        console.log(err);
    },  
});

export default redisCache;