using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OOPXiaJun.Study.Admin_Test1.Models
{
    public class ModifyUserPasswordModel
    {
        public List<string> userPids { get; set; }
        public string newPassword { get; set; }
        public string confirmNewPassword { get; set; }
    }
}
