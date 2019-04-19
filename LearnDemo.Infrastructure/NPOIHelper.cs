using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.IO;
using System.Reflection;

namespace LearnDemo.Infrastructure
{
    public class NPOIHelper
    {


        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="datas">数据</param>
        /// <param name="fileName">文件名称</param>
        /// <param name="sheetName">sheetName</param>
        /// <param name="tableName">表头名称</param>
        /// <param name="filter">查询条件</param>
        /// <returns></returns>
        public static ExportToExcelResponse ExportToExcel<T>(IEnumerable<T> datas, string rootPath, string fileName, string sheetName = "sheet1", string tableName = "", string filter = "")
        {
            if (datas == null)
            {
                return new ExportToExcelResponse { errmsg = "传入的实体为空", success = false };
            }

            #region 将dates转换成datatable
            DataTable dataTable = new DataTable();
            PropertyInfo[] properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (PropertyInfo property in properties)
            {
                DataColumn dataColumn = new DataColumn();
                object[] objs = property.GetCustomAttributes(typeof(DescriptionAttribute), true);
                if (objs.Length > 0)
                {
                    dataColumn.ColumnName = ((DescriptionAttribute)objs[0]).Description;
                }
                else
                {
                    dataColumn.ColumnName = property.Name;
                }
                dataColumn.DataType = typeof(string);

                dataTable.Columns.Add(dataColumn);
            }

            int columnsCount = properties.Length;
            if (columnsCount == 0)
            {
                return new ExportToExcelResponse { errmsg = "传入的实体为空", success = false };
            }


            foreach (var item in datas)
            {
                string[] values = new string[columnsCount];
                values.SetValue("", 0);

                for (int i = 0; i < columnsCount; i++)
                {
                    string colValue = string.Empty;
                    var value = properties[i].GetValue(item);
                    if (value != null)
                    {
                        colValue = value.ToString();
                        values.SetValue(colValue, i);
                    }
                }

                dataTable.Rows.Add(values);
            }

            #endregion


            #region 将datatable转换成excel
            string downloadFolder = "/ExportExcel/" + Guid.NewGuid().ToString("N") + "/";

            string sWebRootFolder = rootPath + downloadFolder;
            if (!Directory.Exists(sWebRootFolder))
            {
                Directory.CreateDirectory(sWebRootFolder);
            }

            FileInfo file = new FileInfo(Path.Combine(sWebRootFolder, fileName));


            using (NPOIExcelHelper excelHelper = new NPOIExcelHelper(file.ToString()))
            {
                excelHelper.DataTableToExcel(dataTable, sheetName, true, tableName, DateTime.Now);
            }

            #endregion

            return new ExportToExcelResponse { local_path = file.ToString(), path = downloadFolder + fileName, success = true };
        }

    }
}
