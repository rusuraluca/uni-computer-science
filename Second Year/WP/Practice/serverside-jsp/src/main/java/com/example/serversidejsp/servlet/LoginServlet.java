package com.example.serversidejsp.servlet;

import com.example.serversidejsp.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(name = "loginServlet", value = "/login")
public class LoginServlet extends HttpServlet {
    UserRepository userRepository;

    @Override
    public void init() throws ServletException {
        super.init();
        userRepository = UserRepository.getInstance();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getRequestDispatcher("login.jsp").include(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        if(username == null || password == null || userRepository.getUserByUsernameAndPassword(username, password) == null) {
            req.setAttribute("error", "Invalid username or password");
            req.getRequestDispatcher("login.jsp").include(req, resp);
            return ;
        }
        Cookie authCookie = new Cookie("user", username);
        authCookie.setPath("/");
        resp.addCookie(authCookie);
        resp.sendRedirect("/");
    }
}
