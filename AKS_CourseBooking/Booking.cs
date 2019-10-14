using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace AKS_CourseBooking
{
    public class Booking
    {
        string coid = "2031295";
        string uid = "3159868";
        string txtPath = "";

        List<DateTime> SuccessDay;

        public Booking()
        {
            txtPath = uid + "_" + coid + ".txt";
            SuccessDay = new List<DateTime>();
            LoadSuccessDayFromTxt();
        }

        public void Exect()
        {
            /*
            1:获得最后一天预约成功的时间
            2:根据老师、课程、用户、时间预约课程（周末全天，每天只预约一节）
            3:检查请求结果是否预约成功（预约成功的写入到记录文件中）
            4:循环上面3步
             */

            List<Teacher> teachers = new List<Teacher>() {
                new Teacher("3146","Grazzy"),
                new Teacher("62601","Nadia.A"),
                new Teacher("49232","Aldwin"),
                new Teacher("37211","Merile.S")
            };

            List<string> time = new List<string>() {
                "19:00",
                "19:30",
                "20:00",
                "20:30",
                "18:30",
                "21:00",
                "21:30"
            };

            foreach (DateTime item in GetFailDay())
            {
                bool todayStatus = false;

                foreach (var teacher in teachers)
                {
                    foreach (var tt in time)
                    {
                        string mm = item.ToString("yyyy-MM-dd") + " " + tt;
                        Console.ForegroundColor = ConsoleColor.Red;
                        Console.WriteLine(teacher.Name + ":" + mm+"  约课");
                        Console.ResetColor();
                        CBResponse response = AKSHttpHelper.Request(teacher.TUID, coid, uid, mm);
                        if (response != null && response.value != null && response.value.result)
                        {
                            //成功后，记录时间
                            todayStatus = true;


                            Console.ForegroundColor = ConsoleColor.Green;
                            Console.WriteLine(teacher.Name + ":" + mm + "\n" + Newtonsoft.Json.JsonConvert.SerializeObject(response) + "\n" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                            Console.ResetColor();

                            WriteSuccessDayToTxt(item);

                            break;
                        }
                    }
                    if (todayStatus)
                    {
                        break;
                    }
                }
            }
            SaveSuccessToTxt();
        }

        private void LoadSuccessDayFromTxt()
        {
            if (!System.IO.File.Exists(txtPath))
            {
                using (System.IO.FileStream s = System.IO.File.Create(txtPath))
                {
                    s.Close();
                }
            }

            //读文件
            string txtContent = System.IO.File.ReadAllText(txtPath);
            string[] strDay = txtContent.Split("\n");
            foreach (var item in strDay)
            {
                if (string.IsNullOrWhiteSpace(item)) continue;
                SuccessDay.Add(DateTime.Parse(item));
            }
        }

        private void WriteSuccessDayToTxt(DateTime day)
        {
            int count = SuccessDay.Count(d => d.Date.Equals(d.Date.Date));
            if (count == 0)
            {
                SuccessDay.Add(day);
            }
        }

        private List<DateTime> GetFailDay()
        {
            List<DateTime> falseDay = new List<DateTime>();

            DateTime begin = DateTime.Now;


            while (begin < DateTime.Now.AddDays(14))
            {
                //未在成功之列
                if (SuccessDay.Count(d => d.Date.Equals(begin.Date)) == 0)
                {
                    falseDay.Add(DateTime.Parse(begin.ToString("yyyy-MM-dd")));
                }
                begin = begin.AddDays(1);
            }

            return falseDay;
        }

        private void SaveSuccessToTxt()
        {
            var temp = SuccessDay.Where(s => s.Date >= DateTime.Now.Date).ToList();
            string txt = "";

            foreach (DateTime item in temp)
            {
                txt += "\n" + item.ToString("yyyy-MM-dd");
            }

            //if (!System.IO.File.Exists(txtPath))
            //{
            //    using (System.IO.FileStream s = System.IO.File.Create(txtPath))
            //    {
            //        s.Close();
            //    }
            //}
            System.IO.File.AppendAllText(txtPath, txt);
        }

    }
}
