// notificationService.js
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "../firebase/config";
import { registerFCMToken } from "./api";
import toast from "react-hot-toast";

const messaging = getMessaging(app);

export const requestNotificationPermission = async (userId) => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_VAPID_KEY
            });
            
            if (token) {
                console.log("FCM Token:", token);
                await registerFCMToken(userId, token);
                return token;
            } else {
                console.warn("No registration token available. Request permission to generate one.");
            }
        }
    } catch (error) {
        console.error("An error occurred while retrieving token:", error);
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log("Foreground Message:", payload);
            toast(payload.notification.body, {
                icon: '🔔',
                duration: 4000,
                style: {
                    background: '#1d1c27',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontWeight: 600,
                }
            });
            resolve(payload);
        });
    });
