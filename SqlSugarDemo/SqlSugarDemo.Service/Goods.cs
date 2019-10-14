using System;
using System.Collections.Generic;
using SqlSugarDemo.ORM.Entities;
namespace SqlSugarDemo.Service
{
    public class Goods:SqlSugarDemo.ORM.SqlSugarBase
    {
        public List<ORM.Entities.Goods> GetList()
        {
            return DB.Queryable<ORM.Entities.Goods>().ToList();
        }
    }
}
