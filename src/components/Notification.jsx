import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

// Notification types
const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
};

// Delay utility
const sleep = (ms) =>
  new Promise((resolve) => {
    const id = setTimeout(resolve, ms);
    sleep.timeouts.push(id);
  });
sleep.timeouts = [];

// Clear all timeouts
const clearAllTimeouts = () => {
  sleep.timeouts.forEach((id) => clearTimeout(id));
  sleep.timeouts = [];
};

// Animated Notification Icon (restored from your original UI)
const NotificationIcon = ({ type }) => {
  const color = type === NOTIFICATION_TYPES.SUCCESS ? "bg-green-500" : "bg-red-500";

  return (
    <motion.div
      className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}
      initial={{ opacity: 0, scale: 0.6, rotate: type === 'error' ? -45 : 0 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: 0.4, duration: 0.3, ease: 'easeOut' }}
    >
      {type === NOTIFICATION_TYPES.SUCCESS ? (
        <Check className="h-5 w-5 text-white" />
      ) : (
        <X className="h-5 w-5 text-white" />
      )}
    </motion.div>
  );
};

// Message component
const NotificationMessage = ({ message, textColor }) => (
  <div className="w-full pl-12">
    <p className={`${textColor} text-center font-medium`}>{message}</p>
  </div>
);

const NotificationPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [notificationType, setNotificationType] = useState(NOTIFICATION_TYPES.SUCCESS);
  const [customMessage, setCustomMessage] = useState(null);

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  const getNotificationDetails = () => {
    if (notificationType === NOTIFICATION_TYPES.SUCCESS) {
      return {
        message: "Your data stored successfully",
        color: "bg-green-500",
        textColor: "text-green-800",
        timerColor: "bg-green-400",
      };
    }
    return {
      message: "Your data removed from DB",
      color: "bg-red-500",
      textColor: "text-red-800",
      timerColor: "bg-red-400",
    };
  };

  const { message, color, textColor, timerColor } = getNotificationDetails();

  const triggerNotification = async (type = NOTIFICATION_TYPES.SUCCESS, msg = null) => {
    clearAllTimeouts();
    setIsVisible(false);
    setIsExpanded(false);
    setShowTimer(false);
    setNotificationType(type);
    setCustomMessage(msg);

    await sleep(100);
    setIsVisible(true);

    await sleep(300);
    setIsExpanded(true);

    await sleep(1000);
    setShowTimer(true);

    await sleep(4000);
    setShowTimer(false);
    setIsExpanded(false);

    await sleep(300);
    setIsVisible(false);
  };

  const dismissNotification = () => {
    clearAllTimeouts();
    setShowTimer(false);
    setIsExpanded(false);
    setTimeout(() => setIsVisible(false), 300); // Allow collapse animation
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => triggerNotification(NOTIFICATION_TYPES.SUCCESS)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
        >
          Save Data
        </button>
        <button
          onClick={() => triggerNotification(NOTIFICATION_TYPES.ERROR)}
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300"
        >
          Remove Data
        </button>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            role="alert"
            aria-live="assertive"
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="bg-white shadow-xl relative overflow-hidden"
              initial={{ width: 64, height: 64, borderRadius: 32 }}
              animate={
                isExpanded
                  ? { width: 320, height: 80, borderRadius: 12 }
                  : { width: 64, height: 64, borderRadius: 32 }
              }
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* Close button */}
              {isExpanded && (
                <button
                  onClick={dismissNotification}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {isExpanded ? (
                <motion.div
                  className="px-4 w-full flex flex-col items-center justify-center h-full relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {/* Animated icon */}
                  <motion.div
                    className="absolute left-4 w-8 h-8 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <NotificationIcon type={notificationType} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="w-full pl-12"
                  >
                    <NotificationMessage
                      message={customMessage || message}
                      textColor={textColor}
                    />
                  </motion.div>

                  {/* Timer bar */}
                  {showTimer && (
                    <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gray-200 overflow-hidden">
                      <motion.div
                        className={`${timerColor} h-full`}
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 4, ease: "linear" }}
                      />
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <NotificationIcon type={notificationType} />
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
