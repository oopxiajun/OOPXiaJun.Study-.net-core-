using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using OOPXiaJun.Study.MyRazorWeb.Model;
using OOPXiaJun.Study.MyRazorWeb.Models;

namespace OOPXiaJun.Study.MyRazorWeb.Pages.Movies
{
    public class CreateModel : PageModel
    {
        private readonly OOPXiaJun.Study.MyRazorWeb.Models.OOPXiaJunStudyMyRazorWebContext _context;

        public CreateModel(OOPXiaJun.Study.MyRazorWeb.Models.OOPXiaJunStudyMyRazorWebContext context)
        {
            _context = context;
        }

        public IActionResult OnGet()
        {
            return Page();
        }

        [BindProperty]
        public Movie Movie { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.Movie.Add(Movie);
            await _context.SaveChangesAsync();

            return RedirectToPage("./Index");
        }
    }
}