using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OOPXiaJun.Study.MyRazorWeb.Model;

namespace OOPXiaJun.Study.MyRazorWeb.Models
{
    public class OOPXiaJunStudyMyRazorWebContext : DbContext
    {
        public OOPXiaJunStudyMyRazorWebContext (DbContextOptions<OOPXiaJunStudyMyRazorWebContext> options)
            : base(options)
        {
        }

        public DbSet<OOPXiaJun.Study.MyRazorWeb.Model.Movie> Movie { get; set; }
    }
}
