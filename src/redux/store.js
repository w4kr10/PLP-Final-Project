import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import pregnancySlice from './slices/pregnancySlice';
import grocerySlice from './slices/grocerySlice';
import chatSlice from './slices/chatSlice';
import notificationSlice from './slices/notificationSlice';
import medicalSlice from './slices/medicalSlice';
import adminSlice from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    pregnancy: pregnancySlice,
    grocery: grocerySlice,
    chat: chatSlice,
    notifications: notificationSlice,
    medical: medicalSlice,
    admin: adminSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
