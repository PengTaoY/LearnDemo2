using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI1.Help;
using Microsoft.AspNetCore.Hosting;

namespace WebAPI1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadTestController : ControllerBase
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public FileUploadTestController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// 上传文件,并返回上传后的文件在服务器中的路径
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public async Task<IActionResult> Post([FromFile]UserFile file)
        {
            string webRootPath = _hostingEnvironment.WebRootPath;
            string contentRootPath = _hostingEnvironment.ContentRootPath;

            if (file == null || !file.IsValid)
                return new JsonResult(new { code = 500, message = "不允许上传的文件类型" });
            string newFile = string.Empty;
            if (file != null)
                newFile = await file.SaveAs(_hostingEnvironment.WebRootPath,"/images");

            return new JsonResult(new { code = 0, message = "成功", url = newFile });
        }
    }
}