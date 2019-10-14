using SqlSugar;
using System;
using System.Collections.Generic;
using System.Text;

namespace SqlSugarDemo.ORM
{
    public class SqlSugarBase
    {

        public void a() {
            DB.IgnoreColumns = new IgnoreColumnList() { 
            
            };
        }
        public static string DB_ConnectionString { get; set; }

        public static SqlSugarClient DB
        {
            get => new SqlSugarClient(new ConnectionConfig()
            {
                ConnectionString = DB_ConnectionString,
                DbType = DbType.MySql,
                IsAutoCloseConnection = true,
                InitKeyType = InitKeyType.SystemTable,
                IsShardSameThread = true,  
            }
            );
        }


    }
}
