using CSRedis;
using Infrastructure.Redis;
using System;
using System.Diagnostics;

namespace CSRedisCoreDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            RedisConnConfig config = new RedisConnConfig
            {
                conn = "192.168.1.1",
                port = 6379,
                password = "12345678",
                database = 13,
                poolsize = 50,
                prefix = "key_"
            };
            string guid = Guid.NewGuid().ToString("N");
            CacheDb cacheDb = new CacheDb(config);
            Stopwatch sw = new Stopwatch();
            sw.Start();
            for (int i = 0; i < 10; i++)
            {
                CacheDb.Set("Method1_" + i, i);
                Console.WriteLine(CacheDb.RandomKey()); ;
            }
            sw.Stop();
            TimeSpan ts1 = sw.Elapsed;
            Console.WriteLine($"方法1总耗时{ts1.TotalMilliseconds}ms");

            Stopwatch sw2 = new Stopwatch();
            RedisHelper.Initialization(new CSRedis.CSRedisClient("192.168.1.1:6379,password=12345678,defaultDatabase=13,poolsize=50,ssl=false,writeBuffer=10240,prefix=key"));
            sw2.Start();

            for (int i = 0; i < 10; i++)
            {
                RedisHelper.Set("Method2_" + i, i);
                Console.WriteLine(RedisHelper.RandomKey());
            }
            sw2.Stop();
            TimeSpan ts2 = sw2.Elapsed;
            Console.WriteLine($"方法2总耗时{ts2.TotalMilliseconds}ms");


            //切换数据库
            var connectionString = "192.168.1.1:6379,password=12345678,poolsize=10,ssl=false,writeBuffer=10240,prefix=key前辍";
            var redis = new CSRedisClient[4]; //定义成单例
            for (int a = 0; a < 4; a++)
            {
                redis[a] = new CSRedisClient(connectionString + ",defaultDatabase=" + a);
            }

            for (int i = 0; i < 2; i++)
            {
                redis[(int)Enum.Ali].Set("12" + Guid.NewGuid().ToString(), "12");
                redis[(int)Enum.BaiDu].Set("13" + Guid.NewGuid().ToString(), "13");
                redis[(int)Enum.QQ].Set("14" + Guid.NewGuid().ToString(), "14");
                redis[(int)Enum.Wechat].Set("15" + Guid.NewGuid().ToString(), "15");
            }

            for (int i = 0; i < 10; i++)
            {
                for (int j = 0; j < 4; j++)
                {
                    Console.WriteLine($"Redis{j}里面的一个随机值：" + redis[j].RandomKey());
                }
            }



            Console.WriteLine("Hello World!");
        }
    }

    enum Enum
    {
        Ali = 0,
        BaiDu = 1,
        QQ = 2,
        Wechat = 3
    }
}
