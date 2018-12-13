using HiQPdf;
using System;
using System.IO;

namespace Html2Pdf
{
    class Program
    {
        static void Main(string[] args)
        {
            // create the HTML to PDF converter
            HtmlToPdf htmlToPdfConverter = new HtmlToPdf();

            // set PDF page size and orientation
            htmlToPdfConverter.Document.PageSize = PdfPageSize.A4;
            htmlToPdfConverter.Document.PageOrientation = PdfPageOrientation.Portrait;

            // set PDF page margins
            htmlToPdfConverter.Document.Margins = new PdfMargins(0);

            // convert HTML to PDF
            byte[] pdfBuffer = null;

            Console.Write("请输入网址:");
            // convert URL to a PDF memory buffer
            string url = Console.ReadLine();

            pdfBuffer = htmlToPdfConverter.ConvertUrlToMemory(url);


            var directory = @"C:\Users\Administrator\Source\Repos\LearnDemo2\HtmlConvertPdf";
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var filePath = $"{directory}\\sample-{Guid.NewGuid().ToString()}.pdf";
            FileStream fs = new FileStream(filePath, FileMode.OpenOrCreate);
            BinaryWriter bw = new BinaryWriter(fs);
            bw.Write(pdfBuffer, 0, pdfBuffer.Length);
            bw.Close();
            fs.Close();








            Console.WriteLine("Hello World!");
        }
    }
}
