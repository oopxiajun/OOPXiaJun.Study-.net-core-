using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace AKS_Subscribe.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }
         

        public void OnGet()
        {
            DateTime Jan1st1970 = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                         long t= (long)(DateTime.Now.AddHours(-8) - Jan1st1970).TotalSeconds; 
            string _timestamp = t + "";

            WebClient webClient = new WebClient(); 
            //webClient.Headers.Add(":authority", "www.acadsoc.com.cn");
            //webClient.Headers.Add(":method", "POST");
            //webClient.Headers.Add(":path", "/Ajax/Web.UI.Fun.Course.aspx?method=AppointClass&_timestamp="+ _timestamp);
            //webClient.Headers.Add(":scheme", "https");
            //webClient.Headers.Add(":_sign_", "a57621d8be0f57c250212c6baff28caad4afa3deb8f54ac8e13c78ec688f29a6709d6df5cc13cbc6f659c5f463513f926deb73ac31792c5bc68dfe93284988fb956a8d593ed22efc575cb20cd8290ea3c9be1d0c49992e3186f644767d1cdc4dd3ff2a6899b00c9a06fe55160c95fe5369e684bb371ddc6076b01165550c57fb1");

            webClient.Headers.Add("accept", "application/json, text/javascript, */*; q=0.01");
            //webClient.Headers.Add("accept-encoding", "gzip, deflate, br");
            //webClient.Headers.Add("accept-language", "zh-CN,zh;q=0.9");
            //webClient.Headers.Add("cache-control", "no-cache");
            //webClient.Headers.Add("content-length", "159");
            //webClient.Headers.Add("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
            webClient.Headers.Add("cookie", "acw_tc=7d412b4415709650584563770e8084a8d65151b22954e9f1f0239e6791; .ASPXANONYMOUS=pGcHvki41QEkAAAAYjllMDE3ZGEtYjZlNi00ODRjLTkzZWUtM2RjMjRkYjMzNjZlGhIM6YSYDr68-cI3VfJTe2NSrTcwz-1Sd8fREp6CXeE1; ASP.NET_SessionId=wt04cywsxlzbg0zdpjkpjb4t; sajssdk_2015_cross_new_user=1; ABFirst_1=64433156; _ABVID_672=52870670; _ABVGID_1=45123012; _source=51A2831AE2BEACAA3CC02F25BACEA0E59F394B6CBB1205715867F65F4AB476DAEE9272312543D79534405AC6699038B2; _Record=98B9F21D97D677AFC3D2DE279500A8E3; gdxidpyhxdE=RQeY5G%2FetvChUXoy3P7mt%2BymsGmUSplnwMNK5AkaL6%2BB8ermQ0pUH8ZV%2BM0q4tpVCq%5CB3UZ9%2FWyCvOQyrR4N7oa8arQB%5Cznac4jp3XuhVHiWTBJtX8IaTYW7D5KdVV3jXZWbjoLd7u9CA5wfnt3pyxjHQfMNwuyyC8Guini02rVp3yQU%3A1570965953109; _9755xjdesxxd_=32; _AcadsocMemory=0YJX3d8KVl0KGxMIW7WGw2ZL2OvucPp4WnqAzBCPaDKBU2q2qLBRAbvGWrHjBiMkM0ajvktUvOJKwGYu5Y/zDT5uVGOT8bGi0g+krvHtoaLU08SrXpxn7yS37NWX1rPvm6lI7plYTSO8MHcHf/sVocI/N7ecdCk5ABo0nLxYsM4=; .web_cookie=73AE83C7C6D5E572EE9E7DEF65FDB9D01DC4C6DDECB604D924DEA6B6FDF3C33F0930AF4240F517C0331DC1735E1D8BBCEC46D9DE4C88959BB5810FCF9EA9AF8BC5ED28BD37E29F6D5857320C2B9FC44B7B03B1B0583EB3A5CBD9A0C952726DABFEDEB7BF1876DCA982EA30F336C29CF57A04CC10CF9CDA15E690C0DF6EBE000A35291249524A9A0FD49D126718173E2D; _Uid=BF1B91801DCF4EA9; _PhoneMemory=F68D609E695F3324EBCBF8C14B161623; _Automation=41C3DBF028AD60CA4C3E5B8ADD176A5F; UM_distinctid=16dc4d0997b69-067f91a2b7e945-67e1b3f-144000-16dc4d0997c20e; CNZZDATA1261244036=1453963693-1570963912-https%253A%252F%252Fwww.acadsoc.com.cn%252F%7C1570963912; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%223159868%22%2C%22%24device_id%22%3A%2216dc4d05c1a28c-062d178c6bbe6d-67e1b3f-1327104-16dc4d05c1b377%22%2C%22props%22%3A%7B%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%7D%2C%22first_id%22%3A%2216dc4d05c1a28c-062d178c6bbe6d-67e1b3f-1327104-16dc4d05c1b377%22%7D; _u=Web.UI.Fun:IpRecord:LogClientInfo:0806133e-7edd-4da1-8404-9620811fb398; SERVERID=6c753b3b89ff334b6128833f61cc6d04|1570965437|1570965058");
            //webClient.Headers.Add("origin", "https://www.acadsoc.com.cn");
            webClient.Headers.Add("pragma", "no-cache");
            webClient.Headers.Add("referer", "https://www.acadsoc.com.cn/WebNew/user/BookClass/newbookclass.aspx");
            webClient.Headers.Add("pragma", "no-cache");
            webClient.Headers.Add("sec-fetch-mode", "cors");
            webClient.Headers.Add("sec-fetch-site", "same-origin");
            webClient.Headers.Add("sec-fetch-mode", "cors");
            webClient.Headers.Add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36");
            webClient.Headers.Add("x-requested-with", "XMLHttpRequest");
            webClient.Headers.Add("sec-fetch-mode", "cors");

            System.Collections.Specialized.NameValueCollection nameValueCollection = new System.Collections.Specialized.NameValueCollection();
            nameValueCollection.Add("TUID", "86632");
            nameValueCollection.Add("bookingWay", "3");
            nameValueCollection.Add("COID", "2031295");
            nameValueCollection.Add("UID", "3159868");
            nameValueCollection.Add("targetTime", "\"2019-10-20 22:30\"");
            nameValueCollection.Add("classtool", "8");
            nameValueCollection.Add("isNew", "0");
            nameValueCollection.Add("teacherPers", "");
            nameValueCollection.Add("teacherStyle", "");
            nameValueCollection.Add("__", "AppointClass");
            var result = webClient.UploadValues("https://www.acadsoc.com.cn/Ajax/Web.UI.Fun.Course.aspx?method=AppointClass&_timestamp=" + _timestamp, "POST", nameValueCollection);

            //{"code":0,"msg":null,"value":{"result":false,"msg":"对不起！该时间点已被预订，请重新选择时间！"}}
            var str = System.Text.Encoding.UTF8.GetString(result);


        }
    }
}
