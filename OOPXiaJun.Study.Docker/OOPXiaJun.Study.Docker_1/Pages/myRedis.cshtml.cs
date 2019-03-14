using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace OOPXiaJun.Study.Docker_1.Pages
{
    public class myRedisModel : PageModel
    {
        string conStr = "redis:6379";
        public string redisValue { get; set; }
        public void OnGet()
        {
            RedisHelper redisHelper = new RedisHelper(conStr);
            redisValue = redisHelper.GetValue("xiajun");
            //RedisClient redisClient = new RedisClient(conStr);
            //redisValue = redisClient.Get<string>("test");

            
        }
    }
}