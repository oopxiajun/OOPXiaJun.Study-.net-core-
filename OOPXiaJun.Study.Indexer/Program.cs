using System;
using System.Collections.Generic;

namespace OOPXiaJun.Study.Indexer
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine(GetClosureFunction()(30));


            //Program program = new Program();
            //// program.test(10);
            //float f = -123.567F; int i = (int)f;
            //Console.WriteLine(i);
            //Console.WriteLine("Hello World!");


            ////short s1 = 1; s1 = s1 + 1;//错误
            //short s1 = 1; s1 += 1;// 正确。
            //MyIndexer<int, string> myIndexer = new MyIndexerImp<int, string>();


            //myIndexer[0] = "1";
            //myIndexer[2] = "2";
            //myIndexer[3] = "3";


            //Console.WriteLine(myIndexer[0]);

        }

        public void test(int i)
        {
            lock (this)
            {
                if (i > 0)
                {
                    i--;
                }
                test(i);
            }
        }

        /// <summary>
        /// 闭包
        /// </summary>
        /// <returns></returns>

        static Func<int, int> GetClosureFunction()
        {
            Func<int, int, string> intToString = (x, y) =>
            {
                Console.WriteLine("输入：" + x + ";输出：" + (x + 1) + ";");
                return (x + 1).ToString();
            };

            for (int i = 0; i < 10; i++)
            {
                intToString(i, 0);
            }




            int val = 10;
            Func<int, int> internalAdd = x => x + val;

            Console.WriteLine(internalAdd(10));

            internalAdd(20);
            val = 30;
            Console.WriteLine(internalAdd(10));

            return internalAdd;
        }
    }
}
