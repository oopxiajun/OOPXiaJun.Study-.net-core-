using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using OOPXiaJun.Study.Admin_Test1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace OOPXiaJun.Study.Admin_Test1.Filter
{
    /// <summary>
    /// 登录验证（每个非登录Controller 都需要加上这个）
    /// </summary>
    public class LoginActionFilterAttribut:ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var result = filterContext.HttpContext.Session.Get<string>(Constant.UserSessionKey);
             

            if (result == null)
            {
                Type type = filterContext.ActionDescriptor.GetType();
                MethodInfo mi = (MethodInfo)type.GetProperty("MethodInfo").GetValue(filterContext.ActionDescriptor);
                if (mi.ReturnType.IsEquivalentTo(typeof(IActionResult)))
                {
                    filterContext.Result = new RedirectResult("/Login");
                    return;
                }
                else if (mi.ReturnType.IsEquivalentTo(typeof(JsonResult)))
                {
                    throw new LoginException("登录过期，请重新登录！");
                }
                else {
                    throw new LoginException("非法访问");
                }
            }

            //可记录 每次请求的参数 和返回的参数
            base.OnActionExecuting(filterContext);
        }
    }
}
