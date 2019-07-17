using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OOPXiaJun.Study.Admin_Test1.Models;

namespace OOPXiaJun.Study.Admin_Test1.Controllers
{
    [Filter.GlobalActionFilterAttribute]
    [Filter.GlobalExceptionAttribute]
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        } 
        public JsonResult Login(LoginModel loginModel)
        {
            if (!"1@2.com".Equals(loginModel.UserName))
            {
                throw new LoginException("登录名错误");
            }
            if (!"123456".Equals(loginModel.Password))
            {
                throw new LoginException("密码错误");
            }

            HttpContext.Session.Set(Constant.UserSessionKey, loginModel.UserName);
            return new JsonResult(null);
        }

        public JsonResult LoginOut()
        {
            HttpContext.Session.Remove(Constant.UserSessionKey);
            return new JsonResult("");
        }

    }
}