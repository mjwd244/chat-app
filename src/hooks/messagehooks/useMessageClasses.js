import { useEffect } from 'react';

export const useMessageClasses = (componentType, messageClasses, setMessageClass, setMessageInfoClass, setMessageContentClass) => {
  useEffect(() => {
    if (componentType === 'chat') {
      setMessageClass(messageClasses.message);
      setMessageInfoClass(messageClasses.messageInfo);
      setMessageContentClass(messageClasses.messageContent);
    } else if (componentType === 'group') {
      setMessageClass(messageClasses.messagegroup);
      setMessageInfoClass(messageClasses.groupmessageInfo);
      setMessageContentClass(messageClasses.groupmessageContent);
    }
  }, [componentType, messageClasses, setMessageClass, setMessageInfoClass, setMessageContentClass]);
};