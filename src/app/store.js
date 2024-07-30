// store.js
import { configureStore } from '@reduxjs/toolkit';
import patientReducer from '../features/selectedPatient/patientSlice';
import hospitalReducer from '../features/selectHospital/hospitalSlice';

const preloadedState = {
    hospital: {
        hospitalId: localStorage.getItem('hospitalId') || null,
    },
};

export const store = configureStore({
    reducer: {
        patient: patientReducer,
        hospital: hospitalReducer,
    },
    preloadedState,
});
