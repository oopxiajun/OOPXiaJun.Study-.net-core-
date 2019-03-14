 
using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace OOPXiaJun.Study.Docker_1
{
    /// <summary>
    /// Redis客户端
    /// </summary>
    public class RedisClient
    {
        private string connStr;
        private int databaseNo;
        public RedisClient(string connStr,int database=0)
        {
            this.connStr = connStr;
            this.databaseNo = database;
        }
         
        private IDatabase database;
        private ConnectionMultiplexer connection;
        private ConnectionMultiplexer Connection
        {
            get
            {
                if (this.connection == null || !this.connection.IsConnected)
                {
                    try
                    {
                        this.connection = ConnectionMultiplexer.Connect(this.connStr);
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                }
                return this.connection;
            }
        }
        private IDatabase DataBase
        {
            get
            {
                if (database == null)
                {
                    try
                    {
                        this.database = this.Connection.GetDatabase(this.databaseNo);
                    }
                    catch (Exception ex)
                    { 
                        throw;
                    }
                }
                return database;
            }
        }

        /// <summary>
        /// 设置缓存
        /// </summary>
        /// <typeparam name="T">对象类型</typeparam>
        /// <param name="key">缓存KEY</param>
        /// <param name="value">缓存对象</param>
        /// <param name="expiry">有效期</param>
        public void Set<T>(string key, T value, TimeSpan? expiry = null)
        {
            try
            {
                var valuejson = JsonConvert.SerializeObject(value);
                this.DataBase.StringSet(key, valuejson, expiry);
            }
            catch (Exception ex)
            { 
                throw ex;
            }
        }
        /// <summary>
        /// 获取缓存
        /// </summary>
        /// <typeparam name="T">对象类型</typeparam>
        /// <param name="key">缓存KEY</param>
        /// <returns>缓存对象</returns>
        public T Get<T>(string key)
        {
            try
            {
                var valuejson = this.DataBase.StringGet(key);
                return JsonConvert.DeserializeObject<T>(valuejson);
            }
            catch (Exception ex)
            { 
                return default(T);
            }
        }

        public void Remove(string key)
        {
            try
            {
                this.DataBase.KeyDelete(key);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// 分布式锁
        /// </summary>
        /// <param name="key">锁</param>
        /// <param name="expiry">生命期限</param>
        /// <returns></returns>
        public RedisLock Lock(string key, TimeSpan? expiry = null)
        {
            return new RedisLock(key, this.database, expiry);
        }

    }

    /// <summary>
    /// Redis分布式锁
    /// </summary>
    public class RedisLock : IDisposable
    { 
        private IDatabase redis = null;
        private RedisKey lockKey = default(RedisKey);
        private RedisValue lockToken = default(RedisValue);
        private TimeSpan expiry = default(TimeSpan);

        public RedisLock(string key, IDatabase redis, TimeSpan? expiry)
        {
            this.lockKey =$"Lock_{key}";
            this.lockToken = Guid.NewGuid().ToString("N");
            this.redis = redis;
            this.expiry = expiry ?? TimeSpan.FromSeconds(60);

            this.Lock();
        }


        /// <summary>
        /// 加锁
        /// </summary>
        private void Lock()
        {
            Random r = new Random();
            bool succeed = false;
            succeed = this.redis.LockTake(this.lockKey, this.lockToken, this.expiry);
            while (!succeed)
            {
                var sleepTime = r.Next(500);
                Thread.Sleep(sleepTime);
                succeed = this.redis.LockTake(this.lockKey, this.lockToken, this.expiry);
            }
        }

        /// <summary>
        /// 解锁
        /// </summary>
        private void Unlock()
        {
            this.redis.LockRelease(this.lockKey, this.lockToken);
        }

        public void Dispose()
        {
            this.Unlock();
        }
    }



    public class RedisServer
    {
        private static RedisClient redis;

        public static void SetServerConfig(string connStr, int database)
        {
            redis = new RedisClient(connStr, database);
        }


    }
}
