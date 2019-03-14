using System;
using System.Collections.Generic;
using System.Text;

namespace OOPXiaJun.Study.Indexer
{
    /// <summary>
    /// 索引器接口
    /// </summary>
    interface MyIndexer<D,T>
    {
        T this[D index]
        {
            get;
            set;
        }
    }
}
