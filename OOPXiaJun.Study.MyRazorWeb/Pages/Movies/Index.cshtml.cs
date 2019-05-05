using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using OOPXiaJun.Study.MyRazorWeb.Model;
using OOPXiaJun.Study.MyRazorWeb.Models;

namespace OOPXiaJun.Study.MyRazorWeb.Pages.Movies
{
    public class IndexModel : PageModel
    {
        private readonly OOPXiaJun.Study.MyRazorWeb.Models.OOPXiaJunStudyMyRazorWebContext _context;

        public IndexModel(OOPXiaJun.Study.MyRazorWeb.Models.OOPXiaJunStudyMyRazorWebContext context)
        {
            _context = context;
        }

        public IList<Movie> Movie { get;set; }

        public async Task OnGetAsync()
        {
            Movie = await _context.Movie.ToListAsync();
        }
    }
}
