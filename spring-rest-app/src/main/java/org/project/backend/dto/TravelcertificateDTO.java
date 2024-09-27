package org.project.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class TravelcertificateDTO {
    // 회원 여행지 고유 식별자
    private Long travelid;

    // 여행지 이름
    private String visitedcountry;

    // 이미지 경로
    private String imagepath;

    // 여행 날짜
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date traveldate;

    // 위도 (latitude)
    private double latitude;

    // 경도 (longitude)
    private double longitude;
}
