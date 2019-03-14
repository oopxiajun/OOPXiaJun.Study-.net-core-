using System;
using System.Collections.Generic;
using System.Text;

namespace OOPXiaJun.Study.AsyncAwait
{
    public class MyIndexerImp<T> : MyIndexer<T>
    {
        private List<T> list = new List<T>();

        public T this[int index] { get => list[index]; set => list[index] = value; }
    }
}
