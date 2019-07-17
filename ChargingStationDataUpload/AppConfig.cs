using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace ChargingStationDataUpload
{
    public class AppConfig
    {
        public static string FTPServerIP { get; private set; }
        public static string FTPServerUserID { get; private set; }
        public static string FTPServerPassword { get; private set; }

        public static string SDServerPath { get; private set; }
        public static string SDServerPassword { get; private set; }
        public static string LocalSavePath { get; private set; }



        public static void LoadConfig()
        {
            var build = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            FTPServerIP = build.GetSection("FTPServer").GetSection("IP").Value;
            FTPServerUserID = build.GetSection("FTPServer").GetSection("UserID").Value;
            FTPServerPassword = build.GetSection("FTPServer").GetSection("Password").Value;

            SDServerPath = build.GetSection("SDServer").GetSection("Path").Value;
            SDServerPassword = build.GetSection("SDServer").GetSection("Password").Value;

            LocalSavePath = build.GetSection("LocalSavePath").Value;
        }
    }
}
