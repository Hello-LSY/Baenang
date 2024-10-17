package org.project.backend.security.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

@Component
public class JwtTokenProvider {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    // 외부 설정에서 JWT 시크릿 키와 만료 시간 가져오기
    @Value("${jwt.secret}")
    private String JWT_SECRET;

    @Value("${jwt.expirationMs}")
    private long JWT_EXPIRATION_MS;

    // JWT 토큰 생성
    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION_MS);

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
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
            logger.error("Expired JWT token", ex);
        } catch (Exception ex) {
            logger.error("Invalid JWT token", ex);
        }
        return false;
    }
}
