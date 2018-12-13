using iText.Html2pdf;
using iText.Kernel.Pdf;
using System;
using System.IO;

namespace HtmlConvertPdf
{
    class Program
    {
        static void Main(string[] args)
        {
            string html = acceptmultiLine();
            byte[] bytes;
            var directory = @"C:\Users\Administrator\Source\Repos\LearnDemo2\HtmlConvertPdf";
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var filePath = $"{directory}\\sample-{Guid.NewGuid().ToString()}.pdf";
            var write = new PdfWriter(filePath);

            HtmlConverter.ConvertToPdf(html, write);
            //using (var stream = File.OpenRead(filePath))
            //{
            //    MemoryStream result = new MemoryStream();
            //    stream.CopyTo(result);
            //    bytes = result.ToArray();
            //}

            //FileStream fs = new FileStream(filePath, FileMode.OpenOrCreate);
            //BinaryWriter bw = new BinaryWriter(fs);
            //bw.Write(bytes, 0, bytes.Length);
            //bw.Close();
            //fs.Close();



            Console.WriteLine("Hello World!");
        }

        static string acceptmultiLine()
        {
            ConsoleKeyInfo cki;
         //   Console.TreatControlCAsInput = true;//防止Ctrl+C复制
            Console.WriteLine("Press the CTRL+Enter key to quit: \n");
            string result = string.Empty;
            do
            {
                cki = Console.ReadKey();
                if (cki.Key == ConsoleKey.Enter)
                {
                    result += System.Environment.NewLine;//如果输入回车，则加入换行标志
                    Console.SetCursorPosition(0, Console.CursorTop + 1);//光标下移一行
                }
                result += cki.KeyChar;
            } while (cki.Key != ConsoleKey.Enter || (cki.Modifiers & ConsoleModifiers.Control) == 0);//按Ctrl+Enter退出
            return result;
        }
    }
}
