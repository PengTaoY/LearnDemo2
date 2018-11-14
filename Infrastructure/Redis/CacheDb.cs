namespace Infrastructure.Redis
{
    public class CacheDb : RedisHelper
    {
        public CacheDb(RedisConnConfig config)
        {
            string str = $"{config.conn}:{config.port},password={config.password},defaultDatabase={config.database},poolsize={config.poolsize},ssl={config.isSSL},writeBuffer={config.writeBuffer},prefix={config.prefix}";

            var csredis = new CSRedis.CSRedisClient(str);
            Initialization(csredis);
        }

    }
}
