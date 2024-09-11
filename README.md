

<div align="center">

![image](https://github.com/user-attachments/assets/34dc8c1e-7c10-4d53-9619-e9fa27104acd)


# 🌍 ✈️ 배낭 💼📑

여행과 관련된 전자문서를 안전하게 관리하는 전자지갑 앱, **Baenang**

</div>



<div align="center">
   
## 🛠 Tech Stack 🛠

 ![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)  ![Spring Framework](https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white)  ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)  ![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)  
 ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)  ![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white)  ![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white) 

</div>


## 👥 팀원 소개



| <img src="https://github.com/Hello-LSY.png" width="80"> | <img src="https://github.com/~~~.png" width="80"> | <img src="https://github.com/~~~.png" width="80"> | <img src="https://github.com/~~~.png" width="80"> | <img src="https://github.com/~~~.png" width="80"> | <img src="https://github.com/~~~.png" width="80"> |
| :---: | :---: | :---: | :---: | :---: | :---: |
| [이신영](https://github.com/Hello-LSY) | [김동준](https://github.com/~~~) | [김연비](https://github.com/~~~) | [김우정](https://github.com/~~~) | [이태웅](https://github.com/~~~) | [장형권](https://github.com/~~~) |
| PM, DevOps, BE | FE, BE, UI | FE, BE | FE, BE, UI | FE, BE | FE, BE |




## 📖 프로젝트 개요

**Baenang**은 여행과 관련된 전자문서를 안전하게 저장하고 관리할 수 있는 전자지갑 앱입니다. 사용자에게 쉽고 편리한 여행 문서 관리 기능을 제공하며, 보안과 사용자 경험을 최우선으로 고려하여 개발되었습니다. 

**주요 특징:**
- 전자문서의 안전한 저장 및 관리
- 사용자 친화적인 UI
- 빠르고 안전한 인증 및 보안 처리
- 확장 가능한 아키텍처




---

## 🎯 주요 기능

### 1. 회원가입 및 로그인
- **회원가입**: 일반 회원가입, SNS 연동 (카카오, 애플, 구글)로 가입 가능.
- **일반 로그인**: 아이디/비밀번호 기반 로그인.
  
### 2. 문서 관리
- **문서 업로드**: OCR을 이용한 문서 인식 기능, 다양한 포맷의 문서 업로드 가능.
- **여권/항공권 관리**: OCR 기능을 통해 여권 및 항공권 정보 자동 추출 및 저장.
- **증명서 발급**: 사용자가 입력한 정보를 바탕으로 맞춤형 증명서 발급 서비스 제공.
  
### 3. 커뮤니티
- **커뮤니티 기능**: 글 작성, 댓글 작성, 사용자 간의 상호작용을 지원.
  
### 4. 여행자 정보 관리
- **여행 정보 저장**: 사용자가 방문한 국가 및 지역에 대한 정보를 기록하고 관리.

---

## 📌 기술 스택 상세

![kbPJ](https://github.com/user-attachments/assets/bd02e4e2-4f9d-4f37-9ba5-c727b484cd92)


- **프론트엔드**: React Native (모바일 애플리케이션 개발)
- **백엔드**: Spring Framework (Spring 레거시 기반 RESTful API)
- **데이터베이스**: MySQL(RDBMS)
- **CI/CD**: Docker, Jenkins (자동화된 배포 및 지속적 통합/지속적 배포 파이프라인 구축)
- **캐싱**: Redis (인메모리 데이터 저장소 및 캐싱 솔루션)
- **빌드 도구**: Gradle (프로젝트 빌드 및 의존성 관리)
- **웹 서버/리버스 프록시**: Nginx (정적 자원 서빙 및 리버스 프록시 역할을 통한 트래픽 관리)


---

## 🛠 설치 및 실행 방법

1. **Clone Repository**

   ```bash
   git clone https://github.com/Hello-LSY/Baenang.git
   ```

2. **Install Dependencies**

   ```bash
   cd Baenang
   # Front-end dependencies
   cd react-native-app
   npm install

   # Back-end dependencies
   cd ../spring-rest-app
   ```

3. **Run the Application**

   **Windows OS**
   ```bash
   # Front-end
   cd ../react-native-app
   npm start

   # Back-end
   cd ../spring-rest-app
   gradlew build
   gradlew tomcatRun
   ```

   **Unix/Linux**
   ```bash
   # Front-end
   cd ../react-native-app
   npm start

   # Back-end
   cd ../spring-rest-app
   ./gradlew build
   ./gradlew tomcatRun
   ```




