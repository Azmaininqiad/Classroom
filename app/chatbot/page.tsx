// "use client";
// import React, { useEffect, useState } from "react";

// export default function TavusVideoPage() {
//   const [conversationUrl, setConversationUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const startConversation = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch("https://oneedu.onrender.com/api/start-tavus-conversation", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({})
//         });
//         if (!res.ok) {
//           const err = await res.json();
//           throw new Error(err.detail || "Failed to start Tavus conversation");
//         }
//         const data = await res.json();
//         setConversationUrl(data.conversation_url);
//       } catch (e: any) {
//         setError(e.message || "Unknown error");
//       } finally {
//         setLoading(false);
//       }
//     };
//     startConversation();
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <h1 className="text-2xl font-bold mb-4 text-indigo-700">EduBot AI Video Conversation</h1>
//       {loading && (
//         <div className="flex flex-col items-center justify-center h-96">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
//           <span className="text-indigo-600">Starting video conversation...</span>
//         </div>
//       )}
//       {error && (
//         <div className="text-red-600 font-semibold">{error}</div>
//       )}
//       {conversationUrl && !loading && !error && (
//         <iframe
//           src={conversationUrl}
//           allow="camera; microphone; fullscreen; display-capture"
//           className="w-full max-w-3xl h-[600px] rounded-lg border shadow-lg"
//           style={{ minHeight: 400 }}
//           title="Tavus Video Conversation"
//         />
//       )}
//     </div>
//   );
// } 


"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";

export default function TavusVideoPage() {
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState(false);
  
  // Use ref to prevent double calls in React StrictMode
  const hasStarted = useRef(false);

  const endConversation = useCallback(async (convId: string) => {
    if (isEnding) return; // Prevent multiple calls
    setIsEnding(true);
    
    try {
      const res = await fetch("https://oneedu.onrender.com/api/end-tavus-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: convId })
      });
      
      if (!res.ok) {
        console.error("Failed to end conversation on server");
      } else {
        console.log("Conversation ended successfully on Tavus server");
      }
    } catch (error) {
      console.error("Error ending conversation:", error);
    } finally {
      setIsEnding(false);
    }
  }, [isEnding]);

  const startConversation = useCallback(async () => {
    if (hasStarted.current) return; // Prevent double execution
    hasStarted.current = true;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("https://oneedu.onrender.com/api/start-tavus-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to start Tavus conversation");
      }
      
      const data = await res.json();
      setConversationUrl(data.conversation_url);
      setConversationId(data.conversation_id);
    } catch (e: any) {
      setError(e.message || "Unknown error");
      hasStarted.current = false; // Reset on error to allow retry
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startConversation();
  }, [startConversation]);

  // Cleanup: End conversation when component unmounts or page is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (conversationId) {
        // Use sendBeacon for reliable cleanup on page unload
        navigator.sendBeacon(
          "https://oneedu.onrender.com/api/end-tavus-conversation",
          JSON.stringify({ conversation_id: conversationId })
        );
      }
    };

    const handleUnload = () => {
      if (conversationId) {
        endConversation(conversationId);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    // Cleanup function for component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
      
      if (conversationId && !isEnding) {
        endConversation(conversationId);
      }
    };
  }, [conversationId, endConversation, isEnding]);

  const handleEndConversation = async () => {
    if (conversationId) {
      await endConversation(conversationId);
      setConversationUrl(null);
      setConversationId(null);
      hasStarted.current = false; // Allow restart if needed
    }
  };

  const handleRestart = () => {
    setConversationUrl(null);
    setConversationId(null);
    setError(null);
    hasStarted.current = false;
    startConversation();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">EduBot AI Video Conversation</h1>
      
      {loading && (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
          <span className="text-indigo-600">Starting video conversation...</span>
        </div>
      )}
      
      {error && (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-red-600 font-semibold text-center">{error}</div>
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {conversationUrl && !loading && !error && (
        <div className="w-full max-w-3xl space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Conversation ID: {conversationId}
            </span>
            <button
              onClick={handleEndConversation}
              disabled={isEnding}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isEnding ? "Ending..." : "End Conversation"}
            </button>
          </div>
          
          <iframe
            src={conversationUrl}
            allow="camera; microphone; fullscreen; display-capture"
            className="w-full h-[600px] rounded-lg border shadow-lg"
            style={{ minHeight: 400 }}
            title="Tavus Video Conversation"
          />
        </div>
      )}
    </div>
  );
} 
