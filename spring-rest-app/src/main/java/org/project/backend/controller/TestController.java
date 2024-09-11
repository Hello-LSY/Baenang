package org.project.backend.controller;

import org.project.backend.dto.MemberDTO;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;

import java.security.Principal;

@Controller  // 프론트단 없이 테스트를 하기위해 만든 컨트롤러
public class TestController {

    /**
     * "index" 와 같이 설정해도 .jsp 까지 알아서 인식하는 이유?
     *  WebMvcConfig 클래스에 뷰 리졸버를 정의하여 파일과(Prefix) 확장자(suffix)가 알아서 인식되게끔 해줌
     *
     *
     */

    // 루트 경로("/")로 접속 시 호출되는 메서드
    @GetMapping("/")
    public String home(Model model, Principal principal) {
        // JSP 페이지에서 사용할 "message" 속성에 값을 추가
        model.addAttribute("message", "Welcome to baenang");

        // 로그인된 사용자 정보를 모델에 추가
        if (principal != null) {
            model.addAttribute("principal", principal);
        }

        // "index.jsp"로 이동
        return "index";
    }


    // "/login" 경로로 접속 시 로그인 페이지로 이동
    @GetMapping("/login")
    public String login() {
        // "login.jsp"로 이동
        return "login";
    }

    // "/register" 경로로 접속 시 회원가입 페이지로 이동
    @GetMapping("/register")
    public String register(Model model) {
        // 회원가입 폼에서 사용할 DTO 객체를 모델에 추가
        model.addAttribute("memberDTO", new MemberDTO());
        // "register.jsp"로 이동
        return "register";
    }


}
