// Library
import { createContext, useContext, useReducer, useCallback } from 'react';

// Interface and utils
import {
  IInteractionState,
  IInteractionContextState,
  IInteractionProviderProps,
  InteractionState
} from "@/models/InteractionContext/InteractionContext";
import { INTERACTIONFLOW } from '@/utils/constants';

// Define action types
type InteractionAction = 
  | { type: 'TRANSITION'; payload: InteractionState }
  | { type: 'RESET' };

// Create initial state
const initialState: IInteractionContextState = {
  currentState: InteractionState.IDLE,
  message: INTERACTIONFLOW.idle.message,
  videoPath: INTERACTIONFLOW.idle.videoPath,
  transitionTo: () => {},
};

// Create context
const InteractionContext = createContext<IInteractionContextState>(initialState);

// Create reducer
function interactionReducer(
  state: IInteractionContextState,
  action: InteractionAction
): IInteractionContextState {
  switch (action.type) {
    // Transition to a new state
    case 'TRANSITION': {
      const newState = action.payload;
      const stateConfig = INTERACTIONFLOW[newState] as IInteractionState;
      
      if (!stateConfig) {
        console.error(`Invalid state transition: ${newState}`);
        return {
          ...state,
          currentState: InteractionState.ERROR,
          message: INTERACTIONFLOW.error.message,
          videoPath: INTERACTIONFLOW.error.videoPath,
        };
      }
      
      return {
        ...state,
        currentState: newState,
        message: stateConfig.message,
        videoPath: stateConfig.videoPath,
      };
    }
    
    // Reset to initial state
    case 'RESET':
      return {
        ...initialState,
        transitionTo: state.transitionTo, 
      };
      
    default:
      return state;
  }
}

// Create provider
export function InteractionProvider({ children }: IInteractionProviderProps) {
  const [state, dispatch] = useReducer(interactionReducer, initialState);
  
  const transitionTo = useCallback((newState: InteractionState) => {
    dispatch({ type: 'TRANSITION', payload: newState });
  }, []);
  
  const value = {
    ...state,
    transitionTo,
  };
  
  return (
    <InteractionContext.Provider value={value}>
      {children}
    </InteractionContext.Provider>
  );
}

// Custom hook for using the context
export function useInteraction() {
  const context = useContext(InteractionContext);
  
  if (!context) {
    throw new Error('useInteraction must be used within an InteractionProvider');
  }
  
  return context;
}
