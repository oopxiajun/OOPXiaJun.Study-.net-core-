using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OOPXiaJun.Study.Admin_Test1.Models;

namespace OOPXiaJun.Study.Admin_Test1.Controllers
{
    [Filter.GlobalExceptionAttribute]
    [Filter.LoginActionFilterAttribut]
    [Filter.GlobalActionFilterAttribute]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Frame1()
        {
            return View();
        }
        public IActionResult Frame2()
        {
            return View();
        }
        public IActionResult Frame3()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
        public IActionResult Welcome()
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
