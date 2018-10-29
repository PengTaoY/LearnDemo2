using Microsoft.AspNetCore.Mvc;

namespace WebApplication2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {

        public string IsLogIn(string username, string pwd)
        {
            if (username == "123" && pwd == "123")
            {
                return "登录成功";
            }
            return "登录失败";
        }

    }
}