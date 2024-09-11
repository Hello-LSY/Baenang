# 1. 베이스 이미지로 JDK 17 사용
FROM openjdk:17-jdk-slim

# 2. 프로젝트의 WAR 파일을 Docker 이미지에 복사
COPY build/libs/backend.war /app/backend.war

# 3. 작업 디렉토리 설정
WORKDIR /app

# 4. 애플리케이션을 실행
ENTRYPOINT ["java", "-jar", "backend.war"]

# 5. 컨테이너가 외부에서 접근할 수 있는 포트 설정
EXPOSE 8080
