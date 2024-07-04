package com.example.serversidejsp.servlet;

import java.io.*;
import java.util.Arrays;
import java.util.Objects;
import java.util.Optional;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "rootServlet", value = "")
public class RootServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        Optional<Cookie> cookie = Arrays.stream(request.getCookies()).filter(x -> Objects.equals(x.getName(), "user")).findFirst();

        if(cookie.isEmpty()) {
            response.sendRedirect("/login");
            return ;
        }

        request.setAttribute("user", cookie.get().getValue());
        request.getRequestDispatcher("index.jsp").include(request, response);
    }
}