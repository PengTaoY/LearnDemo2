using System;
using System.Collections.Generic;

namespace KiwiVM2
{
    public class KvmResponse
    {
        public string vm_type { get; set; }

        public string hostname { get; set; }

        public string node_ip { get; set; }

        public string node_alias { get; set; }

        public string node_location { get; set; }

        public string node_location_id { get; set; }

        public string node_datacenter { get; set; }

        public bool location_ipv6_ready { get; set; }

        public string plan { get; set; }

        public double plan_monthly_data { get; set; }

        public int monthly_data_multiplier { get; set; }

        public double plan_disk { get; set; }

        public double plan_ram { get; set; }

        public double plan_swap { get; set; }

        public double plan_max_ipv6s { get; set; }

        public string os { get; set; }

        public string email { get; set; }

        public double data_counter { get; set; }

        public double data_next_reset { get; set; }

        public IEnumerable<string> ip_addresses { get; set; }

        public bool rdns_api_available { get; set; }

        public bool suspended { get; set; }

        public int error { get; set; }

        /// <summary>
        /// 错误提示
        /// </summary>
        public string message { get; set; }

        /// <summary>
        /// 将Unix时间戳转换为DateTime类型时间
        /// </summary>
        /// <param name="d"></param>
        /// <returns></returns>
        public DateTime ConvertToDateTime(double d)
        {
            DateTime time = DateTime.MinValue;
            DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1));

            time = startTime.AddSeconds(d);
            return time;
        }

        /// <summary>
        /// 将Bit装换成MB
        /// </summary>
        /// <param name="b"></param>
        /// <returns></returns>
        public double BitToMB(double b)
        {
            for (int i = 0; i < 2; i++)
            {
                b /= 1024;
            }
            return b;
        }

        /// <summary>
        /// 将Bit装换成GB
        /// </summary>
        /// <param name="b"></param>
        /// <returns></returns>
        public double BitToGB(double b)
        {
            for (int i = 0; i < 3; i++)
            {
                b /= 1024;
            }

            if (b.ToString().Length > 4)
            {
                b = Math.Round(b, 2);
            }

            return b;
        }

        /// <summary>
        /// 替换字符串中的横线
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public string ReplaceLine(string str)
        {
            return str.Replace('-', ' ');
        }
    }
}
