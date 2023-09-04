namespace serverside_asp.Models;

public class User
{
    public string? username { get; set; }
    public string? password { get; set; }

    public User() {
        username = null;
        password = null;
    }
}
