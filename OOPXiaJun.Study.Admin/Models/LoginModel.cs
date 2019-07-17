using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OOPXiaJun.Study.Admin.Models
{
    public class LoginModel
    {  
        public string UserName { get; set; }
         
        public string Password { get; set; }

        public bool RememberMe { get; set; }

        public string VCode { get; set; } 
    } 
}
