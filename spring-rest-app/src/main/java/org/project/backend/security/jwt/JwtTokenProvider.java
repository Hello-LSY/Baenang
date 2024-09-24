package org.project.backend.security.jwt;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenProvider {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);  // 로거 추가

    private final String JWT_SECRET = "your-secret-key"; // 비밀 키
    private final long JWT_EXPIRATION_MS = 604800000L; // 7일

    // JWT 토큰 생성
    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION_MS);

        return Jwts.builder()
                .setSubject(userDetails.getUsername()) // 사용자 이름
                .setIssuedAt(new Date()) // 토큰 발행 시간
                .setExpiration(expiryDate) // 토큰 만료 시간
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET) // 알고리즘과 시크릿 키
                .compact();
    }

    // JWT 토큰에서 사용자 이름 추출
    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(JWT_SECRET)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    // JWT 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(JWT_SECRET).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException ex) {
            // 토큰 만료된 경우 처리
            logger.error("Expired JWT token", ex);
        } catch (Exception ex) {
            // 일반적인 토큰 검증 오류 처리
            logger.error("Invalid JWT token", ex);
        }
        return false;
    }
}
