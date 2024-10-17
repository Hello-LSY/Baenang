import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants/config"; // 백엔드 URL 설정


// 이메일 인증 요청
export const requestVerification = createAsyncThunk(
  "document/requestVerification",
  async ({ fullName, rrn, email }, thunkAPI) => {
    try {
      // URLSearchParams를 사용하여 데이터를 전송
      const data = new URLSearchParams();
      data.append("fullName", fullName);
      data.append("rrn", rrn);
      data.append("email", email);

      const response = await axios.post(
        `${BASE_URL}/api/document/request-verification`,
        data
      );
      console.log("respone : ", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "요청 중 오류 발생:",
        error.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// 이메일 인증 코드 확인 및 문서 ID 업데이트
export const verifyDocument = createAsyncThunk(
  "document/verifyDocument",
  async ({ fullName, rrn, email, code }, thunkAPI) => {
    try {
      // URLSearchParams 사용하여 데이터 전송
      const data = new URLSearchParams();
      data.append("fullName", fullName);
      data.append("rrn", rrn);
      data.append("email", email);
      data.append("code", code);

      const response = await axios.post(
        `${BASE_URL}/api/document/verify`,
        data
      );
      console.log("응답데이터 : ", response.data);
      return response.data; // 서버에서 인증 토큰 반환
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// getDocument 수정
export const getDocument = createAsyncThunk(
    "document/getDocument",
    async (_, { getState, rejectWithValue }) => {
      const token = getState().auth.token; // Redux에서 auth 테이블의 토큰 가져옴
      console.log("token : ", token); // 토큰 값이 제대로 전달되는지 확인하는 로그
      if (!token) {
        return rejectWithValue("토큰이 존재하지 않습니다.");
      }
      
      try {
        const response = await axios.get(`${BASE_URL}/api/document/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('rsponse : ' , response.data);
        return response.data;
      } catch (error) {
        console.error("Document 가져오기 중 오류 발생:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to fetch document");
      }
    }
  );

const documentSlice = createSlice({
  name: "document",
  initialState: {
    isLoading: false,
    verificationRequested: false,
    documentInfo: null, // document 정보를 저장
    error: null,
  },
  reducers: {
    clearDocumentState: (state) => {
      state.isLoading = false;
      state.verificationRequested = false;
      state.documentInfo = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 인증 코드 요청 상태 처리
    builder
      .addCase(requestVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestVerification.fulfilled, (state) => {
        state.isLoading = false;
        state.verificationRequested = true;
      })
      .addCase(requestVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 인증 코드로 인증 상태 처리
    builder
      .addCase(verifyDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documentInfo = action.payload;
      })
      .addCase(verifyDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // document 정보 가져오기 처리
    builder
      .addCase(getDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documentInfo = action.payload; // 성공 시 document 정보 저장
      })
      .addCase(getDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDocumentState } = documentSlice.actions;
export default documentSlice.reducer;
