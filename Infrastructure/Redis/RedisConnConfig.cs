namespace Infrastructure.Redis
{
    /// <summary>
    /// Redis链接配置对象
    /// </summary>
    public class RedisConnConfig
    {
        /// <summary>
        /// IP地址
        /// </summary>
        public string conn { get; set; }
        /// <summary>
        /// 端口号
        /// </summary>
        public int port { get; set; }
        /// <summary>
        /// 密码
        /// </summary>
        public string password { get; set; }

        /// <summary>
        /// 数据库
        /// </summary>
        public int database { get; set; } = 0;
        /// <summary>
        /// 连接池大小
        /// </summary>
        public int poolsize { get; set; }

        public string isSSL { get; set; } = "false";

        public int writeBuffer { get; set; } = 10240;

        /// <summary>
        /// 前缀
        /// </summary>
        public string prefix { get; set; }
    }
}
