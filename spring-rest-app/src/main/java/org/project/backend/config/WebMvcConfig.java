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
        configuration.addAllowedOrigin("http://example.com");  // 특정 도메인 허용
        configuration.addAllowedMethod("GET");  // GET 메소드 허용
        configuration.addAllowedMethod("POST");  // POST 메소드 허용
        configuration.addAllowedHeader("*");  // 모든 헤더 허용
        configuration.setAllowCredentials(true); // 자격 증명 허용
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
        // /resources/** 경로에 대한 정적 자원 핸들링
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("/resources/")
                .setCachePeriod(3600);  // 1시간 마다 캐시

        // /static/** 경로에 대한 정적 자원 핸들링
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}
