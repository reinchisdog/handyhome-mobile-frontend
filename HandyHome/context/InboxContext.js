// Context: Inbox Context

// Imports
import React, {
   createContext,
   useContext,
   useEffect,
   useState,
   useCallback,
   useRef
} from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './AuthContext';
import { useAppData } from './AppDataContext';
import api from '../lib/api';
import supabase from '../lib/supabase';

const InboxContext = createContext();

export const InboxProvider = ({children}) => {
   // Hooks and States
   const router = useRouter();
   const {user, token, isTokenValid, isAuthReady} = useAuth();
   const {isAppDataReady} = useAppData();

   const [inbox, setInbox] = useState([]);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);

   const [currentChatSession, setCurrentChatSession] = useState(null);

   const [loading, setLoading] = useState(false);
   const [loadingMore, setLoadingMore] = useState(false);
   const [refreshing, setRefreshing] = useState(false);

   // Functions
   // ---- Fetch Inbox List
   const fetchInbox = async (pageNum = 1, isRefresh = false, search) => {
      if ((loading || loadingMore) && !isRefresh) return;

      try {
         if (isRefresh) {
            setRefreshing(true);
            setLoading(false);
         } else if (pageNum === 1) {
            setLoading(true);
            setRefreshing(false);
         } else {
            setLoadingMore(true);
         }

         // console.log('[InboxContext] Fetching Inbox...');
         const inboxResult = await api.get(`/messages/active`, { 
            params: {
               page: pageNum,
               limit: 10,
               ...(search && search.trim() && { search: search.trim() })
            }, 
            headers: {'Authorization': `Bearer ${token}`} }
         );

         // console.log('[InboxContext] Inbox fetched successfully');
         
         const inboxData = inboxResult?.data?.message?.chats;
         // console.log(inboxData);
         if (isRefresh || pageNum === 1) {
            setInbox(inboxData);
         } else {
            setInbox(prev => [...prev, ...inboxData]);
         }

         setHasMore(inboxData.length === 10);

         if (!isRefresh) {
            setPage(pageNum);
         }
      } catch (err) {
         const message = err?.response?.data?.message || err?.message || 
            "Failed to load your chat sessions. Please try again.";
         console.error('[AppDataContext] Failed to fetch Chat Sessions:', message);
      } finally {
         setLoading(false);
         setLoadingMore(false);
         setRefreshing(false);
      }
   }

   // ---- Fetch Specific Inbox Item
   const fetchInboxItem = async (id) => {
      try {
         const itemResult = await api.get(`/messages/active/${id}`, {
            headers: {'Authorization' : `Bearer ${token}`}
         })

         // console.log(itemResult?.data?.message);
         return itemResult?.data?.message;
      } catch (err) {
         console.log(err)
      }
   }

   const refreshInboxItem = async (id) => {
      const updated = await fetchInboxItem(id);

      if (updated) {
         setInbox(prev =>
            prev.map(chat =>
               chat.id === id ? updated : chat
            )
         )
      }
   }

   // ---- Set Chat Info
   const setCurrentChat = (session) => {
      console.log(session);
      setCurrentChatSession(session);
      router.push({
         pathname: '/dashboard/client/chat/[id]',
         params: {id: session.booking_id}
      })
   }
   // ---- Clear Chat Info
   const clearCurrentChat = () => {
      setCurrentChatSession(null);
   }

   // Effects
   // ---- Initialization
   useEffect(() => {
      if (!token || !isAuthReady || !isTokenValid || !user || !isAppDataReady) return;

      const init = async () => {
         await fetchInbox(1, true, null);
      }

      init();
   }, [token, isAuthReady, isTokenValid, user, isAppDataReady])

   // Real Time
   const subscriptionRef = useRef(null);

   const cleanupSubscription = () => {
      if (subscriptionRef.current) {
         subscriptionRef.current.unsubscribe();
         subscriptionRef.current = null;
      }
   }

   const handleSessionChange = async (payload) => {
      const {eventType, new: newRecord} = payload;

      switch (eventType) {
         case 'INSERT': {
            const newSession = await fetchInboxItem(newRecord.id);
            if (newSession) {
               setInbox(prev => {
                  const existing = prev.findIndex(chat => 
                     chat.id === newRecord.id);

                  if (existing === -1) {
                     return [newSession, ...prev]
                  }

                  return prev;
               });
            }
            break;
         }

         case 'UPDATE': {
            if (newRecord.is_active === false) {
               setInbox(prev =>
                  prev.filter(chat => chat.id !== newRecord.id)
               );
            } else {
               const updatedSession = await fetchInboxItem(newRecord.id);
               if (updatedSession) {
                  
                  setInbox(prev => {
                     const updated = prev.map(chat => 
                        chat.id === newRecord.id ? updatedSession : chat);

                     return [...updated].sort((a, b) => 
                        new Date(b.updated_at) - new Date(a.updated_at));
                  })
               }
            }
            break;
         }
      }
   }

   useEffect(() => {
      if (!user?.user_id) {
         cleanupSubscription();
         return;
      }

      cleanupSubscription();

      const filterColumn = user.role === 'User' ? 'user_id' : 'worker_id';

      const changes = supabase
         .channel (`chat-session`)
         .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_sessions',
            filter: `${filterColumn}=eq.${user.user_id}`
         }, (payload) => {
            console.log("INBOX: CHAT INSERT");
            handleSessionChange(payload);
         })
         .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'chat_sessions',
            filter: `${filterColumn}=eq.${user.user_id}`
         }, (payload) => {
            console.log("INBOX: CHAT UPDATE");
            handleSessionChange(payload);
         }).subscribe();

      subscriptionRef.current = changes;

      return () => {
         cleanupSubscription();
      };
   }, [user?.user_id, user?.role]);

   return (
      <InboxContext.Provider
      value={{
         // Data States
         inbox, 
         page,
         setPage,
         currentChatSession,

         // Loading States
         loading,
         loadingMore,
         refreshing,
         hasMore,
         setHasMore,

         // Functions
         fetchInbox,
         fetchInboxItem,
         setCurrentChat,
         clearCurrentChat,
         refreshInboxItem,

         //Errors
      }}>
         {children}
      </InboxContext.Provider>
   )
}

export const useInbox = () => useContext(InboxContext);