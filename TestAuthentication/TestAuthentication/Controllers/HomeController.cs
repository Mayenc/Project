using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using TestAuthentication.Models;

namespace TestAuthentication.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly SignInManager<IdentityUser> _signInManager;

        public HomeController(ILogger<HomeController> logger, SignInManager<IdentityUser> signInManager)
        {
            _logger = logger;
            this._signInManager = signInManager;
        }
        [Authorize(Roles = "Admin")]
        public IActionResult Index()
        {
            return View();
        }


        //---------------------------------------------------------


        //[Authorize(Policy = "AllowAccept")]
        [Authorize(Roles = "Editor")]
        //[Authorize(Roles = "Admin")]
        public IActionResult Privacy()
        {
            return View();
        }


        //---------------------------------------------------------


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        [HttpGet]
        public IActionResult Logout()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> LogoutAsync() 
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "Login");
        }
        [HttpPost]
        public IActionResult DontLogoutAsync()
        {
            return RedirectToAction("Index", "Home");
        }
    }
}
