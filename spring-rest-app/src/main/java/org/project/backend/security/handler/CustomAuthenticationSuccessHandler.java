package org.project.backend.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.project.backend.model.Member; // Member 클래스 임포트
import org.project.backend.security.jwt.JwtTokenProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final JwtTokenProvider jwtTokenProvider;

    // JwtTokenProvider 주입
    public CustomAuthenticationSuccessHandler(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        // JWT 토큰 생성
        String token = jwtTokenProvider.generateToken(authentication);

        // UserDetails에서 사용자 정보 가져오기
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // UserDetails를 Member로 캐스팅하여 memberId 가져오기
        Member member = (Member) userDetails;
        Long memberId = member.getId(); // Member 엔티티의 id 필드

        // JSON 응답 작성
        Map<String, Object> jsonResponse = new HashMap<>();
        jsonResponse.put("message", "로그인 성공");
        jsonResponse.put("username", authentication.getName());
        jsonResponse.put("token", token); // 생성된 JWT 토큰 포함
        jsonResponse.put("memberId", memberId); // memberId 포함

        // 응답 설정
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write(objectMapper.writeValueAsString(jsonResponse));
    }
}
