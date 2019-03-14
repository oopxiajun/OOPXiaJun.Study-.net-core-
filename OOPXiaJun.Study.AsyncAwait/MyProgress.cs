using System;
using System.Collections.Generic;
using System.Text;

namespace OOPXiaJun.Study.AsyncAwait
{
    public class MyProgress : IProgress<MyMessage>
    {
        public void Report(MyMessage value)
        {
            throw new NotImplementedException();
        }
    }
}
