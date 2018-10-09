using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Text;

namespace Rabbit
{
   public class RabbitMQService
    {
        public IConnection GetRabbitMQConnection()
        {
            var connectionFactory = new ConnectionFactory
            {
                HostName = "192.168.1.137",
                UserName = "rabbit",
                Password = "123456"
            };
            return connectionFactory.CreateConnection();
        }
    }
}
