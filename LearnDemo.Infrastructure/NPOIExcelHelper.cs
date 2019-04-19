using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using NPOI.XSSF.UserModel;
using System;
using System.Data;
using System.IO;

namespace LearnDemo.Infrastructure
{
    public class NPOIExcelHelper : IDisposable
    {

        private string fileName = null; //文件名
        private IWorkbook workbook = null;
        private FileStream fs = null;
        private bool disposed;

        /// <summary>
        /// NPOI操作Excel类
        /// </summary>
        /// <param name="fileName">文件名</param>
        public NPOIExcelHelper(string fileName)
        {
            this.fileName = fileName;
            disposed = false;
        }

        /// <summary>
        /// 写入DataTable的列名
        /// </summary>
        /// <param name="data">数据</param>
        /// <param name="sheetName"></param>
        /// <param name="isColumnWritten">是否写入列名称</param>
        /// <param name="headName">表头名称</param>
        /// <param name="now">导出时间(当前时间)</param>
        /// <param name="filter">筛选条件</param>
        /// <returns></returns>
        public int DataTableToExcel(DataTable data, string sheetName, bool isColumnWritten, string headName, DateTime now, string filter = "")
        {
            int i = 0;
            int j = 0;
            int count = 0;
            ISheet sheet = null;

            fs = new FileStream(fileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
            if (fileName.IndexOf(".xlsx") > 0) // 2007版本
                workbook = new XSSFWorkbook();
            else if (fileName.IndexOf(".xls") > 0) // 2003版本
                workbook = new HSSFWorkbook();

            try
            {
                if (workbook != null)
                {
                    sheet = workbook.CreateSheet(sheetName);
                }
                else
                {
                    return -1;
                }

                #region 写入表头跟创建时间
                //写入表头跟创建时间
                if (!String.IsNullOrEmpty(headName))
                {
                    IRow row = sheet.CreateRow(count++);
                    int colums = data.Columns.Count;
                    row.Height = 30 * 20;
                    sheet.AddMergedRegion(new CellRangeAddress(0, 0, 0, (colums - 1) > 0 ? (colums - 1) : colums));
                    row.CreateCell(0).SetCellValue(headName);

                    ICellStyle style = workbook.CreateCellStyle();
                    //设置单元格的样式：水平对齐居中
                    style.Alignment = HorizontalAlignment.Center;
                    //新建一个字体样式对象
                    IFont font = workbook.CreateFont();
                    //设置字体加粗样式
                    font.Boldweight = short.MaxValue;
                    font.FontHeightInPoints = 18;
                    //使用SetFont方法将字体样式添加到单元格样式中 
                    style.SetFont(font);
                    //将新的样式赋给单元格
                    row.Cells[0].CellStyle = style;

                    if (!string.IsNullOrEmpty(filter))
                    {
                        IRow rowFilter = sheet.CreateRow(count++);
                        rowFilter.CreateCell(0).SetCellValue($"筛选条件:{filter}");
                        sheet.AddMergedRegion(new CellRangeAddress(count - 1, count - 1, 0, (colums - 1) > 0 ? (colums - 1) : colums));
                    }



                    IRow rowTime = sheet.CreateRow(count++);
                    rowTime.CreateCell(0).SetCellValue($"导出时间:{now.ToString("yyyy-MM-dd HH:mm:ss")}");
                    sheet.AddMergedRegion(new CellRangeAddress(count - 1, count - 1, 0, (colums - 1) > 0 ? (colums - 1) : colums));
                }
                #endregion


                if (isColumnWritten == true) //写入DataTable的列名
                {
                    IRow row = sheet.CreateRow(count++);
                    ICellStyle style = workbook.CreateCellStyle();
                    //设置单元格的样式：水平对齐居中
                    style.Alignment = HorizontalAlignment.Center;
                    //新建一个字体样式对象
                    IFont font = workbook.CreateFont();
                    //设置字体加粗样式
                    font.Boldweight = short.MaxValue;
                    style.SetFont(font);
                    for (j = 0; j < data.Columns.Count; ++j)
                    {
                        row.CreateCell(j).SetCellValue(data.Columns[j].ColumnName);
                        row.Cells[j].CellStyle = style;
                    }
                }

                for (i = 0; i < data.Rows.Count; ++i)
                {
                    IRow row = sheet.CreateRow(count);
                    for (j = 0; j < data.Columns.Count; ++j)
                    {
                        if (double.TryParse(data.Rows[i][j].ToString(), out double nx))
                        {
                            row.CreateCell(j).SetCellValue(nx);
                        }
                        //else if (DateTime.TryParse(data.Rows[i][j].ToString(), out DateTime zz))
                        //{
                        //    row.CreateCell(j).SetCellValue(zz.ToString("yyyy-MM-dd"));
                        //}
                        else
                        {
                            row.CreateCell(j).SetCellValue(data.Rows[i][j].ToString());
                        }
                    }
                    ++count;
                }
                workbook.Write(fs); //写入到excel
                return count;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception: " + ex.Message);
                return -1;
            }
        }

        /// <summary>
        /// 将DataTable数据导入到excel中
        /// </summary>
        /// <param name="data">要导入的数据</param>
        /// <param name="sheetName">要导入的excel的sheet的名称</param>
        /// <param name="isColumnWritten">DataTable的列名是否要导入</param>
        /// <returns>导入数据行数(包含列名那一行)</returns>
        public int DataTableToExcel(DataTable data, string sheetName, bool isColumnWritten)
        {
            int i = 0;
            int j = 0;
            int count = 0;
            ISheet sheet = null;

            fs = new FileStream(fileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
            if (fileName.IndexOf(".xlsx") > 0) // 2007版本
                workbook = new XSSFWorkbook();
            else if (fileName.IndexOf(".xls") > 0) // 2003版本
                workbook = new HSSFWorkbook();

            try
            {
                if (workbook != null)
                {
                    sheet = workbook.CreateSheet(sheetName);
                }
                else
                {
                    return -1;
                }

                if (isColumnWritten == true) //写入DataTable的列名
                {
                    IRow row = sheet.CreateRow(0);
                    for (j = 0; j < data.Columns.Count; ++j)
                    {
                        row.CreateCell(j).SetCellValue(data.Columns[j].ColumnName);
                    }
                    count = 1;
                }
                else
                {
                    count = 0;
                }

                for (i = 0; i < data.Rows.Count; ++i)
                {
                    IRow row = sheet.CreateRow(count);
                    for (j = 0; j < data.Columns.Count; ++j)
                    {
                        row.CreateCell(j).SetCellValue(data.Rows[i][j].ToString());
                    }
                    ++count;
                }
                workbook.Write(fs); //写入到excel
                return count;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception: " + ex.Message);
                return -1;
            }
        }

        /// <summary>
        /// 将DataTable数据导入到excel中
        /// </summary>
        /// <param name="data">要导入的数据</param>
        /// <param name="sheetName">要导入的excel的sheet的名称</param>
        /// <param name="isColumnWritten">DataTable的列名是否要导入</param>
        /// <param name="imgBase64">图片</param>
        /// <param name="headName">表头名称</param>
        /// <param name="now">导出时间(当前时间)</param>
        /// <param name="filter">筛选条件</param>
        /// <returns></returns>
        public int DataTableToExcel(DataTable data, string sheetName, bool isColumnWritten, string imgBase64, string headName, DateTime now, string filter = "")
        {
            int i = 0;
            int j = 0;
            int count = 0;
            ISheet sheet = null;
            ISheet sheet0 = null;
            fs = new FileStream(fileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
            workbook = new HSSFWorkbook();

            try
            {
                #region sheet1添加图片
                if (!string.IsNullOrEmpty(imgBase64))
                {
                    try
                    {
                        byte[] bytes2 = Convert.FromBase64String(imgBase64.Replace("data:image/png;base64,", ""));

                        int pictureIdx = workbook.AddPicture(bytes2, PictureType.JPEG);

                        //create sheet
                        sheet0 = workbook.CreateSheet("统计图");

                        // Create the drawing patriarch.  This is the top level container for all shapes. 
                        var patriarch = sheet0.CreateDrawingPatriarch();

                        //add a picture
                        HSSFClientAnchor anchor = new HSSFClientAnchor(0, 0, 1023, 0, 0, 0, 1, 3);
                        var pict = patriarch.CreatePicture(anchor, pictureIdx);
                        pict.Resize();
                    }
                    catch (Exception)
                    {
                    }

                }
                #endregion

                //添加数据
                if (workbook != null)
                {
                    sheet = workbook.CreateSheet(sheetName);
                }
                else
                {
                    return -1;
                }

                #region 写入表头跟创建时间
                //写入表头跟创建时间
                if (!String.IsNullOrEmpty(headName))
                {
                    IRow row = sheet.CreateRow(count++);
                    int colums = data.Columns.Count;
                    //row.CreateCell(0).SetCellValue(headName);
                    row.Height = 30 * 20;
                    sheet.AddMergedRegion(new CellRangeAddress(0, 0, 0, (colums - 1) > 0 ? (colums - 1) : colums));
                    row.CreateCell(0).SetCellValue(headName);

                    ICellStyle style = workbook.CreateCellStyle();
                    //设置单元格的样式：水平对齐居中
                    style.Alignment = HorizontalAlignment.Center;
                    //新建一个字体样式对象
                    IFont font = workbook.CreateFont();
                    //设置字体加粗样式
                    font.Boldweight = short.MaxValue;
                    font.FontHeightInPoints = 18;
                    //使用SetFont方法将字体样式添加到单元格样式中 
                    style.SetFont(font);
                    //将新的样式赋给单元格
                    row.Cells[0].CellStyle = style;

                    if (!string.IsNullOrEmpty(filter))
                    {
                        IRow rowFilter = sheet.CreateRow(count++);
                        rowFilter.CreateCell(0).SetCellValue($"筛选条件:{filter}");
                        sheet.AddMergedRegion(new CellRangeAddress(count - 1, count - 1, 0, (colums - 1) > 0 ? (colums - 1) : colums));
                    }

                    IRow rowTime = sheet.CreateRow(count++);
                    rowTime.CreateCell(0).SetCellValue($"导出时间:{now.ToString("yyyy-MM-dd HH:mm:ss")}");
                    sheet.AddMergedRegion(new CellRangeAddress(count - 1, count - 1, 0, (colums - 1) > 0 ? (colums - 1) : colums));
                }
                #endregion


                if (isColumnWritten == true) //写入DataTable的列名
                {
                    IRow row = sheet.CreateRow(count++);
                    ICellStyle style = workbook.CreateCellStyle();
                    //设置单元格的样式：水平对齐居中
                    style.Alignment = HorizontalAlignment.Center;
                    //新建一个字体样式对象
                    IFont font = workbook.CreateFont();
                    //设置字体加粗样式
                    font.Boldweight = short.MaxValue;
                    style.SetFont(font);
                    for (j = 0; j < data.Columns.Count; ++j)
                    {
                        row.CreateCell(j).SetCellValue(data.Columns[j].ColumnName);
                        row.Cells[j].CellStyle = style;
                    }
                }

                for (i = 0; i < data.Rows.Count; ++i)
                {
                    IRow row = sheet.CreateRow(count);
                    for (j = 0; j < data.Columns.Count; ++j)
                    {
                        if (double.TryParse(data.Rows[i][j].ToString(), out double nx))
                        {
                            row.CreateCell(j).SetCellValue(nx);
                        }
                        //else if (DateTime.TryParse(data.Rows[i][j].ToString(), out DateTime zz))
                        //{
                        //    row.CreateCell(j).SetCellValue(zz.ToString("yyyy-MM-dd HH:mm:ss"));
                        //}
                        else
                        {
                            row.CreateCell(j).SetCellValue(data.Rows[i][j].ToString());
                        }
                    }
                    ++count;
                }
                workbook.Write(fs); //写入到excel
                return count;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception: " + ex.Message);
                return -1;
            }
        }

        /// <summary>
        /// 将excel中的数据导入到DataTable中
        /// </summary>
        /// <param name="sheetName">excel工作薄sheet的名称</param>
        /// <param name="isFirstRowColumn">第一行是否是DataTable的列名</param>
        /// <param name="cellcount">导入模板的列数</param>
        /// <returns>返回的DataTable</returns>
        public DataTable ExcelToDataTable(string sheetName, bool isFirstRowColumn, int? cellcount)
        {
            ISheet sheet = null;
            DataTable data = new DataTable();
            int startRow = 0;
            try
            {
                fs = new FileStream(fileName, FileMode.Open, FileAccess.Read);
                if (fileName.IndexOf(".xlsx") > 0) // 2007版本
                    workbook = new XSSFWorkbook(fs);
                else if (fileName.IndexOf(".xls") > 0) // 2003版本
                    workbook = new HSSFWorkbook(fs);

                if (sheetName != null)
                {
                    sheet = workbook.GetSheet(sheetName);
                    if (sheet == null) //如果没有找到指定的sheetName对应的sheet，则尝试获取第一个sheet
                    {
                        sheet = workbook.GetSheetAt(0);
                    }
                }
                else
                {
                    sheet = workbook.GetSheetAt(0);
                }
                if (sheet != null)
                {
                    IRow firstRow = sheet.GetRow(0);
                    int cellCount = firstRow.LastCellNum; //一行最后一个cell的编号 即总的列数

                    //当传入列数时,判断列数是否匹配,不匹配返回 DataTable   
                    if (cellcount.HasValue && cellcount.Value != 0 && cellcount.Value != cellCount)
                    {
                        return data;
                    }


                    if (isFirstRowColumn)
                    {
                        for (int i = firstRow.FirstCellNum; i < cellCount; ++i)
                        {
                            ICell cell = firstRow.GetCell(i);
                            if (cell != null)
                            {
                                string cellValue = cell.StringCellValue;
                                if (cellValue != null)
                                {
                                    DataColumn column = new DataColumn(cellValue.Trim());
                                    data.Columns.Add(column);
                                }
                            }
                        }
                        startRow = sheet.FirstRowNum + 1;
                    }
                    else
                    {
                        startRow = sheet.FirstRowNum;
                    }

                    //最后一列的标号
                    int rowCount = sheet.LastRowNum;
                    for (int i = startRow; i <= rowCount; ++i)
                    {
                        IRow row = sheet.GetRow(i);
                        if (row == null) continue; //没有数据的行默认是null　　　　　　　

                        DataRow dataRow = data.NewRow();
                        for (int j = row.FirstCellNum; j < cellCount; ++j)
                        {
                            if (row.GetCell(j) != null) //同理，没有数据的单元格都默认是null
                            {
                                //NPOI中数字和日期都是NUMERIC类型的，这里对其进行判断是否是日期类型
                                if (row.GetCell(j).CellType == CellType.Numeric && DateUtil.IsCellDateFormatted(row.GetCell(j)))
                                {
                                    dataRow[j] = row.GetCell(j).DateCellValue;
                                }
                                else
                                {
                                    dataRow[j] = row.GetCell(j).ToString().Trim();
                                }

                            }
                        }
                        if (!string.IsNullOrWhiteSpace(dataRow[0].ToString()))
                        {
                            data.Rows.Add(dataRow);
                        }
                    }
                }

                return data;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception: " + ex.Message);
                return null;
            }
        }

        /// <summary>
        /// 将excel中的数据导入到DataTable中
        /// </summary>
        /// <param name="sheetName">excel工作薄sheet的名称</param>
        /// <param name="StartRow">数据开始行数 例如：从第二行开始，该值为2;从第三行开始，该值为3</param>
        /// <returns>返回的DataTable</returns>
        public DataTable ExcelToDataTable(string sheetName, int StartRow = 1)
        {
            ISheet sheet = null;
            DataTable data = new DataTable();
            // int startRow = 0;
            try
            {
                fs = new FileStream(fileName, FileMode.Open, FileAccess.Read);
                if (fileName.IndexOf(".xlsx") > 0) // 2007版本
                    workbook = new XSSFWorkbook(fs);
                else if (fileName.IndexOf(".xls") > 0) // 2003版本
                    workbook = new HSSFWorkbook(fs);

                if (sheetName != null)
                {
                    sheet = workbook.GetSheet(sheetName);
                    if (sheet == null) //如果没有找到指定的sheetName对应的sheet，则尝试获取第一个sheet
                    {
                        sheet = workbook.GetSheetAt(0);
                    }
                }
                else
                {
                    sheet = workbook.GetSheetAt(0);
                }
                if (sheet != null)
                {
                    //IRow firstRow = sheet.GetRow(0);
                    IRow firstRow = sheet.GetRow(StartRow - 1);
                    int cellCount = firstRow.LastCellNum; //一行最后一个cell的编号 即总的列数

                    if (StartRow > 1)
                    {
                        for (int i = 0; i < cellCount; ++i)
                        {
                            ICell cell = firstRow.GetCell(i);
                            //if (cell != null)
                            //{

                            //string cellValue = cell.StringCellValue;
                            //if (cellValue != null)
                            //{
                            DataColumn column = new DataColumn();
                            data.Columns.Add(column);
                            // }
                            //}
                            //else
                            //{

                            //}
                        }

                    }
                    StartRow = sheet.FirstRowNum + StartRow - 1;

                    //最后一列的标号
                    int rowCount = sheet.LastRowNum;
                    for (int i = StartRow; i <= rowCount; ++i)
                    {
                        IRow row = sheet.GetRow(i);
                        if (row == null) continue; //没有数据的行默认是null　　　　　　　

                        DataRow dataRow = data.NewRow();
                        for (int j = row.FirstCellNum; j < cellCount; ++j)
                        {
                            if (row.GetCell(j) != null) //同理，没有数据的单元格都默认是null
                            {
                                //NPOI中数字和日期都是NUMERIC类型的，这里对其进行判断是否是日期类型
                                if (row.GetCell(j).CellType == CellType.Numeric && DateUtil.IsCellDateFormatted(row.GetCell(j)))
                                {
                                    dataRow[j] = row.GetCell(j).DateCellValue;
                                }
                                else
                                {
                                    dataRow[j] = row.GetCell(j).ToString();
                                }

                            }
                        }
                        if (!string.IsNullOrWhiteSpace(dataRow[0].ToString()))
                        {
                            data.Rows.Add(dataRow);
                        }


                    }
                }

                return data;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception: " + ex.Message);
                return null;
            }
        }


        #region Dispoose释放
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    if (fs != null)
                        fs.Close();
                }

                fs = null;
                disposed = true;
            }
        }
        #endregion
    }
}
