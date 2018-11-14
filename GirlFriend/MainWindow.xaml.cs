using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace GirlFriend
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void closing_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            MessageBox.Show("逃不掉！");
            e.Cancel = true;
        }

        private void btn_agree_Click(object sender, RoutedEventArgs e)
        {
            lab1.Visibility = Visibility.Hidden;
            lab2.Content = "你必须爱我！";
            btn3.Visibility = Visibility.Visible;
            btn1.Visibility = Visibility.Hidden;
            btn_agree.Visibility = Visibility.Hidden;
        }

        private void btn3_Click(object sender, RoutedEventArgs e)
        {
            Environment.Exit(0);
        }

        private void btn2_MouseEnter(object sender, MouseEventArgs e)
        {
            Random rd = new Random();
            Button btn = sender as Button;
            double maxW = this.Width;
            double maxH = this.Height;
            double w = btn.Width;
            double h = btn.Height;
            double l = rd.Next(0, (int)(maxW - w));
            double t = rd.Next(0, (int)(maxH - h));
            btn.Margin = new Thickness(l, t, 0, 0);
        }
    }
}
