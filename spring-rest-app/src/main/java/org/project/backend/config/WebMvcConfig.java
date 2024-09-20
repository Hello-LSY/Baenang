package org.project.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

/**
 * Spring MVC 설정 클래스.
 * View Resolver, CORS 설정, 정적 자원 핸들링 등을 관리.
 */
@Configuration
@EnableWebMvc  // Spring MVC 설정을 활성화
@ComponentScan(basePackages = "org.project.backend")
@PropertySource("classpath:application.properties")
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * JSP 파일을 위한 뷰 리졸버 설정.
     * JSP 파일 경로와 확장자를 설정하며, 우선순위를 명시.
     *
     * @return InternalResourceViewResolver JSP 뷰 리졸버
     */
    @Bean
    public InternalResourceViewResolver viewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");  // JSP 파일 경로 설정
        resolver.setSuffix(".jsp");  // JSP 파일 확장자 설정
        resolver.setOrder(1);  // 우선순위 설정
        return resolver;
    }

    /**
     * CORS(Cross-Origin Resource Sharing) 설정을 정의.
     * 초기 설정 : 특정 도메인 및 메소드, 헤더에 대해 CORS를 허용하며, 자격 증명도 허용.
     *
     * @return CorsConfigurationSource CORS 설정 객체
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

//        // 도메인 설정 (React Native의 경우 localhost 혹은 10.0.2.2 사용)
//        configuration.addAllowedOrigin("http://localhost:3000");  // React Native의 경우 'localhost' 사용
//        configuration.addAllowedOrigin("http://10.0.2.2:3000");  // Android Emulator의 경우 10.0.2.2 사용
//
//        configuration.addAllowedMethod("GET");
//        configuration.addAllowedMethod("POST");
//        configuration.addAllowedMethod("PUT");
//        configuration.addAllowedMethod("DELETE");
//        configuration.addAllowedMethod("OPTIONS");  // Preflight 요청을 위해 OPTIONS 허용
//
//        configuration.addAllowedHeader("*");

        configuration.addAllowedOriginPattern("*"); // 모든 출처 허용 (필요시 나중에 특정 도메인만 허용)
        configuration.addAllowedMethod("*"); // 모든 HTTP 메소드 허용
        configuration.addAllowedHeader("*"); // 모든 헤더 허용
        configuration.setAllowCredentials(true);  // 자격 증명 허용 (토큰, 쿠키 등)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);  // 모든 경로에 대해 CORS 설정 적용
        return source;
    }


    /**
     * MVC 핸들러 매핑을 검사하기 위한 Introspector를 제공.
     *
     * @return HandlerMappingIntrospector 핸들러 매핑 검사기
     */
    @Bean
    public HandlerMappingIntrospector mvcHandlerMappingIntrospector() {
        return new HandlerMappingIntrospector();
    }

    /**
     * 정적 자원에 대한 핸들러를 등록.
     * /resources/** 경로와 /static/** 경로에 있는 정적 자원을 제공하며, 캐시 기간을 설정.
     *
     * @param registry ResourceHandlerRegistry 리소스 핸들러 레지스트리
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/resources/**")
                .addResourceLocations("/resources/")
                .setCachePeriod(3600);

        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");

        // 추가: C 드라이브에 저장된 이미지 경로를 정적 리소스로 설정
        registry.addResourceHandler("/images/qr/**")
                .addResourceLocations("file:///C:/upload/images/qr/")
                .setCachePeriod(3600); // 캐시 설정 (1시간)
    }

}
