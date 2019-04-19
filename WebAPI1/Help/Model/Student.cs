using System;
using System.ComponentModel;

namespace WebAPI1.Help.Model
{
    /// <summary>
    /// 学生类
    /// </summary>
    public class Student
    {
        /// <summary>
        /// 学号
        /// </summary>
        [Description("学号")]
        public int ID { get; set; }
        /// <summary>
        /// 姓名
        /// </summary>
        [Description("姓名")]
        public string Name { get; set; }
        /// <summary>
        /// 性别
        /// </summary>
        [Description("性别")]
        public string Sex { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        [Description("创建时间")]
        public DateTime CreateDate { get; set; }
    }
}
