using System;
using System.IO;
using Microsoft.Extensions.Configuration;
namespace ChargingStationDataUpload
{
    class Program
    {
        static void Main(string[] args)
        {

            Console.WriteLine("Hello World!");
            AppConfig.LoadConfig();//加载配置文件


            ShellHelper.test();


            FileInfo file = new FileInfo(@"F:\鹰明\新能源项目\换电站数据\batLog\2019-06-10_3340112050000011_18.db");
            FTPHelper.Upload(file,"2019-06-13");
        }
    }
}
