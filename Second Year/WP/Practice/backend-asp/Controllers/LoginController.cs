using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using backend_asp.Models;
using backend_asp.Repository;

namespace backend_asp.Controllers;

public class LoginController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly UserRepository _userRepository;

    public LoginController(ILogger<HomeController> logger, UserRepository userRepository)
    {
        _logger = logger;
        _userRepository = userRepository;
    }

    [HttpPost]
    public IActionResult Index([FromBody] User user)
    {
        if(user.username == null || user.password == null) {
            return new ContentResult{
                Content = "",
                ContentType = "text/plain",
                StatusCode = 400
            };
        }

        User repoUser;
        try{
            repoUser = _userRepository.users
            .Where(e => e.username.Equals(user.username))
            .Where(e => e.password.Equals(user.password))
            .First();
        } catch(InvalidOperationException) {
            return new ContentResult{
                Content = "",
                ContentType = "text/plain",
                StatusCode = 401
            };
        }  

        return Json(new Dictionary<string, string>{
            {"token", repoUser.username}
        });

    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
