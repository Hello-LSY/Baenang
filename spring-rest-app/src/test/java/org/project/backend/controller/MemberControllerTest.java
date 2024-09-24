//package org.project.backend.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.project.backend.dto.MemberDTO;
//import org.project.backend.exception.member.GeneralMemberNotFoundException;
//import org.project.backend.model.Member;
//import org.project.backend.service.MemberServiceImpl;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//
//import java.util.List;
//
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//public class MemberControllerTest {
//
//    // SLF4J Logger 설정
//    private static final Logger logger = LoggerFactory.getLogger(MemberControllerTest.class);
//
//    // MockMvc는 테스트를 위해 가상으로 HTTP 요청을 보내고 응답을 검증하는 역할을 함
//    private MockMvc mockMvc;
//
//    // @Mock 어노테이션을 사용하여 MemberServiceImpl을 Mock 객체로 만듦 (실제 동작 대신 가짜 동작을 수행)
//    @Mock
//    private MemberServiceImpl memberServiceImpl;
//
//    // @InjectMocks 어노테이션을 통해 MemberController의 의존성 주입
//    @InjectMocks
//    private MemberController memberController;
//
//    // 테스트에 사용할 MemberDTO와 ObjectMapper 객체
//    private MemberDTO memberDTO;
//    private ObjectMapper objectMapper;
//
//    // 각 테스트 전에 실행되는 초기 설정 메서드
//    @BeforeEach
//    public void setUp() {
//        MockitoAnnotations.openMocks(this);  // Mockito Mock 객체 초기화
//        mockMvc = MockMvcBuilders.standaloneSetup(memberController).build();  // MockMvc 설정
//        objectMapper = new ObjectMapper();  // JSON 변환을 위한 ObjectMapper 초기화
//
//        // 테스트용 데이터 설정
//        memberDTO = new MemberDTO();
//        memberDTO.setId(1L);
//        memberDTO.setUsername("John Doe");
//        memberDTO.setPassword("password123");
//    }
//
//    // 모든 멤버 가져오기 - 성공 테스트
//    @Test
//    public void testGetAllMembers_Success() throws Exception {
//        logger.info("Start: testGetAllMembers_Success");  // 테스트 시작 로그
//
//        // Mock 객체 설정: getAllMembers() 호출 시 memberDTO 리스트 반환
//        when(memberServiceImpl.getAllMembers()).thenReturn(List.of(memberDTO));
//
//        // MockMvc를 통해 가상 HTTP GET 요청을 보내고 응답 상태와 데이터를 검증
//        mockMvc.perform(get("/api/members")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())  // 응답 상태가 200 OK인지 확인
//                .andExpect(jsonPath("$[0].name").value("John Doe"));  // 응답 JSON에서 name 필드 확인
//
//        logger.info("End: testGetAllMembers_Success");  // 테스트 종료 로그
//    }
//
//    // 멤버 생성 - 성공 테스트
//    @Test
//    public void testCreateMember_Success() throws Exception {
//        logger.info("Start: testCreateMember_Success");  // 테스트 시작 로그
//
//        // memberDTO 객체를 JSON 문자열로 변환
//        String memberJson = objectMapper.writeValueAsString(memberDTO);
//
//        // Mock 객체 설정: createMember() 호출 시 새로운 Member 객체 반환
//        when(memberServiceImpl.createMember(any(MemberDTO.class))).thenReturn(new Member());
//
//        // POST 요청을 보내고 응답 상태 검증 (201 Created 상태)
//        mockMvc.perform(post("/api/members")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(memberJson))
//                .andExpect(status().isCreated());
//
//        logger.info("End: testCreateMember_Success");  // 테스트 종료 로그
//    }
//
//    // 멤버 생성 - 실패 테스트: 필수 필드 누락 (name)
//    @Test
//    public void testCreateMember_Failure_MissingName() throws Exception {
//        logger.info("Start: testCreateMember_Failure_MissingName");  // 테스트 시작 로그
//
//        // 필수 필드인 name이 없는 invalidMemberDTO 생성
//        MemberDTO invalidMemberDTO = new MemberDTO();
//        invalidMemberDTO.setId(1L);
//        invalidMemberDTO.setPassword("password123");
//
//        // invalidMemberDTO를 JSON 문자열로 변환
//        String memberJson = objectMapper.writeValueAsString(invalidMemberDTO);
//
//        // POST 요청을 보내고 응답 상태 검증 (400 Bad Request 상태)
//        mockMvc.perform(post("/api/members")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(memberJson))
//                .andExpect(status().isBadRequest());
//
//        logger.info("End: testCreateMember_Failure_MissingName");  // 테스트 종료 로그
//    }
//
//    // 멤버 생성 - 실패 테스트: 내부 서버 오류
//    @Test
//    public void testCreateMember_Failure_InternalServerError() throws Exception {
//        logger.info("Start: testCreateMember_Failure_InternalServerError");  // 테스트 시작 로그
//
//        // memberDTO 객체를 JSON 문자열로 변환
//        String memberJson = objectMapper.writeValueAsString(memberDTO);
//
//        // Mock 객체 설정: createMember() 호출 시 RuntimeException 발생
//        when(memberServiceImpl.createMember(any(MemberDTO.class))).thenThrow(new RuntimeException("Internal Error"));
//
//        // POST 요청을 보내고 응답 상태 검증 (500 Internal Server Error 상태)
//        mockMvc.perform(post("/api/members")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(memberJson))
//                .andExpect(status().isInternalServerError());
//
//        logger.info("End: testCreateMember_Failure_InternalServerError");  // 테스트 종료 로그
//    }
//
//    // 멤버 삭제 테스트 - 성공
//    @Test
//    public void testDeleteMember_Success() throws Exception {
//        logger.info("Start: testDeleteMember_Success");  // 테스트 시작 로그
//
//        // Mock 객체 설정: deleteMember() 호출 시 아무 일도 일어나지 않음 (성공)
//        doNothing().when(memberServiceImpl).deleteMember(1L);
//
//        // DELETE 요청을 보내고 응답 상태 검증 (204 No Content 상태)
//        mockMvc.perform(delete("/api/members/1")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isNoContent());
//
//        logger.info("End: testDeleteMember_Success");  // 테스트 종료 로그
//    }
//
//    // 멤버 삭제 테스트 - 실패: 존재하지 않는 멤버
//    @Test
//    public void testDeleteMember_Failure_NotFound() throws Exception {
//        logger.info("Start: testDeleteMember_Failure_NotFound");  // 테스트 시작 로그
//
//        // Mock 객체 설정: deleteMember() 호출 시 MemberNotFoundException 발생
//        doThrow(new GeneralMemberNotFoundException("Member not found")).when(memberServiceImpl).deleteMember(1L);
//
//        // DELETE 요청을 보내고 응답 상태와 에러 메시지 검증 (404 Not Found 상태)
//        mockMvc.perform(delete("/api/members/1")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isNotFound())
//                .andExpect(content().string("Member not found"));
//
//        logger.info("End: testDeleteMember_Failure_NotFound");  // 테스트 종료 로그
//    }
//}
