﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OOPXiaJun.Study.Admin.Models
{
    public class SubmitResetPasswordModel
    {
        public string OldPwd { get; set; }
        public string NewPwd { get; set; }
        public string NewConfirmPwd { get; set; }
    }
}
