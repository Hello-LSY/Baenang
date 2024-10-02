import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMemberById = createAsyncThunk(
  'members/fetchMemberById',
  async (memberId, thunkAPI) => {
    try {
      const response = await axios.get(
        `https://api.example.com/members/${memberId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : 'Network error'
      );
    }
  }
);
