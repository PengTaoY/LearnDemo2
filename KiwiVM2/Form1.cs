using Newtonsoft.Json;
using System;
using System.Net;
using System.Windows.Forms;

namespace KiwiVM2
{
    public partial class Form1 : Form
    {
        System.Reflection.Assembly CurrentDomain_AssemblyResolve(object sender, ResolveEventArgs args)
        {
            string dllName = args.Name.Contains(",") ? args.Name.Substring(0, args.Name.IndexOf(',')) : args.Name.Replace(".dll", "");
            dllName = dllName.Replace(".", "_");
            if (dllName.EndsWith("_resources")) return null;
            System.Resources.ResourceManager rm = new System.Resources.ResourceManager(GetType().Namespace + ".Properties.Resources", System.Reflection.Assembly.GetExecutingAssembly());
            byte[] bytes = (byte[])rm.GetObject(dllName);
            return System.Reflection.Assembly.Load(bytes);
        }

        public Form1()
        {
            AppDomain.CurrentDomain.AssemblyResolve += new ResolveEventHandler(CurrentDomain_AssemblyResolve);
            InitializeComponent();
        }

        private void btn_Query_Click(object sender, EventArgs e)
        {
            lb_message.Text = string.Empty;
            if (string.IsNullOrEmpty(txt_VEID.Text.Trim()))
            {
                lb_message.Text = "请输入VEID";
                txt_VEID.Focus();
                return;
            }
            if (string.IsNullOrEmpty(txt_APIKEY.Text.Trim()))
            {
                lb_message.Text = "请输入APIKEY";
                txt_APIKEY.Focus();
                return;
            }
            string requestAddress = $"https://api.64clouds.com/v1/getServiceInfo?veid={txt_VEID.Text.Trim()}&api_key={txt_APIKEY.Text.Trim()}";

            WebClient client = new WebClient();
            string result = client.DownloadString(requestAddress);

            if (!string.IsNullOrEmpty(result))
            {
                KvmResponse model = JsonConvert.DeserializeObject<KvmResponse>(result);

                if (model != null)
                {
                    if (model.error == 0)
                    {
                        // groupBox1.Text = model.hostname + " " + model.vm_type;
                        lb_PhysicalLocation.Text = model.node_location + "   " + model.node_alias;
                        lb_IPAddress.Text = model.node_ip;
                        lb_RAM.Text = model.BitToMB(model.plan_ram) + " MB";
                        lb_Bandwidthusage.Text = model.BitToGB(model.data_counter) + " / " + model.BitToGB(model.plan_monthly_data) + " GB";

                        progressBar1.Maximum = Convert.ToInt32(model.BitToGB(model.plan_monthly_data) * 100);
                        progressBar1.Value = Convert.ToInt32(model.BitToGB(model.data_counter) * 100);

                        lb_OperatingSystem.Text = model.ReplaceLine(model.os);
                        lb_Hostname.Text = model.ConvertToDateTime(model.data_next_reset).ToShortDateString();
                    }
                    else if (model.error == 700005)
                    {
                        MessageBox.Show("用户认证失败");
                    }
                    else
                    {
                        MessageBox.Show(model.message);
                    }
                }
                else
                {
                    MessageBox.Show("信息查询出错");
                }
            }
            else
            {
                MessageBox.Show("未查询到相关信息");
            }
        }

        private void btn_Reset_Click(object sender, EventArgs e)
        {
            txt_APIKEY.Text = string.Empty;
            txt_VEID.Text = string.Empty;
            lb_Bandwidthusage.Text = string.Empty;
            lb_Hostname.Text = string.Empty;
            lb_IPAddress.Text = string.Empty;
            lb_OperatingSystem.Text = string.Empty;
            lb_PhysicalLocation.Text = string.Empty;
            lb_RAM.Text = string.Empty;
            progressBar1.Value = 0;
        }
    }
}
