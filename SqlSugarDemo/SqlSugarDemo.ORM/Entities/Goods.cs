using SqlSugar;
using System;
using System.Collections.Generic;
using System.Text;

namespace SqlSugarDemo.ORM.Entities
{
    [SqlSugar.SugarTable("Goods")]
    public class Goods
    {
        public Int32 Id { get; set; }
        public string Name { get; set; }
        public Double Price { get; set; }
        public string Picture { get; set; }
        [SugarColumn(ColumnName = "Picture")]
        public string HeadImag { get; set; }
    }
}
