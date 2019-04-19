using System;
using System.Collections.Generic;

namespace WebAPI1.Help
{
    /// <summary>
    /// 接口用户返回集合列表形式的数据
    /// 请勿直接使用此类型，请直接在ReturnJson.PagerResult中调用
    /// </summary>
    public class JqGridJson<T> where T : class
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public JqGridJson()
        {
            code = "200";
            success = true;
            pageNum = 1;
            pageSize = 10;
        }

        /// <summary>
        /// 错误码 200 位请求成功
        /// </summary>
        public string code { get; set; }

        /// <summary>
        /// 是否成功
        /// </summary>
        public bool success { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public IEnumerable<T> data { get; set; }
        /// <summary>
        /// 计算出页面数量
        /// </summary>
        public int pageTotal
        {
            get
            {
                int value = (int)Math.Ceiling((double)totalSize / (double)pageSize);
                return value >= 0 ? value : 0;
            }
        }

        /// <summary>
        /// 如果发生错误，错误消息是多少
        /// </summary>
        public string msg { get; set; }
        /// <summary>
        /// 总条数
        /// </summary>
        public int totalSize { set; get; }
        /// <summary>
        /// 每一页的条数
        /// </summary>
        public int pageSize { set; get; }
        /// <summary>
        /// 当前页码
        /// </summary>
        public int pageNum { set; get; }

    }

    /// <summary>
    /// 规范化接口返回值
    /// 请勿直接使用此类型，请在ReturnJson.Result中进行调用
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Json<T>
    {

        /// <summary>
        /// 构造
        /// </summary>
        public Json()
        {
            this.code = "200";
            success = true;
        }

        /// <summary>
        /// 错误码 200为正确返回
        /// </summary>
        public string code { get; set; }

        /// <summary>
        /// 是否成功
        /// </summary>
        public bool success { get; set; }
        /// <summary>
        /// 接口返回的消息
        /// </summary>
        public string msg { get; set; }
        /// <summary>
        /// 泛型返回结果
        /// </summary>
        public T data { get; set; }

    }

    /// <summary>
    /// 返回数据格式化类
    /// </summary>
    public class ReturnJson
    {
        /// <summary>
        /// 单个实体Json返回实体格式
        /// 或者不分页集合
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="success"></param>
        /// <param name="data"></param>
        /// <param name="msg"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        public static Json<T> Result<T>(bool success, T data, string msg = "", string code = "200")
        {

            return new Json<T>()
            {
                success = success,
                data = data,
                msg = msg,
                code = success ? code : "500"
            };
        }


        /// <summary>
        /// 接口返回集合Json字符串
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="success"></param>
        /// <param name="pageNum"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalSize"></param>
        /// <param name="data"></param>
        /// <param name="msg"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        public static JqGridJson<T> PagerResult<T>(bool success, int pageNum, int pageSize, int totalSize, IEnumerable<T> data, string msg = "", string code = "200") where T : class
        {
            return new JqGridJson<T>()
            {
                success = success,
                pageNum = pageNum,
                totalSize = totalSize,
                data = data,
                msg = msg,
                code = success ? code : "500",


            };
        }


    }
}
