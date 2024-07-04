using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using serverside_asp.Models;
using serverside_asp.Repository;
using System;
using System.Web;

namespace serverside_asp.Controllers;

public class LogoutController : Controller
{
    private readonly ILogger<LogoutController> _logger;
    private readonly UserRepository _userRepository;

    public LogoutController(ILogger<LogoutController> logger, UserRepository userRepository)
    {
        _logger = logger;
        _userRepository = userRepository;
    }
    [HttpPost]
    public IActionResult Index()
    {
        CookieOptions cookieOptions =  new CookieOptions();
        cookieOptions.MaxAge = System.TimeSpan.FromSeconds(0);
        Response.Cookies.Append("user", "", cookieOptions);
        return Redirect("/");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
