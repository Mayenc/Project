using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TestAuthentication.Models;

namespace TestAuthentication.Controllers
{
    
    public class LoginController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        [BindProperty]
        public Login Model { get; set; }
        public LoginController(SignInManager<IdentityUser> signInManager)
        {
            this._signInManager = signInManager;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> IndexAsync(string returnUrl = null)
        {
            if(ModelState.IsValid)
            {
                var identityResult = await _signInManager.PasswordSignInAsync(Model.UserName, Model.Password, Model.RememberMe, false);
                if(identityResult.Succeeded)
                {
                    if(returnUrl == null || returnUrl == "/")
                    {
                        //if(Model.UserName == "ZandoCambodia")
                        //{
                            return RedirectToAction("Index", "Home");
                        //}
                        //else
                        //{
                        //    return RedirectToAction("Privacy", "Home");
                        //}
                    }
                    else
                    {
                        return Redirect(returnUrl);
                    }
                }
                ModelState.AddModelError("", "Username or Password incorrect");
            }
            return View();
        }
    }
}
