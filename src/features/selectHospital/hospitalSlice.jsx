import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    hospitalId: localStorage.getItem('hospitalId') || null,
};

export const hospitalSlice = createSlice({
    name: 'hospital',
    initialState,
    reducers: {
        setHospitalId: (state, action) => {
            state.hospitalId = action.payload;
            localStorage.setItem('hospitalId', action.payload); // Store in local storage
        },
    },
});

export const { setHospitalId } = hospitalSlice.actions;

export default hospitalSlice.reducer;
