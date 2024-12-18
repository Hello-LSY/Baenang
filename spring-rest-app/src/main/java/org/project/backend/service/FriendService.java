package org.project.backend.service;

import org.project.backend.model.BusinessCard;
import java.util.List;

public interface FriendService {
    void addFriendByBusinessCardId(Long memberId, String businessCardId);
    List<BusinessCard> getFriendsList(Long memberId); // 친구 리스트를 불러오는 메소드 추가
    void removeFriendByBusinessCardId(Long memberId, String businessCardId); // 친구 삭제 메서드 추가
}
