package org.project.backend.service;

import org.project.backend.dto.TravelcertificateDTO;
import org.project.backend.model.Travelcertificate;

import java.util.List;

/**
 * 여행 인증서 관리 서비스를 정의하는 인터페이스.
 * 여행 인증서 정보의 조회, 생성, 업데이트, 삭제 등의 기능을 제공한다.
 */
public interface TravelcertificateService {

    /**
     * 모든 여행 인증서 정보를 조회한다.
     *
     * @return 모든 여행 인증서의 DTO 목록
     */
    List<TravelcertificateDTO> getAllTravelCertificates();

    /**
     * 주어진 ID를 가진 여행 인증서 정보를 조회한다.
     *
     * @param id 조회할 여행 인증서의 ID
     * @return 조회된 여행 인증서의 DTO
     */
    TravelcertificateDTO getTravelCertificateById(Long id);

    /**
     * 새로운 여행 인증서를 생성한다.
     *
     * @param travelcertificateDTO 생성할 여행 인증서의 DTO
     * @return 생성된 여행 인증서의 엔티티
     */
    Travelcertificate createTravelCertificate(TravelcertificateDTO travelcertificateDTO);

    /**
     * 주어진 ID를 가진 여행 인증서 정보를 업데이트한다.
     *
     * @param id 업데이트할 여행 인증서의 ID
     * @param travelCertificateDetails 업데이트할 여행 인증서의 DTO
     * @return 업데이트된 여행 인증서의 DTO
     */
    TravelcertificateDTO updateTravelCertificate(Long id, TravelcertificateDTO travelCertificateDetails);

    /**
     * 주어진 ID를 가진 여행 인증서를 삭제한다.
     *
     * @param id 삭제할 여행 인증서의 ID
     */
    void deleteTravelCertificate(Long id);

    /**
     * 로그인한 사용자의 여행 인증서 정보를 조회한다.
     *
     * @return 로그인한 사용자의 여행 인증서 목록
     */
    List<TravelcertificateDTO> getLoggedInUserCertificates();
}
