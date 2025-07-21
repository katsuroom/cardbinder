import { createContext, useReducer, useRef } from "react";

const StoreContext = createContext();

const StoreAction = {
    SET_HAS_CARD: "SET_HAS_CARD"
};

export function StoreContextProvider({children}) {
    const [store, dispatch] = useReducer(storeReducer, {
        hasCard: new Array(9*48).fill(false)
    });

    function storeReducer(store, action) {
        const {type, payload} = action;
        switch(type) {
            case StoreAction.SET_HAS_CARD: {
                const newHasCard = [...store.hasCard];
                newHasCard[payload.index] = payload.value;
                return {
                    ...store,
                    hasCard: newHasCard
                };
            }
            default:
                return;
        }
    }

    store.setHasCard = function(index, value) {
        dispatch({
            type: StoreAction.SET_HAS_CARD,
            payload: { index, value }
        });
    }

    return (
        <StoreContext.Provider value={{store}}>
            {children}
        </StoreContext.Provider>
    );
}

export default StoreContext;