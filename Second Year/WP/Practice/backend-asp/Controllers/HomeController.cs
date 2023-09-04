using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using backend_asp.Models;
using backend_asp.Repository;

namespace backend_asp.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly UserRepository _userRepository;

    public HomeController(ILogger<HomeController> logger, UserRepository userRepository)
    {
        _logger = logger;
        _userRepository = userRepository;
    }
    public IActionResult Index()
    {
        string? auth = Request.Headers["Authorization"];
        if(auth == null || !auth.StartsWith("Bearer ")) {
            return new ContentResult{
                Content = "",
                ContentType = "text/plain",
                StatusCode = 401
            };
        }
        string token = auth.Substring("Bearer ".Length);

        return new ContentResult {
            Content = "Succesfully logged in as " + token,
            ContentType = "text/plain",
            StatusCode = 200
        };
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
