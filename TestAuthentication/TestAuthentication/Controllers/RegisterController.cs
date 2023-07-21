using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TestAuthentication.Models;

namespace TestAuthentication.Controllers
{
    public class RegisterController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        [BindProperty]
        public Register Model { get; set; }
        public RegisterController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            this._userManager = userManager;
            this._signInManager = signInManager;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> IndexAsync()
        {
            if(ModelState.IsValid)
            {
                var user = new IdentityUser()
                {
                    UserName = Model.UserName
                };
                var result =  await _userManager.CreateAsync(user, Model.Password);
                if(result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, false);
                    return Redirect("~/Home/Index");
                }
                foreach(var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }
            }
            return View();
        }
    }
}
