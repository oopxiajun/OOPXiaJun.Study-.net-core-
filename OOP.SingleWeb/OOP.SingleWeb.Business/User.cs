using Microsoft.EntityFrameworkCore;
using OOP.SingleWeb.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace OOP.SingleWeb.Business
{
    public class User : BusinessRule
    {
        private DbSet<UserEntity> _userDbSet;
        public User(BusinessRuleContext businessRuleContext) : base(businessRuleContext)
        { 

        }

        public void Insert(UserEntity entity)
        {
            _userDbSet.Add(entity);
        }
    }
}
