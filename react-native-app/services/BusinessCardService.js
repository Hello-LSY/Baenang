import createAxiosInstance from './axiosInstance';

// BusinessCard 생성
export const createBusinessCard = async (token, memberId, businessCardData) => {
  const axiosInstance = createAxiosInstance(token);
  if (!axiosInstance) return null;

  try {
    const response = await axiosInstance.post(`/api/business-cards/members/${memberId}`, businessCardData);
    return response.data;
  } catch (error) {
    console.error("Error creating business card:", error.response ? error.response.data : error);
    return null;
  }
};

// BusinessCard 조회
export const getBusinessCardById = async (token, cardId) => {
  const axiosInstance = createAxiosInstance(token);
  if (!axiosInstance) return null;

  try {
    const response = await axiosInstance.get(`/api/business-cards/${cardId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching business card:", error.response ? error.response.data : error);
    return null;
  }
};

// BusinessCard 업데이트
export const updateBusinessCard = async (token, cardId, businessCardData) => {
  const axiosInstance = createAxiosInstance(token);
  if (!axiosInstance) return null;

  try {
    const response = await axiosInstance.put(`/api/business-cards/${cardId}`, businessCardData);
    return response.data;
  } catch (error) {
    console.error("Error updating business card:", error.response ? error.response.data : error);
    return null;
  }
};

// BusinessCard 삭제
export const deleteBusinessCard = async (token, cardId) => {
  const axiosInstance = createAxiosInstance(token);
  if (!axiosInstance) return null;

  try {
    await axiosInstance.delete(`/api/business-cards/${cardId}`);
    return true;
  } catch (error) {
    console.error("Error deleting business card:", error.response ? error.response.data : error);
    return false;
  }
};

// 저장된 명함 목록 조회
export const getSavedBusinessCards = async (token, memberId) => {
  const axiosInstance = createAxiosInstance(token);
  if (!axiosInstance) return [];

  try {
    const response = await axiosInstance.get(`/api/saved-business-cards/members/${memberId}/cards`);
    return response.data;
  } catch (error) {
    console.error("Error fetching saved business cards:", error.response ? error.response.data : error);
    return [];
  }
};

// 모든 함수를 객체로 묶어서 default로 export
export default {
  createBusinessCard,
  getBusinessCardById,
  updateBusinessCard,
  deleteBusinessCard,
  getSavedBusinessCards,
};
