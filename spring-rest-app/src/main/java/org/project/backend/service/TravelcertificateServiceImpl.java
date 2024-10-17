package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.TravelcertificateDTO;
import org.project.backend.model.Travelcertificate;
import org.project.backend.repository.TravelcertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 여행 인증서 관리 서비스 구현 클래스.
 * TravelCertificateService 인터페이스에서 정의한 메서드를 구현하여
 * 실제 비즈니스 로직을 처리한다.
 */
@Service
@RequiredArgsConstructor
public class TravelcertificateServiceImpl implements TravelcertificateService {

    @Autowired
    private TravelcertificateRepository travelCertificateRepository;

    /**
     * 모든 여행 인증서 목록을 조회한다.
     *
     * @return 여행 인증서의 DTO 목록
     */
    @Override
    public List<TravelcertificateDTO> getAllTravelCertificates() {
        List<Travelcertificate> certificates = travelCertificateRepository.findAll();
        return certificates.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * 특정 ID로 여행 인증서를 조회한다.
     *
     * @param id 조회할 여행 인증서의 ID
     * @return 여행 인증서 DTO
     */
    @Override
    public TravelcertificateDTO getTravelCertificateById(Long id) {
        Travelcertificate certificate = travelCertificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Travel Certificate not found"));
        return convertToDTO(certificate);
    }

    /**
     * 새로운 여행 인증서를 생성한다.
     *
     * @param travelcertificateDTO 생성할 여행 인증서의 DTO
     * @return 생성된 여행 인증서 엔티티
     */
    @Override
    public Travelcertificate createTravelCertificate(TravelcertificateDTO travelcertificateDTO) {
        Travelcertificate travelCertificate = new Travelcertificate();
        travelCertificate.setVisitedcountry(travelcertificateDTO.getVisitedcountry());
        travelCertificate.setImagepath(travelcertificateDTO.getImagepath());
        travelCertificate.setTravledate(travelcertificateDTO.getTraveldate());

        // 위치 정보 추가
        travelCertificate.setLatitude(travelcertificateDTO.getLatitude());
        travelCertificate.setLongitude(travelcertificateDTO.getLongitude());

        // 로그인한 사용자의 username 설정
        String username = getCurrentUsername();
        travelCertificate.setUsername(username);

        return travelCertificateRepository.save(travelCertificate);
    }

    /**
     * 특정 ID로 여행 인증서를 업데이트한다.
     *
     * @param id 업데이트할 여행 인증서의 ID
     * @param travelCertificateDetails 업데이트할 여행 인증서의 DTO
     * @return 업데이트된 여행 인증서 DTO
     */
    @Override
    public TravelcertificateDTO updateTravelCertificate(Long id, TravelcertificateDTO travelCertificateDetails) {
        Travelcertificate travelCertificate = travelCertificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Travel Certificate not found"));

        travelCertificate.setVisitedcountry(travelCertificateDetails.getVisitedcountry());
        travelCertificate.setImagepath(travelCertificateDetails.getImagepath());
        travelCertificate.setTravledate(travelCertificateDetails.getTraveldate());

        // 위치 정보 업데이트
        travelCertificate.setLatitude(travelCertificateDetails.getLatitude());
        travelCertificate.setLongitude(travelCertificateDetails.getLongitude());

        travelCertificateRepository.save(travelCertificate);
        return convertToDTO(travelCertificate);
    }

    /**
     * 특정 ID의 여행 인증서를 삭제한다.
     *
     * @param id 삭제할 여행 인증서의 ID
     */
    @Override
    public void deleteTravelCertificate(Long id) {
        Travelcertificate travelCertificate = travelCertificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Travel Certificate not found"));
        travelCertificateRepository.delete(travelCertificate);
    }

    /**
     * 로그인한 사용자의 여행 인증서 목록을 조회한다.
     *
     * @return 로그인한 사용자의 여행 인증서 DTO 목록
     */
    @Override
    public List<TravelcertificateDTO> getLoggedInUserCertificates() {
        String username = getCurrentUsername();
        List<Travelcertificate> certificates = travelCertificateRepository.findByUsername(username);
        return certificates.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * 로그인한 사용자의 username을 가져온다.
     *
     * @return 로그인한 사용자의 username
     */
    private String getCurrentUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    /**
     * Travelcertificate 엔티티를 TravelcertificateDTO로 변환한다.
     *
     * @param travelCertificate 변환할 엔티티
     * @return 변환된 DTO
     */
    private TravelcertificateDTO convertToDTO(Travelcertificate travelCertificate) {
        TravelcertificateDTO dto = new TravelcertificateDTO();
        dto.setTravelid(travelCertificate.getTravelid());
        dto.setVisitedcountry(travelCertificate.getVisitedcountry());
        dto.setImagepath(travelCertificate.getImagepath());
        dto.setTraveldate(travelCertificate.getTravledate());

        // 위치 정보 변환
        dto.setLatitude(travelCertificate.getLatitude());
        dto.setLongitude(travelCertificate.getLongitude());

        return dto;
    }
}
