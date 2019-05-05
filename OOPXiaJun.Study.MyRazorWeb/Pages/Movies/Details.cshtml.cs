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
    public class DetailsModel : PageModel
    {
        private readonly OOPXiaJun.Study.MyRazorWeb.Models.OOPXiaJunStudyMyRazorWebContext _context;

        public DetailsModel(OOPXiaJun.Study.MyRazorWeb.Models.OOPXiaJunStudyMyRazorWebContext context)
        {
            _context = context;
        }

        public Movie Movie { get; set; }

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            Movie = await _context.Movie.FirstOrDefaultAsync(m => m.ID == id);

            if (Movie == null)
            {
                return NotFound();
            }
            return Page();
        }
    }
}
