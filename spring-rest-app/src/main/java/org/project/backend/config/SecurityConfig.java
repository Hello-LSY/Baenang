package org.project.backend.config;

import org.project.backend.security.MemberDetailsService;
import org.project.backend.security.handler.CustomAuthenticationFailureHandler;
import org.project.backend.security.handler.CustomAuthenticationSuccessHandler;
import org.project.backend.security.handler.CustomLogoutSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * 스프링 시큐리티 설정 클래스.
 * 사용자 인증, 인가, 패스워드 인코딩 및 CSRF 설정 등 포함
 */
@Configuration
@EnableWebSecurity
@ComponentScan(basePackages = "org.project.backend")
public class SecurityConfig {

    private final MemberDetailsService memberDetailsService;

    /**
     * MemberDetailsService 주입을 위한 생성자.
     * @param memberDetailsService 사용자 인증 정보를 관리하는 서비스
     */
    public SecurityConfig(MemberDetailsService memberDetailsService) {
        this.memberDetailsService = memberDetailsService;
    }

    /**
     * 스프링 5.7.0 이상부터는 WebSecurityConfigurerAdapter이 Deprecated되므로 필터체인으로 정의
     * CSRF 보호 비활성화, 경로 접근 제어, 로그인 및 인증 성공/실패 처리기를 설정
     *
     * @param http HttpSecurity 객체로 보안 필터 체인을 구성한다.
     * @return SecurityFilterChain 객체
     * @throws Exception 설정 중 발생하는 예외
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // REST API에서는 토큰 기반 인증을 사용하므로 CSRF 비활성화
                .csrf().disable()

                // 요청 경로에 따른 권한 설정
                .authorizeRequests()
                .antMatchers("/register", "/login", "/public/**", "/api/members/**").permitAll() // 특정 경로는 인증 불필요
                .anyRequest().authenticated() // 나머지 요청은 인증 필요
                .and()

                // 로그인 설정
                .formLogin()
                .loginPage("/login") // 로그인 페이지 설정
                .loginProcessingUrl("/perform_login") // 로그인 처리 URL
                .successHandler(new CustomAuthenticationSuccessHandler()) // 로그인 성공 처리 핸들러
                .failureHandler(new CustomAuthenticationFailureHandler()) // 로그인 실패 처리 핸들러
                .and()

                // 로그아웃 설정
                .logout()
                .logoutUrl("/logout") // 로그아웃 처리 URL
                .logoutSuccessHandler(new CustomLogoutSuccessHandler())
                .invalidateHttpSession(true) // 세션 무효화
                .deleteCookies("JSESSIONID"); // 쿠키 삭제

        return http.build();
    }

    /**
     * 패스워드 인코더 설정.
     * bcrypt와 pbkdf2 두 가지 인코딩 방식 지원.
     *
     * @return PasswordEncoder 객체
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        // 기본 bcrypt 인코딩 방식 사용
        String idForEncode = "bcrypt";
        Map<String, PasswordEncoder> encoders = new HashMap<>();
        encoders.put("bcrypt", new BCryptPasswordEncoder()); // bcrypt 인코딩 지원
        encoders.put("pbkdf2", new Pbkdf2PasswordEncoder()); // pbkdf2 인코딩 지원

        return new DelegatingPasswordEncoder(idForEncode, encoders);
    }
}
