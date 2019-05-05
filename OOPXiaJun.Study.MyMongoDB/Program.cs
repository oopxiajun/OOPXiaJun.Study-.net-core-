using System;

namespace OOPXiaJun.Study.MyMongoDB
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            var bs = System.Text.ASCIIEncoding.UTF8.GetBytes("aaa111");

            byte b = Convert.ToByte(2);

            Console.WriteLine(Convert.ToString(b, 2));

            Console.ReadLine();
        }
    }
}
