using OOP.SingleWeb.Web.MyInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OOP.SingleWeb.Web.MyImplements
{
    [AppService(ServiceType = typeof(IA))]
    public class A : IA
    {
        public DateTime NowDate { get; set; }
    }
}
