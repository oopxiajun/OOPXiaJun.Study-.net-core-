using System;
using System.Threading;
using System.Threading.Tasks;

namespace OOPXiaJun.Study.AsyncAwait
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            //var progress = new Progress<MyMessage>();
            //DoSomething(progress);

            var progress = new Progress<int>(percent => { Console.WriteLine(percent + "%"); });

            DoProcessing(progress);

            Console.Read();
        }

        async static Task MyMethodAsync()
        {
            await Task.Delay(100000);
        }

        //static private async void DoSomething(IProgress<MyMessage> progress)
        //{
        //    int total = 100;
        //    for (int i = 0; i <= total; i++)
        //    {
        //        await Task.Delay(2000);

        //        progress.Report(new MyMessage() { Current = i + 1, Total = total });
        //    }
        //    progress.Report(new MyMessage() { Current = 0, Total = total });
        //}
        static void DoProcessing(IProgress<int> progress)
        {
            for (int i = 0; i != 100; ++i)
            {
                Thread.Sleep(1000);
                if (progress != null)
                {
                    progress.Report(i);
                }
            }
        }
    }
}
