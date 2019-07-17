using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using OOPXiaJun.Study.Admin_Test1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OOPXiaJun.Study.Admin_Test1.Filter
{
    /// <summary>
    /// 全局请求过滤（每个Controller都需要加上这个标记）
    /// </summary>
    public class GlobalActionFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            //可记录 每次请求的参数 和返回的参数
            base.OnActionExecuting(filterContext);
        }


        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            //重新组装返回值（按AJAX规范）

            if (filterContext.Exception != null)
            {
                //出现异常时返回
                filterContext.Result = this.CreateExceptionResult(filterContext.Exception);
                filterContext.ExceptionHandled = true;
            }
            else
            {
                if (filterContext.Result is JsonResult)
                {
                    var result = (JsonResult)filterContext.Result;
                    result.Value = new
                    {
                        Status = true,
                        Data = result.Value,
                        Error=""
                    };
                }
            }

            base.OnActionExecuted(filterContext);
        }

        /// <summary>
        /// 创建异常返回值
        /// </summary>
        /// <param name="ex">异常</param>
        /// <returns></returns>
        private JsonResult CreateExceptionResult(Exception ex)
        {
            //写入日志  
            JsonResult result = new JsonResult(ex);
            if (ex is LoginException)
            {
                var loginException = (LoginException)ex;
                result.Value = new
                {
                    Status = false,
                    Data=new object(),
                    ErrorMessage = ex.Message
                };
            }
            else
            {
                result.Value = new
                {
                    Status = false,
                    Data = new object(),
                    ErrorMessage = ex.Message
                };
            }

            return result;
        }
    }

    /*
     * 全局错误码【ErrorCode】
     * 0:ok
     * 1:登录失败
     * 2:
     **/
}
