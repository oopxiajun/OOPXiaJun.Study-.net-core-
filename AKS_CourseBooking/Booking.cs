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

        Dictionary<DateTime,DateTime> SuccessDay;

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

        public Booking()
        {
            txtPath = uid + "_" + coid + ".txt";
            SuccessDay = new Dictionary<DateTime, DateTime>();
            LoadSuccessDayFromTxt();
        }

        public void ThreadSpecial() {
            System.Threading.Thread thread = new System.Threading.Thread(delegate ()
            {
                int i = 0;
                while (true)
                {
                    Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")+teachers[0].Name + ":" + (++i) + "次");
                    try
                    {
                        PriorityTteacher(teachers[0]);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                    }
                    System.Threading.Thread.Sleep(5 * 1000);
                }
            });
            thread.Priority = System.Threading.ThreadPriority.Highest;
            thread.Start();
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("特定老师约课线程已启动;");
        }

        public void Exect()
        {
            /*
            1:获得最后一天预约成功的时间
            2:根据老师、课程、用户、时间预约课程（周末全天，每天只预约一节）
            3:检查请求结果是否预约成功（预约成功的写入到记录文件中）
            4:循环上面3步
             */

            System.Threading.Thread thread = new System.Threading.Thread(delegate ()
            {
                int times = 0;
                while (true)
                {
                    try
                    {
                        times++;
                        Console.WriteLine(DateTime.Now.ToString() + "第" + times + "次运行");

                        foreach (DateTime item in GetFailDay())
                        {
                            bool todayStatus = false;

                            foreach (var teacher in teachers)
                            {
                                foreach (var tt in time)
                                {
                                    todayStatus = AppointClass(teacher, item, tt);
                                    if (todayStatus) break;
                                }
                                if (todayStatus)
                                {
                                    break;
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                    }
                    System.Threading.Thread.Sleep(15 * 1000);
                }
            });
            thread.Priority = System.Threading.ThreadPriority.Highest;
            thread.Start();
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("统一约课线程已启动;");
        }

        public bool AppointClass(Teacher teacher, DateTime day, string time)
        {
            string mm = day.ToString("yyyy-MM-dd") + " " + time;
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(teacher.Name + ":" + mm + "  约课");
            Console.ResetColor();
            CBResponse<CBResponse_Value> response = AKSHttpHelper.AppointClass(teacher.TUID, coid, uid, mm);
            if (response != null && response.value != null && response.value.result)
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine(teacher.Name + ":" + mm + "\n" + Newtonsoft.Json.JsonConvert.SerializeObject(response) + "\n" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                Console.ResetColor();

                WriteSuccessDayToTxt(day);
                return true;
            }
            return false;
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
              string [] day
                    =  item.Split(":");

                SuccessDay.Add(DateTime.Parse(day[0]), DateTime.Parse(day[1]));
            }
        }

        private void WriteSuccessDayToTxt(DateTime day)
        {

            SuccessDay.Add(day,DateTime.Now);
            string txt = "";

            foreach (var item in SuccessDay)
            {
                txt += "\n" + item.Key.ToString("yyyy-MM-dd")+":"+item.Value.ToString("yyyy-MM-dd HH:mm:ss");
            }

            System.IO.File.WriteAllText(txtPath, txt);
        }

        private List<DateTime> GetFailDay()
        {
            List<DateTime> falseDay = new List<DateTime>();

            DateTime begin = DateTime.Now;
            if(begin.Hour>17) begin = begin.AddDays(1);

            while (begin < DateTime.Now.AddDays(14))
            {
                //未在成功之列
                if (SuccessDay.Count(d => d.Key.Date.Equals(begin.Date)) == 0)
                {
                    falseDay.Add(DateTime.Parse(begin.ToString("yyyy-MM-dd")));
                }
                begin = begin.AddDays(1);
            }

            return falseDay;
        }




        public void PriorityTteacher(Teacher teacher)
        {
            foreach (DateTime day in GetFailDay())
            {
                Console.WriteLine(teacher.Name + ":" + day.ToString("yyyy-MM-dd"));
                CBResponse<Dictionary<DateTime, dynamic>> dictionary = AKSHttpHelper.GetTargetTimeAvaDuration(teacher.TUID, day.ToString("yyyy-MM-dd"), coid);
                if (dictionary != null && dictionary.value != null && dictionary.value.Count > 0)
                {
                    foreach (dynamic item in dictionary.value.Values)
                    {
                        int count = time.Where(s => s.Contains((string)item.hour)).Count();
                        if (count > 0)
                        {
                            bool b = AppointClass(teacher, day, (string)item.hour);
                            if (b)
                            {
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}
