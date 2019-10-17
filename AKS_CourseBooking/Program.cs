using System;
using System.Collections.Generic;

namespace AKS_CourseBooking
{
    class Program
    {
        static void Main(string[] args)
        { 
            Console.WriteLine("约课正在执行中...");
            Booking booking = new Booking();
            booking.ThreadSpecial();
            booking.Exect();
        }
    }
}
