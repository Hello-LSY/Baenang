package org.project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.SavedBusinessCardDTO;
import org.project.backend.service.FriendService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.project.backend.model.BusinessCard;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    @PostMapping("/{memberId}/add")
    public ResponseEntity<String> addFriendByBusinessCardId(
            @PathVariable Long memberId,
            @RequestBody SavedBusinessCardDTO businessCardDTO) {
        try {
            friendService.addFriendByBusinessCardId(memberId, businessCardDTO.getBusinessCardId());
            return ResponseEntity.status(HttpStatus.CREATED).body("Friend added successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 친구 리스트 불러오기
    @GetMapping("/{memberId}/list")
    public ResponseEntity<List<BusinessCard>> getFriendsList(@PathVariable Long memberId) {
        try {
            List<BusinessCard> friendsList = friendService.getFriendsList(memberId);
            return ResponseEntity.ok(friendsList);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
