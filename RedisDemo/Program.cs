using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace RedisDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json");
            IConfigurationRoot configuration = builder.Build();

            var redisClient = RedisClientSingleton.GetInstance(configuration);

            var redisDatabase = redisClient.GetDatabase("Redis_6");

            redisDatabase.StringSet("TestStrKey", "TestStrValue");


            string s = redisDatabase.StringGet("TestStrKey").ToString();

         //   redisDatabase.

            Console.WriteLine();
        }
    }
}
