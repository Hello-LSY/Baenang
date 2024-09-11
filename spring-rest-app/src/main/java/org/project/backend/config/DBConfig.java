package org.project.backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.Properties;

/**
 * 데이터베이스 설정을 관리하는 클래스.
 * JPA, 트랜잭션 관리, 데이터 소스 설정을 포함한다.
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "org.project.backend.repository")
@PropertySource("classpath:application.properties")
public class DBConfig {

    /**
     * 엔티티 매니저 팩토리를 설정하고 Hibernate 관련 속성을 추가한다.
     *
     * @param dataSource 데이터 소스 (HikariCP)
     * @param ddlAuto hibernate.ddl-auto 설정 값 (application.properties에서 읽어옴)
     * @param dialect hibernate.dialect 설정 값 (application.properties에서 읽어옴)
     * @return LocalContainerEntityManagerFactoryBean 객체
     */
    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource,
                                                                       @Value("${spring.jpa.hibernate.ddl-auto}") String ddlAuto,
                                                                       @Value("${spring.jpa.properties.hibernate.dialect}") String dialect) {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("org.project.backend.model"); // 엔티티가 위치한 패키지
        em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());

        // Hibernate 설정 추가
        Properties properties = new Properties();
        properties.setProperty("hibernate.hbm2ddl.auto", ddlAuto);
        properties.setProperty("hibernate.dialect", dialect);
        em.setJpaProperties(properties);

        return em;
    }

    /**
     * HikariCP를 이용한 데이터 소스를 설정한다.
     * MySQL 데이터베이스에 연결되며, 연결 풀의 최대 크기는 10으로 설정된다.
     * HikariCP를 쓰는 이유 : https://github.com/brettwooldridge/HikariCP-benchmark
     *
     * @return DataSource 객체 (HikariDataSource)
     */
    @Bean
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setJdbcUrl("jdbc:mysql://localhost:3306/baenang");
        config.setUsername("root");
        config.setPassword("1234");
        config.setMaximumPoolSize(10); // 최대 커넥션 풀 크기
        return new HikariDataSource(config);
    }

    /**
     * 트랜잭션 매니저를 설정한다.
     * EntityManagerFactory를 통해 JPA 트랜잭션을 관리한다.
     *
     * @param entityManagerFactory 엔티티 매니저 팩토리
     * @return PlatformTransactionManager 객체
     */
    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory);
        return transactionManager;
    }
}
