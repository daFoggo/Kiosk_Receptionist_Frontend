import { useState, useEffect } from "react";
import { InteractionState } from "./useInteraction";

interface UseCCCDVerificationProps {
  webcamData: {
    nums_of_people: number;
    person_datas: Array<{
      role?: string;
    }>;
  };
  currentRole: string;
  resetCccdData: () => void;
  transitionToState: (state: InteractionState) => void;
}

export const useCCCDVerification = ({
  webcamData,
  currentRole,
  resetCccdData,
  transitionToState,
}: UseCCCDVerificationProps) => {
  const [verificationState, setVerificationState] = useState<{
    isVerifying: boolean;
    currentStep: 'idle' | 'verifying' | 'completed';
  }>({
    isVerifying: false,
    currentStep: 'idle'
  });

  // Xử lý khi không có người
  useEffect(() => {
    if (webcamData.nums_of_people === 0) {
      setVerificationState({
        isVerifying: false,
        currentStep: 'idle'
      });
      resetCccdData();
      transitionToState(InteractionState.IDLE);
    }
  }, [webcamData.nums_of_people, resetCccdData, transitionToState]);

  const startVerification = () => {
    setVerificationState({
      isVerifying: true,
      currentStep: 'verifying'
    });
    transitionToState(InteractionState.GUEST_VERIFICATION);
  };

  const completeVerification = () => {
    setVerificationState({
      isVerifying: false,
      currentStep: 'completed'
    });
    transitionToState(InteractionState.CONTACT_DEPARTMENT);
  };

  return {
    isVerifying: verificationState.isVerifying,
    currentStep: verificationState.currentStep,
    startVerification,
    completeVerification,
  };
};