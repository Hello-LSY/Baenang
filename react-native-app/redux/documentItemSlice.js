import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants/config"; // 백엔드 URL 설정

// 주민등록증 정보 가져오기
export const fetchResidentRegistration = createAsyncThunk(
  "document/fetchResidentRegistration",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.get(`${BASE_URL}/residentregistration/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('주민등록데이터 : ',response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch Resident Registration");
    }
  }
);

// 운전면허증 정보 가져오기
export const fetchDriverLicense = createAsyncThunk(
  "document/fetchDriverLicense",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.get(`${BASE_URL}/driver-license/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch Driver License");
    }
  }
);

// 국제학생증 정보 가져오기
export const fetchISIC = createAsyncThunk(
  "document/fetchISIC",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.get(`${BASE_URL}/isic/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch ISIC");
    }
  }
);

// 여권 정보 가져오기
export const fetchPassport = createAsyncThunk(
  "document/fetchPassport",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.get(`${BASE_URL}/passport/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch Passport");
    }
  }
);

// Redux Slice 생성
const documentItemSlice = createSlice({
  name: "documentItem",
  initialState: {
    residentRegistration: null,
    driverLicense: null,
    isic: null,
    passport: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearDocumentState: (state) => {
      state.isLoading = false;
      state.residentRegistration = null;
      state.driverLicense = null;
      state.isic = null;
      state.passport = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 주민등록증 정보 처리
      .addCase(fetchResidentRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResidentRegistration.fulfilled, (state, action) => {
        console.log("fulfilled payload:", action.payload); // 상태에 제대로 반영되는지 확인
        state.isLoading = false;
        state.residentRegistration = action.payload; // 상태 업데이트
      })
      .addCase(fetchResidentRegistration.rejected, (state, action) => {
        console.error("Error fetching resident registration:", action.payload); // rejected 상태에서 오류 확인
        state.isLoading = false;
        state.error = action.payload;
      });

    // 운전면허증 정보 처리
    builder
      .addCase(fetchDriverLicense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDriverLicense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.driverLicense = action.payload;
      })
      .addCase(fetchDriverLicense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 국제학생증 정보 처리
    builder
      .addCase(fetchISIC.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchISIC.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isic = action.payload;
      })
      .addCase(fetchISIC.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 여권 정보 처리
    builder
      .addCase(fetchPassport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPassport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.passport = action.payload;
      })
      .addCase(fetchPassport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDocumentState } = documentItemSlice.actions;
export default documentItemSlice.reducer;
