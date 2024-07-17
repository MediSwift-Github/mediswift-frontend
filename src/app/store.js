// store.js
import { configureStore } from '@reduxjs/toolkit';
import patientReducer from '../features/selectedPatient/patientSlice';
import hospitalReducer from '../features/selectHospital/hospitalSlice';

export const store = configureStore({
    reducer: {
        patient: patientReducer,
        hospital: hospitalReducer,
    },
});
