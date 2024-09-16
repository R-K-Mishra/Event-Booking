import { createContext, useReducer } from 'react';

export const LoadingContext = createContext();

export const LoadingReducer = (loadingState, action) => {
    switch (action.type) {
        case 'LOADING':
            return true;
        case 'RESET':
            return false;
        default:
            return loadingState;
    }
}

export const LoadingContextProvider = ({ children }) => {

    const [loadingState, loadingDispatch] = useReducer(LoadingReducer, true);

    return(
        <LoadingContext.Provider value={{ loadingState, loadingDispatch }}>
            { children }
        </LoadingContext.Provider>    
    );
}