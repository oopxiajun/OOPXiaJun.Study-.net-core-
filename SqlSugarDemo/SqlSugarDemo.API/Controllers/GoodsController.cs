using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Text.Json;

namespace SqlSugarDemo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoodsController : ControllerBase
    {
        public JsonResult GetGoods()
        {
            SqlSugarDemo.Service.Goods goods = new Service.Goods();
            var list = goods.GetList();

            return new JsonResult(list);
        }
    }
}