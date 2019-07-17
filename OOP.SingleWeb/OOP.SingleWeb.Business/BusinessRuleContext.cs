using System;
using System.Collections.Generic;
using System.Text;

namespace OOP.SingleWeb.Business
{
    /// <summary>
    /// 代表业务层操作上下文
    /// </summary>
    public class BusinessRuleContext
    {
        /// <summary>
        /// 当前操作的用户
        /// </summary>
        private readonly string _operatingUser;

        /// <summary>
        /// 获取当前操作的用户
        /// </summary>
        public virtual string OperatingUser => _operatingUser;

        /// <summary>
        /// 获取当前的操作时间
        /// </summary>
        public virtual DateTime OperatingTime => DateTime.Now;

        /// <summary>
        ///  使用指定设置来初始化 .BusinessRuleContext 类实例
        /// 
        /// </summary>
        /// <param name="operatingUser">当前操作的用户</param> 
        public BusinessRuleContext(string operatingUser)
        { 
            _operatingUser = operatingUser;
        }
    }
}
