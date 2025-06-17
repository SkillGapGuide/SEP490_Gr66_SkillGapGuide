package com.skillgapguide.sgg.Controller;

import com.skillgapguide.sgg.Response.EHttpStatus;
import com.skillgapguide.sgg.Response.Response;
import com.skillgapguide.sgg.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private UserService userService;
    @GetMapping("/getAllUser")
    public Response<?> getAllUserList(@RequestParam(defaultValue = "0") Integer pageNo,
                                      @RequestParam(defaultValue = "10") Integer pageSize){
        return new Response<>(EHttpStatus.OK, userService.getAllUser(pageNo,pageSize));
    }
    @PostMapping("/disableAccount/{email}")
    public  Response<?> disableAcc(@PathVariable String email){
        return new Response<>(EHttpStatus.OK,userService.disableAccount(email));
    }
    @PostMapping("/enableAccount/{email}")
    public  Response<?> enableAcc(@PathVariable String email){
        return new Response<>(EHttpStatus.OK,userService.enableAccount(email));
    }
}
