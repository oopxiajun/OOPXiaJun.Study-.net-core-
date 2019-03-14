using System;
using System.Collections.Generic;
using System.Text;

namespace OOPXiaJun.Study.Indexer
{
    public class MyIndexerImp<D, T> : MyIndexer<D, T>
    {
        private Dictionary<D, T> list = new Dictionary<D, T>();

        public T this[D index]
        {
            get
            {

                return list[index];
            }
            set => list[index] = value;
        }
    }
}
