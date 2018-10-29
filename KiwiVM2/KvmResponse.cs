using System;
using System.Collections.Generic;

namespace KiwiVM2
{
    public class KvmResponse
    {
        //"vm_type":"kvm",  
        public string vm_type { get; set; }
        //"hostname":"localhost.localdomain",
        public string hostname { get; set; }
        //"node_ip":"104.36.185.124",
        public string node_ip { get; set; }
        //"node_alias":"v7524",
        public string node_alias { get; set; }
        //"node_location":"US, California",
        public string node_location { get; set; }
        //"node_location_id":"USCA_2",
        public string node_location_id { get; set; }
        //"node_datacenter":"US: Los Angeles, California (DC2 QNET)",
        public string node_datacenter { get; set; }
        //"location_ipv6_ready":false,
        public bool location_ipv6_ready { get; set; }
        //"plan":"kvmv2-10g",
        public string plan { get; set; }
        //"plan_monthly_data":590558003200,
        public double plan_monthly_data { get; set; }
        //"monthly_data_multiplier":1,
        public int monthly_data_multiplier { get; set; }
        //"plan_disk":11811160064,
        public double plan_disk { get; set; }
        //"plan_ram":536870912,
        public double plan_ram { get; set; }
        //"plan_swap":0,
        public double plan_swap { get; set; }
        //"plan_max_ipv6s":0,
        public double plan_max_ipv6s { get; set; }
        //"os":"centos-6-x86-bbr",
        public string os { get; set; }
        //"email":"810618778@qq.com",
        public string email { get; set; }
        //"data_counter":11851835026,
        public double data_counter { get; set; }
        //"data_next_reset":1542632613,
        public double data_next_reset { get; set; }
        //"ip_addresses":["74.82.194.253"],
        public IEnumerable<string> ip_addresses { get; set; }
        //"rdns_api_available":true,
        public bool rdns_api_available { get; set; }
        //"ptr":{"74.82.194.253":null},

        //"suspended":false,
        public bool suspended { get; set; }
        //"error":0

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
