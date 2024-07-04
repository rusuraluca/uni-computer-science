using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using serverside_asp.Models;
using serverside_asp.Repository;
using System;
using System.Web;

namespace serverside_asp.Controllers;

public class LoginController : Controller
{
    private readonly ILogger<LoginController> _logger;
    private readonly UserRepository _userRepository;

    public LoginController(ILogger<LoginController> logger, UserRepository userRepository)
    {
        _logger = logger;
        _userRepository = userRepository;
    }
    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    [ActionName("Index")]
    public IActionResult Post(String username, String password) {
        User repoUser;
        try{
            repoUser = _userRepository.users
            .Where(e => e.username.Equals(username))
            .Where(e => e.password.Equals(password))
            .First();
        } catch(InvalidOperationException) {
            ViewData["error"] = "Invalid user or password";
            return View();
        }  
        Response.Cookies.Append("user", username);
        return Redirect("/");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
