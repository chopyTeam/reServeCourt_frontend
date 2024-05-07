"use client"
import {StompSessionProvider, useStompClient} from "react-stomp-hooks";
import {useState, useEffect} from "react";
import { NEXT_PUBLIC_WEBSOCKET_URL } from "@/utils/appWebsocket";
import { markNotificationAsRead } from "@/hooks/notification";

export interface Message {
    id: number;
    message: string;
    receiverId: number;
    read: boolean;
}

const Notifications = () => {
    
    const [messages, setMessages] = useState<Message[]>([]);
    const stompClient = useStompClient();

    useEffect(() => {
        if (stompClient) {
            const subscription = stompClient.subscribe('/user/queue/reply', (message) => {
                const parsedMessage = JSON.parse(message.body);
                setMessages(prevMessages => [...prevMessages, ...parsedMessage]);
            });

            stompClient.publish({destination: '/app/broadcast', body: "0"});

            return () => {
                subscription.unsubscribe();
            }
        }
    }, [stompClient]);

    async function markNotification(notificationId: number) {
        try{
            const result = await markNotificationAsRead(notificationId);
            if(result === 200) {
                console.log("Przeczytano powiadomienie");
            } else {
                console.error("Błąd odznaczania powiadomienia");
            }
        } catch (error) {
            console.error("Błąd odznaczania powiadomienia", error);
        }
    }

    return (
        <div className="fixed bottom-0 right-0 m-6 space-y-2 min-w-48 max-w-80 text-wrap">
            {messages.map((message, index) => (
                <div key={index} className="flex flex-col justify-center items-center p-4 bg-white rounded shadow-md shadow-lightGrey">
                    <p className="mb-2 text-center">{message.message}</p>
                    <div onClick={() => markNotification(message.id)} className="bg-mainOrange cursor-pointer text-center border-[1px] border-mainOrange text-mainWhite rounded-full h-8 max-w-48 w-full flex items-center justify-center">
                        <p>OK</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function NotificationComponent() {
    return (
        <StompSessionProvider url={`${NEXT_PUBLIC_WEBSOCKET_URL}`}>
            <Notifications/>
        </StompSessionProvider>
    );
}
