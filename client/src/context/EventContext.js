import { createContext, useReducer, useEffect } from 'react';

export const EventContext = createContext();

export const EventReducer = (state, action) => {
    switch (action.type) {
        case 'SET_EVENTS': 
            return {
                events: action.payload
            }
        case 'CREATE_EVENT':
            return {
                events: [action.payload, ...state.events]
            }
        case 'UPDATE_EVENT':
            return {
                events: state.events.map(event => {
                    return event._id === action.payload._id ? action.payload : event
                })
            }
        case 'DELETE_EVENT':
            return {
                events: state.events.filter(e => e._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const EventContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(EventReducer, {
        events: null
    });

    useEffect(() => {

        const events = JSON.parse(localStorage.getItem('events'));

        if (events) {
            dispatch({ type: 'SET_EVENTS', payload: events.events });
        }

    }, []);

    // console.log('EventContextState', state);

    return (
        <EventContext.Provider value={{ ...state, dispatch }}>
            { children }
        </EventContext.Provider>
    );
}