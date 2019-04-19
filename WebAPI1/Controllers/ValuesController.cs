using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace WebAPI1.Controllers
{
    [Route("api/Values")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        // GET api/values
        /// <summary>
        /// 默认的
        /// </summary>
        /// <returns></returns>
        [HttpGet("default")]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

        /// <summary>
        /// get方法
        /// </summary>
        /// <returns></returns>
        /// 
        [ApiExplorerSettings(GroupName ="v2")]
        [HttpGet("getTest")]
        public Test getTest()
        {

            return new Test { };
        }

        /// <summary>
        /// Post方法
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        public Test Post(Test value)
        {
            return value;
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }

    /// <summary>
    /// 测试类
    /// </summary>
    public class Test
    {
        /// <summary>
        /// Id
        /// </summary>
        public int id => 0;
        /// <summary>
        /// 名字
        /// </summary>
        public string name => "张三";
    }
}
