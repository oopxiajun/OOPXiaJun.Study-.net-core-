using System;
using System.IO;
using System.Text;

namespace AKaSuoCourseware
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            //读取文件中的字符串
            string fileStr = getFileStr("aks-20191006.txt");

            //根据关键字 分组
            string[] data_original_title = fileStr.Split("<li class=\"cor-sm-10 cor-md-10 cor-lg-10 no-padding age tooltips\" title=\"\" data-original-title=\"");
            string[] href = fileStr.Split("target=\"_blank\" href=\"");

            if (href != null && href.Length > 1)
            {
                for (int i = 1; i < href.Length; i++)
                {

                    //获取名字和路径

                    //路径的第一个引号
                    int index_yh = href[i].IndexOf("\"");
                    string url = href[i].Substring(0, index_yh);
                    string downUrl = "http://www.acadsoc.com.cn" + url;

                    //     名字中的第一个引号 
                    int name_yh = data_original_title[i].IndexOf("\"");

                    string tip_name = data_original_title[i].Substring(0, name_yh);

                    string lesson_name = getLessonName(data_original_title[i]);

                    string fileName = GetSafeFilename(tip_name + " " + lesson_name + ".pdf");

                    Console.WriteLine(fileName + "\r\n" + downUrl);
                    //下载保存

                    System.Net.WebClient webClient = new System.Net.WebClient();

                    webClient.DownloadFile(downUrl, "F:/Summer Study English/" + fileName);
                }
            }

        }

        public static string getLessonName(string html)
        {
            int count = 3;

            int start = indexOf(html, '>', count);
            if (html[start - 1] != '\"')
            {
                count = count + 2;
                start = indexOf(html, '>', count);
            }

            int end = indexOf(html, '<', count);
            string name = html.Substring(start + 1, end - start - 1).Replace("\r\n", "").TrimStart();
            return name;
        }

        static int indexOf(string html, char chars, int count)
        {

            int t = 0;
            for (int i = 0; i < html.Length; i++)
            {
                if (chars == html[i])
                {
                    t++;

                    if (t == count)
                        return i;
                }
            }
            return -1;
        }


        public static string GetSafeFilename(string arbitraryString)
        {
            var invalidChars = System.IO.Path.GetInvalidFileNameChars();
            var replaceIndex = arbitraryString.IndexOfAny(invalidChars, 0);
            if (replaceIndex == -1) return arbitraryString;

            var r = new StringBuilder();
            var i = 0;

            do
            {
                r.Append(arbitraryString, i, replaceIndex - i);

                switch (arbitraryString[replaceIndex])
                {
                    case '"':
                        r.Append("''");
                        break;
                    case '<':
                        r.Append('\u02c2'); // '˂' (modifier letter left arrowhead)
                        break;
                    case '>':
                        r.Append('\u02c3'); // '˃' (modifier letter right arrowhead)
                        break;
                    case '|':
                        r.Append('\u2223'); // '∣' (divides)
                        break;
                    case ':':
                        r.Append('-');
                        break;
                    case '*':
                        r.Append('\u2217'); // '∗' (asterisk operator)
                        break;
                    case '\\':
                    case '/':
                        r.Append('\u2044'); // '⁄' (fraction slash)
                        break;
                    case '\0':
                    case '\f':
                    case '?':
                        break;
                    case '\t':
                    case '\n':
                    case '\r':
                    case '\v':
                        r.Append(' ');
                        break;
                    default:
                        r.Append('_');
                        break;
                }

                i = replaceIndex + 1;
                replaceIndex = arbitraryString.IndexOfAny(invalidChars, i);
            } while (replaceIndex != -1);

            r.Append(arbitraryString, i, arbitraryString.Length - i);

            return r.ToString();
        }

        static string getFileStr(string path)
        {

            using (FileStream fsRead = System.IO.File.OpenRead(path))
            {
                int fsLen = (int)fsRead.Length;
                byte[] heByte = new byte[fsLen];
                int r = fsRead.Read(heByte, 0, heByte.Length);
                string myStr = System.Text.Encoding.UTF8.GetString(heByte);
                return myStr;
            }
        }
    }
}
