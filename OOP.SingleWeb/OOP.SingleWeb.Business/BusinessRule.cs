using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;

namespace OOP.SingleWeb.Business
{
    public abstract class BusinessRule
    {
        private static readonly object DbContextLock = new object();

        private static ModelBuilder modelBuilder;

        private readonly BusinessRuleContext _context;

        protected virtual BusinessRuleContext Context => _context;

        private static DbContext _dbContext;
        protected static DbContext DbContext
        {
            get
            {
                if (_dbContext == null)
                {
                    lock (DbContextLock)
                    {
                        DbContextOptions options = MySQLDbContextOptionsExtensions.UseMySQL(new DbContextOptionsBuilder(), "Datasource=127.0.0.1;port=3306;Database=xyy_taxserver;uid=test;pwd=1234@abc;charset=utf8;SslMode=Preferred;").Options;

                        _dbContext = new DbContext(options);                         
                    }
                }
                return _dbContext;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        protected BusinessRule(BusinessRuleContext context)
        {
            _context = context;
        }
         

        /// <summary>
        /// 开启事务
        /// </summary>
        /// <returns></returns>
        protected virtual IDbContextTransaction BeginTransaction()
        {
            return DbContext.Database.BeginTransaction();
        }
        /// <summary>
        /// 提交事务
        /// </summary>
        protected virtual void CommitTransaction()
        {
            DbContext.Database.CommitTransaction();
        }
        /// <summary>
        /// 回滚事务
        /// </summary>
        protected virtual void RollbackTransaction()
        {
            DbContext.Database.RollbackTransaction();
        }

    }
}
