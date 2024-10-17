import { useSelector, useDispatch } from 'react-redux';
import { fetchBusinessCard, updateBusinessCard, clearBusinessCard } from './businessCardSlice'; 

export const useBusinessCard = () => {
  const businessCard = useSelector((state) => state.businessCard);
  const dispatch = useDispatch();

  // 명함 조회
  const fetchCard = (memberId) => {
    return dispatch(fetchBusinessCard(memberId)); 
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
    updateCard,
    clearCard,
  };
};
