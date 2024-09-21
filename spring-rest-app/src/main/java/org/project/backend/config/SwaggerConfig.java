package org.project.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2) // Swagger 2.0 사용
                .select()
                .apis(RequestHandlerSelectors.basePackage("org.project.backend.controller")) // API 문서를 생성할 패키지 지정
                .paths(PathSelectors.any())
                .build()
                .apiInfo(apiInfo())
                .useDefaultResponseMessages(false); // 기본 응답 메시지 사용 여부
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("Baenang API Documentation")
                .description("Baenang 프로젝트의 API 문서")
                .version("2.0") // API 버전 설정
                .contact(new Contact("Baenang Team", "http://example.com", "support@example.com")) // 연락처 정보 추가
                .build();
    }
}
