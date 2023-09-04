using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using serverside_asp.Models;

namespace serverside_asp.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        String? authCookie = Request.Cookies["user"];
        if(authCookie == null) {
            return Redirect("/Login");
        }
        ViewData["user"] = authCookie;
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
