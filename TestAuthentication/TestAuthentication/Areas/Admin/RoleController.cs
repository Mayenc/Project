using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TestAuthentication.Models;

namespace TestAuthentication.Areas.Admin
{
    public class RoleController : Controller
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly AuthDbContext _context;
        public RoleController(RoleManager<IdentityRole> roleManager, AuthDbContext context)
        {
            _roleManager = roleManager;
            _context = context;
        }
        [TempData]
        public string StatusMessage { get; set; }
        public IActionResult Index()
        {
            return View();
        }
    }
}
