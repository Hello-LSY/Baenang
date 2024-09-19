package org.project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.BusinessCardDTO;
import org.project.backend.dto.MemberDTO;
import org.project.backend.model.Member;
import org.project.backend.service.BusinessCardService;
import org.project.backend.service.MemberService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class TestController {

    private final BusinessCardService businessCardService;
    private final MemberService memberService;  // MemberService 추가

    // 루트 경로("/")로 접속 시 호출되는 메서드
    @GetMapping("/")
    public String home(Model model, Principal principal) {
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
        return "login"; // "login.jsp"로 이동
    }

    // "/register" 경로로 접속 시 회원가입 페이지로 이동
    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("memberDTO", new MemberDTO());
        return "register"; // "register.jsp"로 이동
    }

    // "/business-card/{memberId}" 경로로 명함 정보를 확인하는 메서드 추가
    @GetMapping("/business-card/{memberId}")
    public String showBusinessCard(@PathVariable Long memberId, Model model) {
        BusinessCardDTO businessCardDTO = businessCardService.getBusinessCardByMemberId(memberId);
        model.addAttribute("businessCard", businessCardDTO);
        return "businessCard"; // "businessCard.jsp"로 이동
    }

    // 명함 등록 폼을 제공하는 메서드
    @GetMapping("/business-card/create")
    public String showBusinessCardForm(Model model) {
        model.addAttribute("businessCardDTO", new BusinessCardDTO());
        return "businessCardForm"; // businessCardForm.jsp로 이동
    }

    // 명함 저장을 처리하는 메서드
    @PostMapping("/business-card/save")
    public String saveBusinessCard(@ModelAttribute("businessCardDTO") BusinessCardDTO businessCardDTO, Principal principal) {
        if (principal != null) {
            // username을 이용해 Member를 조회하여 ID를 가져옴
            Member member = memberService.findByUsername(principal.getName());
            if (member != null) {
                // 명함 저장 로직 수행
                businessCardService.createBusinessCard(member.getId(), businessCardDTO);
                return "redirect:/business-card/" + member.getId(); // 저장 후 명함 상세 페이지로 리다이렉트
            }
        }
        return "redirect:/login"; // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    }
}
