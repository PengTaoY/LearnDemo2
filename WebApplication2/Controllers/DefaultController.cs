using Microsoft.AspNetCore.Mvc;
using System;

namespace WebApplication2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DefaultController : Controller
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new Person());
        }

        [HttpGet("first/{id}")]
        public IActionResult FindPerson(int id,string name)
        {
            return null;
        }

        //使用 ~ 这个符号的话，该Action的地址将会是绝对路由地址，也就是覆盖了Controller定义的基路由。
        [HttpPost("~/api/People")]
        public IActionResult Post(Person person)
        {
            return Ok();
        }

        [HttpDelete]
        public IActionResult Remove(int id)
        {
            return Ok();
        }

        //通过标注[NonAction] 属性来表示这个方法不是Action。
        [NonAction]
        public IActionResult GetTime()
        {
            return Ok(DateTime.Now);
        }

    }
}