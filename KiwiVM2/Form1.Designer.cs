namespace KiwiVM2
{
    partial class Form1
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要修改
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.lb_message = new System.Windows.Forms.Label();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.progressBar1 = new System.Windows.Forms.ProgressBar();
            this.lb_Hostname = new System.Windows.Forms.Label();
            this.lb_OperatingSystem = new System.Windows.Forms.Label();
            this.lb_Bandwidthusage = new System.Windows.Forms.Label();
            this.label12 = new System.Windows.Forms.Label();
            this.lb_IPAddress = new System.Windows.Forms.Label();
            this.label10 = new System.Windows.Forms.Label();
            this.lb_RAM = new System.Windows.Forms.Label();
            this.label8 = new System.Windows.Forms.Label();
            this.lb_PhysicalLocation = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.txt_APIKEY = new System.Windows.Forms.TextBox();
            this.txt_VEID = new System.Windows.Forms.TextBox();
            this.lbAPIKEY = new System.Windows.Forms.Label();
            this.lbVEID = new System.Windows.Forms.Label();
            this.btn_Reset = new System.Windows.Forms.Button();
            this.btn_Query = new System.Windows.Forms.Button();
            this.groupBox1.SuspendLayout();
            this.SuspendLayout();
            // 
            // lb_message
            // 
            this.lb_message.AutoSize = true;
            this.lb_message.ForeColor = System.Drawing.Color.Red;
            this.lb_message.Location = new System.Drawing.Point(332, 23);
            this.lb_message.Name = "lb_message";
            this.lb_message.Size = new System.Drawing.Size(0, 12);
            this.lb_message.TabIndex = 12;
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.progressBar1);
            this.groupBox1.Controls.Add(this.lb_Hostname);
            this.groupBox1.Controls.Add(this.lb_OperatingSystem);
            this.groupBox1.Controls.Add(this.lb_Bandwidthusage);
            this.groupBox1.Controls.Add(this.label12);
            this.groupBox1.Controls.Add(this.lb_IPAddress);
            this.groupBox1.Controls.Add(this.label10);
            this.groupBox1.Controls.Add(this.lb_RAM);
            this.groupBox1.Controls.Add(this.label8);
            this.groupBox1.Controls.Add(this.lb_PhysicalLocation);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.label4);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Location = new System.Drawing.Point(19, 90);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(469, 399);
            this.groupBox1.TabIndex = 10;
            this.groupBox1.TabStop = false;
            // 
            // progressBar1
            // 
            this.progressBar1.Location = new System.Drawing.Point(187, 188);
            this.progressBar1.Name = "progressBar1";
            this.progressBar1.Size = new System.Drawing.Size(182, 12);
            this.progressBar1.TabIndex = 1;
            // 
            // lb_Hostname
            // 
            this.lb_Hostname.AutoSize = true;
            this.lb_Hostname.Location = new System.Drawing.Point(187, 305);
            this.lb_Hostname.Name = "lb_Hostname";
            this.lb_Hostname.Size = new System.Drawing.Size(0, 12);
            this.lb_Hostname.TabIndex = 0;
            // 
            // lb_OperatingSystem
            // 
            this.lb_OperatingSystem.AutoSize = true;
            this.lb_OperatingSystem.Location = new System.Drawing.Point(187, 248);
            this.lb_OperatingSystem.Name = "lb_OperatingSystem";
            this.lb_OperatingSystem.Size = new System.Drawing.Size(0, 12);
            this.lb_OperatingSystem.TabIndex = 0;
            // 
            // lb_Bandwidthusage
            // 
            this.lb_Bandwidthusage.AutoSize = true;
            this.lb_Bandwidthusage.Location = new System.Drawing.Point(187, 213);
            this.lb_Bandwidthusage.Name = "lb_Bandwidthusage";
            this.lb_Bandwidthusage.Size = new System.Drawing.Size(0, 12);
            this.lb_Bandwidthusage.TabIndex = 0;
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(42, 305);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(47, 12);
            this.label12.TabIndex = 0;
            this.label12.Text = "计费日:";
            // 
            // lb_IPAddress
            // 
            this.lb_IPAddress.AutoSize = true;
            this.lb_IPAddress.Location = new System.Drawing.Point(187, 96);
            this.lb_IPAddress.Name = "lb_IPAddress";
            this.lb_IPAddress.Size = new System.Drawing.Size(0, 12);
            this.lb_IPAddress.TabIndex = 0;
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(42, 248);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(59, 12);
            this.label10.TabIndex = 0;
            this.label10.Text = "操作系统:";
            // 
            // lb_RAM
            // 
            this.lb_RAM.AutoSize = true;
            this.lb_RAM.Location = new System.Drawing.Point(187, 145);
            this.lb_RAM.Name = "lb_RAM";
            this.lb_RAM.Size = new System.Drawing.Size(0, 12);
            this.lb_RAM.TabIndex = 0;
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(42, 194);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(83, 12);
            this.label8.TabIndex = 0;
            this.label8.Text = "流量使用情况:";
            // 
            // lb_PhysicalLocation
            // 
            this.lb_PhysicalLocation.AutoSize = true;
            this.lb_PhysicalLocation.Location = new System.Drawing.Point(187, 43);
            this.lb_PhysicalLocation.Name = "lb_PhysicalLocation";
            this.lb_PhysicalLocation.Size = new System.Drawing.Size(0, 12);
            this.lb_PhysicalLocation.TabIndex = 0;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(42, 96);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(47, 12);
            this.label2.TabIndex = 0;
            this.label2.Text = "IP地址:";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(42, 145);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(35, 12);
            this.label4.TabIndex = 0;
            this.label4.Text = "内存:";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(42, 43);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(59, 12);
            this.label1.TabIndex = 0;
            this.label1.Text = "物理地址:";
            // 
            // txt_APIKEY
            // 
            this.txt_APIKEY.Location = new System.Drawing.Point(91, 48);
            this.txt_APIKEY.Name = "txt_APIKEY";
            this.txt_APIKEY.PasswordChar = '*';
            this.txt_APIKEY.Size = new System.Drawing.Size(226, 21);
            this.txt_APIKEY.TabIndex = 6;
            // 
            // txt_VEID
            // 
            this.txt_VEID.Location = new System.Drawing.Point(91, 15);
            this.txt_VEID.Name = "txt_VEID";
            this.txt_VEID.Size = new System.Drawing.Size(226, 21);
            this.txt_VEID.TabIndex = 5;
            // 
            // lbAPIKEY
            // 
            this.lbAPIKEY.AutoSize = true;
            this.lbAPIKEY.Location = new System.Drawing.Point(29, 51);
            this.lbAPIKEY.Name = "lbAPIKEY";
            this.lbAPIKEY.Size = new System.Drawing.Size(59, 12);
            this.lbAPIKEY.TabIndex = 7;
            this.lbAPIKEY.Text = "API KEY：";
            // 
            // lbVEID
            // 
            this.lbVEID.AutoSize = true;
            this.lbVEID.Location = new System.Drawing.Point(29, 18);
            this.lbVEID.Name = "lbVEID";
            this.lbVEID.Size = new System.Drawing.Size(41, 12);
            this.lbVEID.TabIndex = 8;
            this.lbVEID.Text = "VEID：";
            // 
            // btn_Reset
            // 
            this.btn_Reset.Location = new System.Drawing.Point(413, 46);
            this.btn_Reset.Name = "btn_Reset";
            this.btn_Reset.Size = new System.Drawing.Size(75, 23);
            this.btn_Reset.TabIndex = 11;
            this.btn_Reset.Text = "重置";
            this.btn_Reset.UseVisualStyleBackColor = true;
            this.btn_Reset.Click += new System.EventHandler(this.btn_Reset_Click);
            // 
            // btn_Query
            // 
            this.btn_Query.Location = new System.Drawing.Point(332, 46);
            this.btn_Query.Name = "btn_Query";
            this.btn_Query.Size = new System.Drawing.Size(75, 23);
            this.btn_Query.TabIndex = 9;
            this.btn_Query.Text = "查询";
            this.btn_Query.UseVisualStyleBackColor = true;
            this.btn_Query.Click += new System.EventHandler(this.btn_Query_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(508, 506);
            this.Controls.Add(this.lb_message);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.txt_APIKEY);
            this.Controls.Add(this.txt_VEID);
            this.Controls.Add(this.lbAPIKEY);
            this.Controls.Add(this.lbVEID);
            this.Controls.Add(this.btn_Reset);
            this.Controls.Add(this.btn_Query);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "Form1";
            this.Text = "KiwiVM";
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label lb_message;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.ProgressBar progressBar1;
        private System.Windows.Forms.Label lb_Hostname;
        private System.Windows.Forms.Label lb_OperatingSystem;
        private System.Windows.Forms.Label lb_Bandwidthusage;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.Label lb_IPAddress;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.Label lb_RAM;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Label lb_PhysicalLocation;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox txt_APIKEY;
        private System.Windows.Forms.TextBox txt_VEID;
        private System.Windows.Forms.Label lbAPIKEY;
        private System.Windows.Forms.Label lbVEID;
        private System.Windows.Forms.Button btn_Reset;
        private System.Windows.Forms.Button btn_Query;
    }
}

