using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OOPXiaJun.Study.Admin_Test1.Filter
{
    public class GlobalExceptionAttribute : ExceptionFilterAttribute
    {
        /// <summary>
        /// 全局异常验证
        /// </summary>
        /// <param name="context"></param>
        public override void OnException(ExceptionContext context)
        {
            //this.Logger.Error(context.Exception);
            //this.Logger.Error("Admin异常捕获：" + context.Exception.Message);
            base.OnException(context);
        }
    }
}
