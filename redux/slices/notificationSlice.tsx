import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: [],
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications(state, action) {
            state.data = action.payload;
        },
        clearNotifications(state) {
            state.data = [];
        },
    },
});

export const { setNotifications, clearNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
