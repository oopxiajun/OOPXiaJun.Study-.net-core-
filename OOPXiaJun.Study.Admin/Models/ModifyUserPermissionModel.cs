using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OOPXiaJun.Study.Admin.Models
{
    public class ModifyUserPermissionModel
    {
        public IList<string> UserPids { get; set; }
        public IList<string> PermissionPids { get; set; }
    }
}
