import { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'SIGNIN': 
            return {
                signedin: true,
                user: action.payload
            }
        case 'SIGNOUT': 
            return {
                signedin: false,
                user: null
            }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(AuthReducer, {
        signedin: false,
        user: null
    });

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem('userToken'));

        if (user) {
            dispatch({ type: 'SIGNIN', payload: user });
        }

    }, []);

    // console.log('AuthContext state:', state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    );
}