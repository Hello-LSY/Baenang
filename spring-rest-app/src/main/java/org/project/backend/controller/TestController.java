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
    private final MemberService memberService;

    @GetMapping("/")
    public String home(Model model, Principal principal) {
        model.addAttribute("message", "Welcome to baenang");

        // 로그인된 사용자 정보를 모델에 추가
        if (principal != null) {
            model.addAttribute("principal", principal);
        }

        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("memberDTO", new MemberDTO());
        return "register";
    }

    @GetMapping("/business-card/{memberId}")
    public String showBusinessCard(@PathVariable Long memberId, Model model) {
        BusinessCardDTO businessCardDTO = businessCardService.getBusinessCardByMemberId(memberId);
        model.addAttribute("businessCard", businessCardDTO);
        return "businessCard";
    }


    @GetMapping("/business-card/create")
    public String showBusinessCardForm(Model model, Principal principal) {
        if (principal != null) {
            // 로그인된 사용자의 정보를 이용해 Member를 조회
            Member member = memberService.findByUsername(principal.getName());
            if (member != null) {
                model.addAttribute("businessCardDTO", new BusinessCardDTO());
                model.addAttribute("memberId", member.getId()); // memberId를 모델에 추가
                return "businessCardForm";
            }
        }
        return "redirect:/login";
    }


    @PostMapping("/business-card/save")
    public String saveBusinessCard(@ModelAttribute("businessCardDTO") BusinessCardDTO businessCardDTO, Principal principal) {
        if (principal != null) {
            // 로그인된 사용자의 정보를 이용해 Member를 조회
            Member member = memberService.findByUsername(principal.getName());
            if (member != null) {
                try {
                    // 명함 저장
                    businessCardService.createBusinessCard(member.getId(), businessCardDTO);
                    return "redirect:/business-card/" + member.getId(); // 명함 상세 페이지로 리다이렉트
                } catch (RuntimeException e) {
                    e.printStackTrace(); // 런타임 예외 처리
                    return "error"; // 예외 발생 시 에러 페이지로 리다이렉트 (또는 다른 경로 설정)
                } catch (Exception e) {
                    e.printStackTrace(); // 기타 예외 처리
                    return "error"; // 예외 발생 시 에러 페이지로 리다이렉트 (또는 다른 경로 설정)
                }
            }
        }
        return "redirect:/login";
    }

}
