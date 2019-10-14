using System;
using System.Collections.Generic;
using System.Text;

namespace AKS_CourseBooking
{
    public class Teacher
    {
        public string TUID { get; set; }
        public string Name { get; set; }
        public Teacher(string tuid, string name) => (TUID, Name) = (tuid,name);
    }
}
