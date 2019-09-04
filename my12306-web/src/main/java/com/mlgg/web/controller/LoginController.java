package com.mlgg.web.controller;

import com.alibaba.dubbo.common.logger.Logger;
import com.alibaba.dubbo.common.logger.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping(value = "/login")
public class LoginController {

    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
    @GetMapping(value = "/codeLogin")
    public int codeLogin(@RequestParam("username") String username, @RequestParam("password") String password){
        logger.debug("codeLogin,username:"+username+",password:"+password);
        HashMap<String, String> user = new HashMap<>();
        user.put(username, password);
        return 1;
    }
}
