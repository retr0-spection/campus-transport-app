import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (id) => {
        const response = await axios.get(`https://gateway.tandemworkflow.com/api/v1/notification/notifications/user/${id}`);
        return response.data;
    }
);

export const deleteNotifications = createAsyncThunk(
    'notifications/deleteNotifications',
    async (ids) => {
        await Promise.all(ids.map(id => 
            axios.delete(`https://gateway.tandemworkflow.com/api/v1/notification/notifications/${id}`)
        ));
        return ids; 
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notifications/markNotificationAsRead',
    async (id) => {
        const response = await axios.post(`https://gateway.tandemworkflow.com/api/v1/notification/notifications/${id}/read`);
        return response.data;
    }
);

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteNotifications.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(notification => 
                    !action.payload.includes(notification.id)
                );
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const updatedNotification = action.payload; // This should be the updated notification
                const index = state.notifications.findIndex(notification => notification.id === updatedNotification.id);
                if (index !== -1) {
                    state.notifications[index] = updatedNotification; 
                }
            });
    },
});

export const { clearNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
