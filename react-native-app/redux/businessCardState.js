// redux/businessCardState.js

import { useSelector, useDispatch } from 'react-redux';
import { fetchBusinessCard, createBusinessCard, deleteBusinessCard, clearBusinessCard } from './businessCardSlice'; 

export const useBusinessCard = () => {
  const businessCard = useSelector((state) => state.businessCard);
  const dispatch = useDispatch();

  const fetchCard = (memberId) => {
    return dispatch(fetchBusinessCard(memberId)); 
  };

  const createCard = (memberId, businessCardData) => {
    return dispatch(createBusinessCard({ memberId, businessCardData })); 
  };

  const deleteCard = (cardId) => {
    return dispatch(deleteBusinessCard(cardId)); 
  };

  const clearCard = () => {
    dispatch(clearBusinessCard());
  };

  return {
    businessCard,
    fetchCard,
    createCard, 
    deleteCard,
    clearCard,
  };
};
