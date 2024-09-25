package org.project.backend.controller;

import org.project.backend.dto.TravelcertificateDTO;
import org.project.backend.service.TravelcertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 여행 인증서 관리 API를 제공하는 컨트롤러.
 * RESTful 방식으로 CRUD 기능을 제공한다.
 */
@RestController
@RequestMapping("/api/travel-certificates")
public class TravelcertificateController {

    @Autowired
    private TravelcertificateService travelCertificateService;

    // 모든 여행 인증서 목록 조회
    @GetMapping("/all")
    public ResponseEntity<List<TravelcertificateDTO>> getAllTravelCertificates() {
        List<TravelcertificateDTO> certificates = travelCertificateService.getAllTravelCertificates();
        return new ResponseEntity<>(certificates, HttpStatus.OK);
    }

    // 로그인한 사용자의 여행 인증서 목록 조회
    @GetMapping("/")
    public ResponseEntity<List<TravelcertificateDTO>> getLoggedInUserCertificates() {
        List<TravelcertificateDTO> certificates = travelCertificateService.getLoggedInUserCertificates();
        return new ResponseEntity<>(certificates, HttpStatus.OK);
    }

    // 특정 ID의 여행 인증서 조회
    @GetMapping("/show/{id}")
    public ResponseEntity<TravelcertificateDTO> getTravelCertificateById(@PathVariable Long id) {
        TravelcertificateDTO certificate = travelCertificateService.getTravelCertificateById(id);
        return new ResponseEntity<>(certificate, HttpStatus.OK);
    }

    // 새로운 여행 인증서 생성
    @PostMapping("/save")
    public ResponseEntity<TravelcertificateDTO> createTravelCertificate(@RequestBody TravelcertificateDTO dto) {
        travelCertificateService.createTravelCertificate(dto);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    // 특정 ID의 여행 인증서 수정
    @PutMapping("/{id}")
    public ResponseEntity<TravelcertificateDTO> updateTravelCertificate(
            @PathVariable Long id, @RequestBody TravelcertificateDTO dto) {
        TravelcertificateDTO updatedCertificate = travelCertificateService.updateTravelCertificate(id, dto);
        return new ResponseEntity<>(updatedCertificate, HttpStatus.OK);
    }

    // 특정 ID의 여행 인증서 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTravelCertificate(@PathVariable Long id) {
        travelCertificateService.deleteTravelCertificate(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
