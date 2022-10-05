/**
 * Created by 张辉 2021/03/11 11:10:09
 * redis缓存
 */

const blogConfig = require("../../config/databases");
const redisConfig = blogConfig.redis;
const redis_ = require("redis");

const redis_client = redis_.createClient({
    host: redisConfig.RDS_HOST,
    port: redisConfig.RDS_PORT,
    ttl: 5 * 60 * 1000
});

redis_client.auth('6478**12', () => {
    log.info('auth succress');
});
redis_client.on("error", (err) => {
    log.info(err);
});
redis = {};
redis.set = (key, value) => {
    value = JSON.stringify(value);
    return redis_client.set(key, value, (err) => {
        if (err) log.error(err);
    });
};

redis.setString = (key, value) => {
    return redis_client.set(key, value, (err) => {
        if (err) log.error(err);
    });
};

redis.setExp = (key, value, exprires) => {
    value = JSON.stringify(value);
    redis_client.set(key, value);
    if (exprires) {
        redis_client.expire(key, exprires);
    }
};

text = async (key, isJson = true) => {
    doc = await new Promise((resolve) => {
        redis_client.get(key, (err, res) => {
            return resolve(res);
        });
    });
    if (isJson)
        doc = JSON.parse(doc);
    return doc;
}

textHash = async (key) => {
    doc = await new Promise((resolve) => {
        redis_client.hget(key, (err, res) => {
            return resolve(res);
        });
    });
    doc = JSON.parse(doc);
    return doc;
}


textHashAll = async (key) => {
    doc = await new Promise((resolve) => {
        redis_client.hgetall(key, (err, res) => {
            return resolve(res);
        });
    });
    //doc = JSON.parse(doc);
    return doc;
}

redis.get = async (key) => {
    const ret = await text(key);
    return ret;
}

redis.getString = async (key) => {
    const ret = await text(key, false);
    return ret;
}

redis.setHash = (key, value) => {
    value = JSON.stringify(value);
    return redis_client.hset(key, value, (err) => {
        if (err) log.error(err);
    });
};

redis.getHash = async (key) => {
    const ret = await textHash(key);
    return ret;
}

redis.getAllHash = async (key) => {
    const ret = await textHashAll(key);
    return ret;
}


module.exports = redis;