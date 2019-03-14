using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Apache.NMS;
using Apache.NMS.ActiveMQ;
using Microsoft.AspNetCore.Mvc;
using OOPXiaJun.Study.MyActiveMQ.WebApplication_1.Models;

namespace OOPXiaJun.Study.MyActiveMQ.WebApplication_1.Controllers
{
    public class HomeController : Controller
    {
        private static IConnectionFactory factory;
        private static IConnection connection;
        private static ISession session;
        public IActionResult Index()
        {
            if (factory == null)
            {
                factory = new ConnectionFactory("tcp://localhost:61616");

            }

            //通过工厂建立连接
            connection = connection == null ? connection = factory.CreateConnection() : connection;
            //通过连接创建Session会话
            session = session == null ? session = connection.CreateSession() : session;

            //通过会话创建生产者，方法里面new出来的是MQ中的Queue
            IMessageProducer prod = session.CreateProducer(new Apache.NMS.ActiveMQ.Commands.ActiveMQQueue("firstQueue"));
            //创建一个发送的消息对象
            ITextMessage message = prod.CreateTextMessage();
            //给这个对象赋实际的消息
            message.Text = Guid.NewGuid().ToString("N");
            //设置消息对象的属性，这个很重要哦，是Queue的过滤条件，也是P2P消息的唯一指定属性
            message.Properties.SetString("filter", "demo");
            message.NMSTimestamp = DateTime.Now.AddDays(1);
            //生产者把消息发送出去，几个枚举参数MsgDeliveryMode是否长链，MsgPriority消息优先级别，发送最小单位，当然还有其他重载
            prod.Send(message, MsgDeliveryMode.NonPersistent, MsgPriority.Normal, TimeSpan.MinValue);



            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
