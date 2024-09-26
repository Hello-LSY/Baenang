package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.project.backend.dto.TravelcertificateDTO;
import org.project.backend.service.TravelcertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 로그인한 사용자의 여행 인증서를 관리하는 API를 제공하는 컨트롤러.
 * RESTful 방식으로 로그인한 사용자의 CRUD 기능을 제공한다.
 */
@RestController
@RequestMapping("/api/travel-certificates")
@Api(tags = "travel-certificates API", description = "여행인증서 관리 API")
public class TravelcertificateController {

    @Autowired
    private TravelcertificateService travelCertificateService;

    /**
     * 로그인한 사용자의 모든 여행 인증서 목록을 조회한다.
     *
     * @return 로그인한 사용자의 여행 인증서 목록
     */
    @ApiOperation(value = "특정 회원 여행인증서 조회", notes = "특정 회원의 여행인증서를 조회합니다.")
    @GetMapping("/all")
    public ResponseEntity<List<TravelcertificateDTO>> getLoggedInUserCertificates() {
        List<TravelcertificateDTO> certificates = travelCertificateService.getLoggedInUserCertificates();
        return new ResponseEntity<>(certificates, HttpStatus.OK);
    }

    /**
     * 로그인한 사용자의 특정 여행 인증서를 조회한다.
     *
     * @param id 조회할 여행 인증서의 ID
     * @return 해당 여행 인증서의 DTO
     */
    @ApiOperation(value = "특정 회원의 특정 여행 인증서번호의 여행인증서 조회", notes = "특정 회원의 특정 여행 인증서번호의 여행인증서를 조회합니다.")
    @GetMapping("/show/{id}")
    public ResponseEntity<TravelcertificateDTO> getTravelCertificateById(@PathVariable Long id) {
        TravelcertificateDTO certificate = travelCertificateService.getTravelCertificateById(id);
        return new ResponseEntity<>(certificate, HttpStatus.OK);
    }

    /**
     * 로그인한 사용자의 새로운 여행 인증서를 생성한다.
     *
     * @param dto 생성할 여행 인증서의 DTO
     * @return 생성된 여행 인증서의 DTO
     */
    @ApiOperation(value = "특정 회원의 여행 인증서 생성", notes = "특정 회원의 여행 인증서 생성합니다.")
    @PostMapping("/save")
    public ResponseEntity<TravelcertificateDTO> createTravelCertificate(@RequestBody TravelcertificateDTO dto) {
        travelCertificateService.createTravelCertificate(dto);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    /**
     * 로그인한 사용자의 특정 ID 여행 인증서를 수정한다.
     *
     * @param id 수정할 여행 인증서의 ID
     * @param dto 업데이트할 여행 인증서의 DTO
     * @return 업데이트된 여행 인증서의 DTO
     */
    @ApiOperation(value = "특정 회원의 특정 여행 인증서번호의 여행인증서 수정", notes = "특정 회원의 특정 여행 인증서번호의 여행인증서를 수정합니다.")
    @PutMapping("/{id}")
    public ResponseEntity<TravelcertificateDTO> updateTravelCertificate(
            @PathVariable Long id, @RequestBody TravelcertificateDTO dto) {
        TravelcertificateDTO updatedCertificate = travelCertificateService.updateTravelCertificate(id, dto);
        return new ResponseEntity<>(updatedCertificate, HttpStatus.OK);
    }

    /**
     * 로그인한 사용자의 특정 여행 인증서를 삭제한다.
     *
     * @param id 삭제할 여행 인증서의 ID
     * @return 삭제 성공 여부
     */
    @ApiOperation(value = "특정 회원의 특정 여행 인증서번호의 여행인증서 삭제", notes = "특정 회원의 특정 여행 인증서번호의 여행인증서를 삭제합니다.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTravelCertificate(@PathVariable Long id) {
        travelCertificateService.deleteTravelCertificate(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
