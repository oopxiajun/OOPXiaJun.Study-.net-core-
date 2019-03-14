using System;
using System.Collections.Generic;
using System.Text;

namespace OOPXiaJun.Study.AsyncAwait
{
    /// <summary>
    /// 索引器接口
    /// </summary>
    interface MyIndexer<T>
    {
        T this[int index]
        {
            get;
            set;
        }
    }
}
