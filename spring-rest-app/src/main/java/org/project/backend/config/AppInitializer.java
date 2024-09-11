package org.project.backend.config;

import org.springframework.web.filter.DelegatingFilterProxy;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import javax.servlet.Filter;

/**
 * Web 애플리케이션의 초기 설정을 담당하는 클래스.
 * DispatcherServlet과 RootContext 설정을 구성하고, 필요한 필터를 설정한다.
 */
public class AppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

    /**
     * Root 애플리케이션 컨텍스트 설정 클래스를 반환.
     * 주로 보안 설정(SecurityConfig)과 DB 설정(DBConfig)을 포함.
     *
     * @return Root 애플리케이션 컨텍스트에 로드할 설정 클래스 배열
     */
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[]{DBConfig.class, SecurityConfig.class};
    }

    /**
     * 서블릿 애플리케이션 컨텍스트 설정 클래스를 반환.
     * WebMvcConfig와 같은 웹 관련 설정을 포함.
     *
     * @return 서블릿 애플리케이션 컨텍스트에 로드할 설정 클래스 배열
     */
    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[]{WebMvcConfig.class};
    }

    /**
     * DispatcherServlet이 매핑될 URL 패턴을 지정.
     * 여기서는 모든 요청을 DispatcherServlet으로 매핑.
     *
     * @return 서블릿 매핑을 위한 URL 패턴 배열
     */
    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

    /**
     * 서블릿 필터를 설정.
     * springSecurityFilterChain을 통해 보안 관련 필터링을 처리.
     *
     * @return 필터 배열
     */
    @Override
    protected Filter[] getServletFilters() {
        return new Filter[]{new DelegatingFilterProxy("springSecurityFilterChain")};
    }
}
