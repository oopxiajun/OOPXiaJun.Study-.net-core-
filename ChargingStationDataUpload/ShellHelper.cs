using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;

namespace ChargingStationDataUpload
{
    public static class ShellHelper
    {
        public static void test()
        {
           // var pp = Process.Start("scp", "root@192.168.101.22:22",  GetSecurity(), "root@192.168.101.22:/usr/program/tomcat-7/RUNNING.txt D:/test_db/RUNNING.txt");

            var pp = Process.Start("scp", "root@192.168.101.22:/usr/program/tomcat-7/RUNNING.txt D:/test_db/RUNNING.txt");

            string dbName = "RUNNING.txt";
            var sdkVersion = string.Empty;
            var psi = new System.Diagnostics.ProcessStartInfo("scp", AppConfig.SDServerPath + dbName + " " + AppConfig.LocalSavePath + dbName);

            psi.Password = GetSecurity();
            psi.UserName = "root@192.168.101.22:22";
            psi.Domain = null;
            
            Process proc = new Process();
            proc.StartInfo = psi;
            proc.StartInfo.RedirectStandardOutput = false;

            proc.Start();

            string output = proc.StandardOutput.ReadToEnd();
        }

        public static System.Security.SecureString GetSecurity()
        {
            var p = new System.Security.SecureString();
            var chars = AppConfig.SDServerPassword.ToCharArray();
            for (int i = 0; i < chars.Length; i++)
            {
                p.AppendChar(chars[i]);
            }
            return p;
        }
    }
}
