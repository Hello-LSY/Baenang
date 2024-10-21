

<div align="center">
   
![Baenang](https://github.com/user-attachments/assets/0e6a3178-e20a-4019-a74a-52c398433e1b)


# 🌍 ✈️ 배낭 💼📑

여행자를 위한 전자지갑 어플리케이션, `BAENANG`


</div>

<div align="center">
   
## 🛠 Tech Stack 🛠

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) 
![Spring Framework](https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white) 
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) 
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white) 
![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white) 
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white) 
![Spring JPA](https://img.shields.io/badge/Spring%20JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white) 
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=spring&logoColor=white) 

## 👥 팀원 소개

| <img src="https://github.com/Hello-LSY.png" width="80"> | <img src="https://github.com/kimdj4e.png" width="80"> | <img src="https://github.com/MyYeonbi.png" width="80"> | <img src="https://github.com/pq5910.png" width="80"> | <img src="https://github.com/dlxodnd007.png" width="80"> | <img src="https://github.com/gwonnnns.png" width="80"> |
| :---: | :---: | :---: | :---: | :---: | :---: |
| [이신영](https://github.com/Hello-LSY) | [김동준](https://github.com/kimdj4e) | [김연비](https://github.com/MyYeonbi) | [김우정](https://github.com/pq5910) | [이태웅](https://github.com/dlxodnd007) | [장형권](https://github.com/gwonnnns) |
| PM, DevOps, BE main, FE sub, Docs sub | FE main, UI main| Docs main, BE sub | FE main, UI main, BE sub | FE main, BE main | FE sub, BE sub |


</div>


## 📖 프로젝트 개요

여행자를 위한 전자지갑 어플리케이션인 **BAENANG** 입니다. 본 프로젝트에서는 해외여행을 갈 때 생각보다 다양한 서류들을 요구한다는 점과 종이서류에 대한 문제를 전자문서지갑기능으로 개선함과 동시에 여행과 관련한 다양한 편의기능들(위치기반 커뮤니티, 여행자 명함, 여행 인증서, 실시간 환율)을 마련하여 여행시에 다양한 편의성을 제공하였습니다.

**주요 특징:**
- 전자문서의 안전한 저장 및 관리
- 사용자 친화적인 UI
- 빠르고 안전한 인증 및 보안 처리
- 확장 가능한 아키텍처




---

## 🎯 주요 기능

### 1. 회원가입/로그인
![회원가입 및 로그인](https://github.com/user-attachments/assets/4f6e7490-a233-4838-9472-9d631a8b1e55)

- 회원가입
  1) id, 이메일, 닉네임 중복체크 로직 포함
- 로그인
   1) spring security로 로그인 인증인가 구현
   2) jwt 토큰기반 인증
      

### 2. 여행 전자문서
![전자지갑인증](https://github.com/user-attachments/assets/963c96e0-08e9-44e6-aa9d-0393b70e6ff2)
![전자지갑인증완료](https://github.com/user-attachments/assets/9689426b-1f34-4830-b30a-24bf323cd688)
   - 인증 과정과 정보 요청
      1) 현행 전자문서는 대부분 블록체인 기반으로 신뢰와 보안에 대해 보장을 받은 상태. 이를 유사하게 구현하기위해 기관을 가상으로 설정한다는 시나리오로, private servnet에 RDS(가상기관)를 놓고 ec2와의 tcp 통신으로 보안을 대체함.
      2) 이름, 이메일, 주민등록번호로 인증 과정을 거치며, 메일로 받은 인증 코드를 입력하여 정부24와 같은 인증기관으로 정보를 요청하여 개인 정보 데이터를 받아옴
      3) 한 번의 인증으로 일정 시간 인증이 유지되고 해당 시간 내에는 다른 문서에도 접근이 가능함
      4) 카메라 인증 권한 핸들러 구현

### 3. 여행자 명함
![여행자명함](https://github.com/user-attachments/assets/60433353-2dcf-4b80-a9a9-fe2dae489440)

- 여행자 명함 생성 및 수정
   1) 이름, 프로필 사진, 국적, SNS아이디, 자기소개 데이터를 받아 하나의 계정 당 하나의 여행자 명함 생성.
   2) 명함 생성 시 고유 PIN번호와 QR 생성
- 여행자 명함 교환
   1) PIN번호를 직접 입력하거나 QR코드를 인식하여 내 명함 리스트에 상대방의 명함 등록
   2) 카메라 권한에 대한 핸들러 구현

### 4. 여행자 커뮤니티
![커뮤니티](https://github.com/user-attachments/assets/0dd7d7ed-4ca7-429c-b2f6-6d31d017da39)

- 사용자 위치 기반 게시글 조회
   1) 사용자의 위치를 중심으로 동네(5km 이내), 도시(50km 이내), 국가(500km 이내), 세계(20,000km 이내)로 나누어 게시글 조회 가능
   2) 하버사인 공식을 활용하고 JQPL을 통해 게시글조회 쿼리최적화 진행
- 좋아요, 댓글 기능
   1) 사용자는 1개의 게시물에 1개의 좋아요만 가능하며, 여러 개의 댓글을 작성할 수 있음.
   - 게시글 CRUD
   1) 이미지 업로드 기능
   2) 사용자 GPS 기반으로 위도와 경도 저장
   3) GPS 접근 권한에 대한 핸들러 구현

### 5. 여행 인증서
![여행인증서](https://github.com/user-attachments/assets/8e083ddc-1111-4f53-80f3-3b6bd91740e6)

- GPS를 이용해 사용자의 위치 인식
   1) GPS 기반으로 현재 사용자의 위치를 인식하여 자동으로 여행지를 입력.
   2) GPS를 통한 여행지 1차 인증
   3) GPS 권한 핸들러 구현
- 카메라를 통한 여행 사진 인증
   1) 사진 업로드가 아닌 카메라를 이용한 실시간 촬영을 통해 구현하여 여행지에 대한 2차 인증을 진행   

### 6. 실시간 환율 
![환율](https://github.com/user-attachments/assets/e4bd728a-cd49-494d-88ee-3c71f309518b)

- 환율 조회
   1) 홈 화면을 통해서 각 국가의 환율을 빠르게 조회할 수 있음
   2) 주요 국가 환율을 상단에 배치하여 요청이 많은 국가의 환율 정보를 빠르게 조회
   3) 전체 국가 환율 리스트를 통해 여러 국가의 환율 조회
- 환율 계산기
   1) 환율 계산기를 이용해 사용자가 외화를 한국 화폐로 빠르게 계산할 수 있게 도움. 실시간 환율값을 기준으로 함.
- 환율 상승/하락 그래프
   1) 일별, 주별, 월별 환율 그래프를 그려 환율의 상승과 하락을 한 눈에 살필 수 있음

### 7. 여행 성향 테스트
![여행테스트](https://github.com/user-attachments/assets/22e21162-0930-4b51-a8ff-9751e64fb09e)

- 여행 성향 분석
   1) 각 문항에 대한 사용자의 답변을 민감, 즉흥, 미디어, 도전, 소비, 신속 총 6개의 수치로 나누어 계산하여 사용자 여행 성향 분석
   2) 성향 결과 페이지에서 성향별 캐릭터와 최종 수치 확인

### 8. 여행 관련 외부 어플 연동

- 숙박, 보험, 교통수단 외부 서비스 지원
   1) KB차차차, KB손해보험, 에어비엔비, 티머니고, 부킹닷컴, 아고다의 웹 서비스와 연동

### 9. 프로필 관리
![프로필관리](https://github.com/user-attachments/assets/548820bc-0d55-4b4a-91b2-f039a62cee4e)

- 비밀번호를 통한 인증
   1) 비밀번호 인증을 통한 보안 강화
- 프로필, 언어, 테마 설정
   1) 10MB 이하의 이미지로 프로필 변경 가능
   2) 언어 변경을 통한 다국어 지원
   3) 라이트/다크 모드 지원

### 10. 기타 서비스
![고객센터](https://github.com/user-attachments/assets/f15fda1a-714d-4990-88ac-828b92997dfd)

- 고객센터, 자주 묻는 질문, 공지사항, 사용 가이드


---

## 📌 기술 스택 상세

![arch](https://github.com/user-attachments/assets/4960fb73-5723-4841-91d6-30ccaaaef1f8)


- **프론트엔드**: React Native (모바일 애플리케이션 개발)
- **백엔드**: Spring Framework (Spring 레거시 기반 RESTful API)
- **데이터베이스**: MySQL(RDS)
- **빌드 도구**: Gradle, Expo 
- **웹 서버**: AWS EC2, RDS, S3


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
   ```

3. **Run the Application**

   **Windows OS**
   ```bash
   # Front-end
   cd ../react-native-app
   npm start
   ```

   **Unix/Linux**
   ```bash
   # Front-end
   cd ../react-native-app
   npm start
   ```




