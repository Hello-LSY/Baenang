package org.project.backend.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name="travelcertificate")
public class Travelcertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long travelid;

    // 사용자 이름
    @Column(name = "username")
    private String username;

    // 방문한 국가
    @Column(name = "VisitedCountry")
    private String visitedcountry;

    // 이미지 경로
    @Column(name = "ImagePath")
    private String imagepath;

    // 여행 날짜
    @Column(name = "TravelDate")
    private Date travledate;

    // 위도 (latitude)
    @Column(name = "Latitude")
    private double latitude;

    // 경도 (longitude)
    @Column(name = "Longitude")
    private double longitude;
}
