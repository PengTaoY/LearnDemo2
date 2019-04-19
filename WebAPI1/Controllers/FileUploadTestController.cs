using LearnDemo.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebAPI1.Help;
using WebAPI1.Help.Model;

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
        [HttpPost("AsyncPost")]
        public async Task<IActionResult> Post([FromFile]UserFile file)
        {
            string webRootPath = _hostingEnvironment.WebRootPath;
            string contentRootPath = _hostingEnvironment.ContentRootPath;

            if (file == null || !file.IsValid)
                return new JsonResult(new { code = 500, message = "不允许上传的文件类型" });
            string newFile = string.Empty;
            if (file != null)
                newFile = await file.SaveAs(_hostingEnvironment.WebRootPath, "/images");

            return new JsonResult(new { code = 0, message = "成功", url = newFile });
        }

        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="file"></param>
        [HttpPost("PostFile")]
        public void PostFile(IFormFile file)
        {
            //TODO:Save file...
            Console.WriteLine("加一个断点");

        }

        /// <summary>
        /// 生成Excel下载
        /// </summary>
        /// <returns></returns>
        [HttpPost("FileDownload")]
        public Json<ExportToExcelResponse> FileDownload()
        {
            List<Student> students = new List<Student>
            {
                new Student{ID=1,Name="张三",Sex="男",CreateDate = DateTime.Now},
                new Student{ID=2,Name="李四",Sex="女",CreateDate = DateTime.Now},
                new Student{ID=3,Name="王五",Sex="男",CreateDate = DateTime.Now},
            };


            var result = NPOIHelper.ExportToExcel(students, _hostingEnvironment.WebRootPath, "123.xlsx", "sheet1", "表头名称", "筛选时间：2019.1.1 - 2019.2.2");

            return ReturnJson.Result(true, result, "", "");
        }

    }
}