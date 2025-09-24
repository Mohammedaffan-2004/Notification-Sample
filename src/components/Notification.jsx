import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

const NotificationPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [notificationType, setNotificationType] = useState('success');
  const [showTimer, setShowTimer] = useState(false);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutsRef.current = [];
  };

  const triggerNotification = (type = 'success') => {
    // Reset states
    setIsVisible(false);
    setIsExpanded(false);
    setShowTimer(false);
    setNotificationType(type);
    
    // Clear any existing timeouts
    clearAllTimeouts();
    
    // Start animation sequence
    const id1 = setTimeout(() => {
      setIsVisible(true); // Circle appears
      
      // Expand to show message
      const id2 = setTimeout(() => {
        setIsExpanded(true);
        
        // Start timer after 1 second delay
        const id3 = setTimeout(() => {
          setShowTimer(true);
          
          // Collapse after 5 seconds total (4 seconds after timer starts)
          const id4 = setTimeout(() => {
            setShowTimer(false);
            setIsExpanded(false);
            
            // Hide after collapse animation
            const id5 = setTimeout(() => {
              setIsVisible(false);
            }, 300);
            timeoutsRef.current.push(id5);
          }, 4000); // 4 seconds after timer starts
          timeoutsRef.current.push(id4);
        }, 1000); // 1 second delay before timer starts
        timeoutsRef.current.push(id3);
      }, 300);
      timeoutsRef.current.push(id2);
    }, 100);
    timeoutsRef.current.push(id1);
  };

  useEffect(() => {
    // Clean up timeouts on unmount
    return () => {
      clearAllTimeouts();
    };
  }, []);

  // Get message and color based on notification type
  const getNotificationDetails = () => {
    if (notificationType === 'success') {
      return {
        message: "Your data stored successfully",
        color: "bg-green-500",
        textColor: "text-green-800",
        timerColor: "bg-green-400"
      };
    } else {
      return {
        message: "Your data removed from DB",
        color: "bg-red-500",
        textColor: "text-red-800",
        timerColor: "bg-red-400"
      };
    }
  };

  const { message, color, textColor, timerColor } = getNotificationDetails();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => triggerNotification('success')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 cursor-pointer"
        >
          Save Data 
        </button>
        <button
          onClick={() => triggerNotification('error')}
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300 cursor-pointer"
        >
          Remove Data 
        </button>
      </div>
      
      {/* Notification Popup */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="bg-white shadow-xl overflow-hidden"
              initial={{ width: 64, height: 64, borderRadius: 32 }}
              animate={
                isExpanded
                  ? { width: 320, height: 80, borderRadius: 12 }
                  : { width: 64, height: 64, borderRadius: 32 }
              }
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
            >
              {isExpanded ? (
                <>
                  <motion.div
                    className="px-4 w-full flex flex-col items-center justify-center h-full relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    {/* Status icon on the left */}
                    <motion.div
                      className={`absolute left-4 w-8 h-8 rounded-full ${color} flex items-center justify-center`}
                      initial={{ x: 0, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ 
                        delay: 0.3, 
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                    >
                      {notificationType === 'success' ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                        >
                          <Check className="h-5 w-5 text-white" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ rotate: -45, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                        >
                          <X className="h-5 w-5 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                    
                    <motion.div 
                      className="w-full pl-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      <p className={`${textColor} text-center font-medium`}>
                        {message}
                      </p>
                    </motion.div>
                  </motion.div>
                  
                  {/* Timer bar - shows after 1s delay and runs for 4s */}
                  {showTimer && (
                    <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gray-200 overflow-hidden">
                      <motion.div
                        className={`${timerColor} h-full`}
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 4, ease: "linear" }} // Runs for 4 seconds
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
                    {notificationType === 'success' ? (
                      <Check className="h-6 w-6 text-white" />
                    ) : (
                      <X className="h-6 w-6 text-white" />
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPopup;