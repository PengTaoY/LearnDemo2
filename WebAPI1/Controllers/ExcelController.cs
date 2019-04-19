using Microsoft.AspNetCore.Mvc;
using WebAPI1.Help;

namespace WebAPI1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExcelController : ControllerBase
    {
        /// <summary>
        /// Excel导入功能
        /// </summary>
        /// <returns></returns>
        [HttpPost("ImportExcel")]
        public Json<string> ImportExcel([FromFile]UserFile file)
        {
            




            string msg = "返回内容";
            string result = "返回结果";
            return ReturnJson.Result(true, file.FileName, file.Extension);
        }



    }
}