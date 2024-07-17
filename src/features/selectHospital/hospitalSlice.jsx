// hospitalSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const hospitalSlice = createSlice({
    name: 'hospital',
    initialState: {
        hospitalId: null,
    },
    reducers: {
        setHospitalId: (state, action) => {
            state.hospitalId = action.payload;
        },
    },
});

export const { setHospitalId } = hospitalSlice.actions;

export default hospitalSlice.reducer;
