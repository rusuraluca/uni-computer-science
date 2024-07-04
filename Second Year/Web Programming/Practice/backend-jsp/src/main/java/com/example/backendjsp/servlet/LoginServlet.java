package com.example.backendjsp.servlet;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

import com.example.backendjsp.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import model.User;

@WebServlet(name = "loginServlet", value = "/login")
public class LoginServlet extends HttpServlet {

    UserRepository userRepository;
    @Override
    public void init() throws ServletException {
        super.init();
        userRepository = UserRepository.getInstance();
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        super.doOptions(request, response);
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "*");
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "*");

        ObjectMapper objectMapper = new ObjectMapper();
        User user = objectMapper.readValue(request.getReader(), User.class);
        if(userRepository.getUserByUsernameAndPassword(user.getUsername(), user.getPassword()) == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return ;
        }

        Map<String, String> resultJson = new HashMap<>();
        resultJson.put("token", user.getUsername());

        PrintWriter out = response.getWriter();
        out.write(objectMapper.writeValueAsString(resultJson));
    }
}