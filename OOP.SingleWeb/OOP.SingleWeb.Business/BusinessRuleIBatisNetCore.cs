using IBatisNet.Common;
using IBatisNet.DataMapper;
using IBatisNet.DataMapper.Configuration; 
using IBatisNet.DataMapper.SessionStore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Transactions;

namespace OOP.SingleWeb.Business
{
    public class BusinessRuleIBatisNetCore
    {
        private static readonly object DaoManagerLock = new object();

        //
        // 摘要:
        //     DAO管理器。
        private static ISqlMapper _sqlMapper;

        //
        // 摘要:
        //     操作上下文。
        private readonly BusinessRuleContext _context;

        //
        // 摘要:
        //     /// 获取DAO管理器。 ///
        protected static ISqlMapper SqlMapper
        {
            get
            {
                //IL_007e: Unknown result type (might be due to invalid IL or missing references)
                //IL_0088: Expected O, but got Unknown
                if (_sqlMapper == null)
                {
                    lock (DaoManagerLock)
                    {
                        if (_sqlMapper == null)
                        {

                            new IBatisNet.DataMapper.Configuration.DomSqlMapBuilder().ConfigureAndWatch("Dao.config", ResetDaoManager);
                            _sqlMapper = IBatisNet.DataMapper.Mapper.Instance();//  .GetInstance();
                            _sqlMapper.SessionStore = new IBatisNet.DataMapper.SessionStore.ThreadSessionStore(_sqlMapper.Id);
                            ISqlMapSession sqlMapDaoSession = _sqlMapper.LocalSession;
                            if (sqlMapDaoSession != null)
                            {
                                ISqlMapper sqlMap = sqlMapDaoSession.SqlMapper;
                                //sqlMap.SessionStore.Store(new IBatisNet.DataMapper.SessionStore.ThreadSessionStore(sqlMap.Id));
                            }
                        }
                    }
                }
                return _sqlMapper;
            }
        }

        //
        // 摘要:
        //     /// 获取当前操作上下文。 ///
        protected virtual BusinessRuleContext Context => _context;

        //
        // 摘要:
        //     /// 使用指定设置来初始化 IsFrame.BP.Business.BusinessRule 类实例。 ///
        //
        // 参数:
        //   context:
        //     操作上下文。不可为空。
        protected BusinessRuleIBatisNetCore(BusinessRuleContext context)
        {
            _context = context;
        }

        //
        // 摘要:
        //     /// 重置DAO管理器。 ///
        //
        // 参数:
        //   obj:
        private static void ResetDaoManager(object obj)
        {
            lock (DaoManagerLock)
            {
                _sqlMapper = null;
            }
        }

        //
        // 摘要:
        //     /// 获得指定类型的DAO对象。 ///
        //
        // 参数:
        //   daoInterface:
        //     DAO接口类型。
        //
        // 返回结果:
        //     指定类型的DAO对象。
        protected static IDao GetDao(Type daoInterface)
        { 
            return SqlMapper.GetDao(daoInterface);
        }

        //
        // 摘要:
        //     /// 获得指定类型的DAO对象。 ///
        //
        // 类型参数:
        //   T:
        //     DAO接口类型。
        //
        // 返回结果:
        //     指定类型的DAO对象。
        protected static T GetDao<T>()
        {
            return (T)SqlMapper.GetDao(typeof(T));
        }

        //
        // 摘要:
        //     /// 打开一个连接。 ///
        //
        // 返回结果:
        //     打开的连接。
        protected virtual IDalSession OpenConnection()
        {
            return SqlMapper.OpenConnection();
        }

        //
        // 摘要:
        //     /// 关闭打开的连接。 ///
        protected virtual void CloseConnection()
        {
            SqlMapper.CloseConnection();
        }

        //
        // 摘要:
        //     /// 开始一个事务。 ///
        //
        // 返回结果:
        //     开启的事务。
        protected virtual IDalSession BeginTransaction()
        {
            return SqlMapper.BeginTransaction();
        }

        //
        // 摘要:
        //     /// 开始一个事务。 ///
        //
        // 参数:
        //   isolationLevel:
        //     事务的隔离级别。
        //
        // 返回结果:
        //     开启的事务。
        protected virtual IDalSession BeginTransaction(IsolationLevel isolationLevel)
        {
            return SqlMapper.BeginTransaction(isolationLevel);
        }

        //
        // 摘要:
        //     /// 提交一个事务。 ///
        //
        // 言论：
        //     提交事务成功后将自动关闭连接。
        protected virtual void CommitTransaction()
        {
            SqlMapper.CommitTransaction();
        }

        //
        // 摘要:
        //     /// 回滚一个事务。 ///
        //
        // 言论：
        //     回滚事务成功后将自动关闭连接。
        protected virtual void RollBackTransaction()
        {
            SqlMapper.RollBackTransaction();
        }
    }
}
