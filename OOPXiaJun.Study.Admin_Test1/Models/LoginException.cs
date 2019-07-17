using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OOPXiaJun.Study.Admin_Test1.Models
{
    /// <summary>
    /// 登录异常
    /// </summary>
    public class LoginException: Exception
    {
        public LoginException():base() { }
        public LoginException(string msg):base(msg) {

        }
    }
}
