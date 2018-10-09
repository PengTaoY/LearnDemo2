using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using System.Threading;

namespace Rabbit
{
    class Program
    {
        static void Main(string[] args)
        {
            //Producer();
            //Consumer();
        }

        /// <summary>
        /// 定义生产者
        /// </summary>
        public static void Producer()
        {
            //创建连接工厂
            ConnectionFactory factory = new ConnectionFactory
            {
                UserName = "rabbit",//用户名
                Password = "123456",//密码
                HostName = "192.168.1.137"//rabbitmq ip
            };
            //创建连接
            var connection = factory.CreateConnection();
            //创建通道
            var channel = connection.CreateModel();//声明一个队列channel.QueueDeclare("hello", false, false, false, null);

            Console.WriteLine("\nRabbitMQ连接成功，请输入消息，输入exit退出！");
            string input;
            do
            {
                input = Console.ReadLine();
                var sendBytes = Encoding.UTF8.GetBytes(input);
                //发布消息
                channel.BasicPublish("", "hello", null, sendBytes);

            } while (input.Trim().ToLower() != "exit");
            channel.Close();
            connection.Close();
        }

        /// <summary>
        /// 定义消费者
        /// </summary>
        public static void Consumer()
        {
            //创建连接工厂
            ConnectionFactory factory = new ConnectionFactory
            {
                UserName = "rabbit",//用户名
                Password = "123456",//密码
                HostName = "192.168.1.137"//rabbitmq ip
            };
            //创建连接
            var connection = factory.CreateConnection();
            //创建通道
            var channel = connection.CreateModel();
            //事件基本消费者
            EventingBasicConsumer consumer = new EventingBasicConsumer(channel);
            //接收到消息事件
            consumer.Received += (ch, ea) =>
            {
                var message = Encoding.UTF8.GetString(ea.Body);
                Console.WriteLine($"收到消息： {message}");
                Console.WriteLine($"收到该消息[{ea.DeliveryTag}] 延迟10s发送回执");
                Thread.Sleep(10000);    //确认该消息已被消费
                channel.BasicAck(ea.DeliveryTag, false);
                Console.WriteLine($"已发送回执[{ea.DeliveryTag}]");
            };            //启动消费者 设置为手动应答消息
            channel.BasicConsume("hello", false, consumer);
            Console.WriteLine("消费者已启动");
            Console.ReadKey();
            channel.Dispose();
            connection.Close();

        }
    }
}
