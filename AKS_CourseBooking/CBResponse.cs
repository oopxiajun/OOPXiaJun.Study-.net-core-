using System;
using System.Collections.Generic;
using System.Text;

namespace AKS_CourseBooking
{
    /// <summary>
    /// 预约返回结果
    /// </summary>
    //{"code":0,"msg":null,"value":{"result":false,"msg":"对不起！该时间点已被预订，请重新选择时间！"}}
    public class CBResponse
    {
        public int code { get; set; }
        public string msg { get; set; }
        public CBResponse_Value value { get; set; } 
    }
    public class CBResponse_Value
    {
        public bool result { get; set; }
        public string msg { get; set; }
    }
}
