// redux/businessCardState.js

import { useSelector, useDispatch } from 'react-redux';
import { fetchBusinessCard, createBusinessCard, updateBusinessCard, clearBusinessCard } from './businessCardSlice'; 

export const useBusinessCard = () => {
  const businessCard = useSelector((state) => state.businessCard);
  const dispatch = useDispatch();

  // 명함 조회
  const fetchCard = (memberId) => {
    return dispatch(fetchBusinessCard(memberId)); 
  };

  // 명함 생성
  const createCard = (memberId, businessCardData) => {
    return dispatch(createBusinessCard({ memberId, businessCardData })); 
  };

  // 명함 수정
  const updateCard = (cardId, businessCardData) => {
    return dispatch(updateBusinessCard({ cardId, businessCardData }));
  };

  // 명함 초기화
  const clearCard = () => {
    dispatch(clearBusinessCard());
  };

  return {
    businessCard,
    fetchCard,
    createCard,
    updateCard, // 명함 수정 함수 추가
    clearCard,
  };
};
