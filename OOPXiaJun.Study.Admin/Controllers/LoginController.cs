using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks; 
using Microsoft.AspNetCore.Mvc;
using OOPXiaJun.Study.Admin.Models;

namespace OOPXiaJun.Study.Admin.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public JsonResult Login(LoginModel loginModel)
        {
            return new JsonResult("");
        }

        public JsonResult LoginOut()
        {
            return new JsonResult("");
        }

    }
}