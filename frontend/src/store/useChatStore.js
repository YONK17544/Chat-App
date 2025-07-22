import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore.js';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,  


    getUsers: async() =>{
        set({ isUsersLoading: true });
        try{
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        }catch(error){
            console.log("Error in getting users", error);
            toast.error(error.response.data.message);
        }finally{
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            // Extract the "messages" field from the response
            set({ messages: res.data.messages }); // Access the array directly
        } catch (error) {
            console.log("Error in getting messages", error);
            toast.error(error.response.data.message || "Failed to fetch messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    // getMessages: async (userId) => {
    //     set({ isMessagesLoading: true });
    //     try {
    //       const res = await axiosInstance.get(`/messages/${userId}`);
    //       set({ messages: Array.isArray(res.data) ? res.data : [] }); // Ensure messages is always an array
    //     } catch (error) {
    //       console.log("Error in getting messages", error);
    //       toast.error(error.response?.data?.message || "Failed to load messages");
    //       set({ messages: [] }); // Fallback to an empty array on error
    //     } finally {
    //       set({ isMessagesLoading: false });
    //     }
    //   },

    // sendMessage: async (messageData) => {
    //     const { selectedUser, messages } = get();
    //     try {
    //       const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
    //       console.log("Response data",res.data);
    //       console.log(messages);
    //       set({ messages: [...messages, res.data] });
    //       console.log("Messages", messages);
    //     } catch (error) {
    //       toast.error(error.response.data.message);
    //     }
    //   },    

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get(); // Get current state
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            
            console.log("Response data:", res.data); // Log response data for debugging
            
            // Ensure `messages` is always an array
            set(() => ({
                messages: Array.isArray(messages) ? [...messages, res.data] : [res.data],
            }));
    
            // Debug updated messages
            console.log("Updated messages (after update):", get().messages); // Access updated state after `set`
        } catch (error) {
            // Log error details for better debugging
            console.error("Error sending message:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "An unexpected error occurred");
        }
    },
    
    //new addition todo: optimize this later
    subscribeToMessages: () =>{
        const { selectedUser } = get();

        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) =>{
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },

    unsubscribeFromMessages: () =>{
        const socket = useAuthStore.getState().socket;

        socket.off("newMessage")
    },

    //todo: optimize this later
    setSelectedUser: (selectedUser) => set({selectedUser }),
}))