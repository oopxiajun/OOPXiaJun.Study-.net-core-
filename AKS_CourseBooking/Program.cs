using System;

namespace AKS_CourseBooking
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("约课正在执行中...");
            Booking booking = new Booking();
            int times = 0;
            while (true)
            {
                try
                {
                    times++;

                    Console.WriteLine(DateTime.Now.ToString() + "第"+times+"次运行");

                    booking.Exect();
                    Console.WriteLine("暂停中...");
                    System.Threading.Thread.Sleep(30 * 1000);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            }
        }
    }
}
