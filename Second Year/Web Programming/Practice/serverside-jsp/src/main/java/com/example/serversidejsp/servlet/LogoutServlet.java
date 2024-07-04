package com.example.serversidejsp.servlet;

import com.example.serversidejsp.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(name = "logoutServlet", value = "/logout")
public class LogoutServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Cookie authCookie = new Cookie("user", "");
        authCookie.setPath("/");
        authCookie.setMaxAge(0);
        resp.addCookie(authCookie);
        resp.sendRedirect("/");
    }
}
