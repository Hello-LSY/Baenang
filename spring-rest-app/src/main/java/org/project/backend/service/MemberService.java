package org.project.backend.service;

import org.project.backend.dto.MemberDTO;
import org.project.backend.model.Member;

import java.util.List;

/**
 * 회원 관리 서비스를 정의하는 인터페이스.
 * 회원 정보의 조회, 생성, 업데이트, 삭제 등의 기능을 제공한다.
 *
 * Service와 ServiceImpl을 나누는 이유?
 * 인터페이스: 비즈니스 로직의 메서드를 정의해서 비즈니스 로직을 구현하기 전에 어떤 기능을 제공할지 명확히 하고,
 * 이를 기반으로 클라이언트가 의존성을 주입받을 수 있도록 한다.
 *
 * ServiceImpl 클래스**: 비즈니스 로직을 실제로 구현. 인터페이스에서 정의한 메서드를 구현하고, 구체적인 비즈니스 로직을 처리한다.
 * 이를 기반으로 구현 세부 사항을 캡슐화하고, 인터페이스를 통해 클라이언트와의 의존성을 관리할 수 있게 한다.
 *
 * 메서드명 작성 가이드 라인
 * 명확하고 일관되게: 메서드명이 수행하는 동작을 명확히 표현한다. 예를 들어, `getAllMembers`는 "모든 회원을 조회한다"는 의미를 명확히 전달한다.
 * 동사 + 명사 형식: 메서드명은 일반적으로 동사와 명사로 구성하여 수행하는 작업을 쉽게 이해할 수 있도록 한다. 예를 들어, `createMember`는 "회원 생성"을 나타낸다.
 * 단수와 복수: 메서드명이 단수 또는 복수를 사용하는 경우, 처리하는 데이터의 종류에 따라 결정한다. 예를 들어, `getMemberById`는 단일 회원을 조회할 때 사용하고, `getAllMembers`는 여러 회원을 조회할 때 사용한다.
 * 기능 명확화: 메서드명이 기능이나 의도를 명확히 전달하도록 한다. 예를 들어, `updateMember`는 "회원 정보 업데이트"를 명확히 나타낸다.
 *
 */
public interface MemberService {

    /**
     * 모든 회원 정보 조회
     *
     * @return 모든 회원의 DTO 목록
     */
    List<MemberDTO> getAllMembers();

    /**
     * 주어진 ID를 가진 회원 정보를 조회
     *
     * @param id 조회할 회원의 ID
     * @return 조회된 회원의 DTO
     */
    MemberDTO getMemberById(Long id);

    /**
     * 새로운 회원을 생성
     *
     * @param memberDTO 생성할 회원의 DTO
     * @return 생성된 회원의 엔티티
     */
    Member createMember(MemberDTO memberDTO);

    /**
     * 주어진 ID를 가진 회원 정보를 업데이트
     *
     * @param id 업데이트할 회원의 ID
     * @param memberDetails 업데이트할 회원의 DTO
     * @return 업데이트된 회원의 DTO
     */
    MemberDTO updateMember(Long id, MemberDTO memberDetails);

    /**
     * 주어진 ID를 가진 회원을 삭제
     *
     * @param id 삭제할 회원의 ID
     */
    void deleteMember(Long id);
    Member findByUsername(String username);  // 추가

}
