import { createContext, useReducer } from "react";
import { LayoutMode, Global } from "./util";

const StoreContext = createContext();

const StoreAction = {
    NEW_BINDER: "NEW_BINDER",
    NEW_GALLERY: "NEW_GALLERY",

    SET_CARD: "SET_CARD",
    DELETE_CARD: "DELETE_CARD",
    SWAP_CARDS: "SWAP_CARDS",

    DELETE_PAGE: "DELETE_PAGE",
    INSERT_PAGE: "INSERT_PAGE",

    IMPORT_BINDER: "IMPORT_BINDER",
    IMPORT_GALLERY: "IMPORT_GALLERY"
};

export function StoreContextProvider({children}) {
    const [store, dispatch] = useReducer(storeReducer, {
        layout: LayoutMode.BINDER,
        cards: new Array(Global.defaultBinderSize).fill(null),
    });

    function storeReducer(store, action) {
        const {type, payload} = action;
        switch(type) {
            case StoreAction.NEW_BINDER: {
                const newCards = new Array(Global.defaultBinderSize).fill(null);
                return {
                    ...store,
                    layout: LayoutMode.BINDER,
                    cards: newCards
                };
            }
            case StoreAction.NEW_GALLERY: {
                const newCards = new Array(Global.defaultGallerySize).fill(null);
                return {
                    ...store,
                    layout: LayoutMode.GALLERY,
                    cards: newCards
                };
            };
            case StoreAction.SET_CARD: {
                const newCards = [...store.cards];
                newCards[payload.index] = store.createCard(payload.src, payload.text);
                return {
                    ...store,
                    cards: newCards
                };
            }
            case StoreAction.DELETE_CARD: {
                const newCards = [...store.cards];
                newCards[payload.index] = null;
                return {
                    ...store,
                    cards: newCards
                };
            }
            case StoreAction.SWAP_CARDS: {
                const newCards = [...store.cards];
                newCards[payload.srcIndex] = store.cards[payload.destIndex];
                newCards[payload.destIndex] = store.cards[payload.srcIndex];
                return {
                    ...store,
                    cards: newCards
                };
            }
            case StoreAction.DELETE_PAGE: {
                // deletes cards [payload.pageIndex*9 ... payload.pageIndex*9+8]
                const newCards = [
                    ...store.cards.slice(0, payload.pageIndex*9),
                    ...store.cards.slice(payload.pageIndex*9+9)];
                return {
                    ...store,
                    cards: newCards
                };
            }
            case StoreAction.INSERT_PAGE: {
                // add i*9 - (i+1)*9
                const newPage = new Array(Global.cardsPerPage).fill(null);
                const newCards = [
                    ...store.cards.slice(0, payload.pageIndex*9),
                    ...newPage,
                    ...store.cards.slice(payload.pageIndex*9)
                ];
                return {
                    ...store,
                    cards: newCards
                };
            }
            case StoreAction.IMPORT_BINDER: {
                return {
                    ...store,
                    layout: LayoutMode.BINDER,
                    cards: payload.cards
                };
            }
            case StoreAction.IMPORT_GALLERY: {
                return {
                    ...store,
                    layout: LayoutMode.GALLERY,
                    cards: payload.cards
                };
            };
            default:
                return;
        }
    }

    store.createCard = (src, text) => {
        return {
            src, text
        };
    };

    store.hasCard = (index) => {
        return store.cards[index] != null;
    };

    store.getNumCards = () => {
        return store.cards.length;
    };

    store.getCard = (index) => {
        return store.cards[index];
    }

    store.getCardSrc = (index) => {
        return store.cards[index]?.src;
    };

    store.getCardText = (index) => {
        return store.cards[index]?.text;
    }

    store.getLayout = () => {
        return store.layout;
    };

    store.setCard = (index, src, text) => {
        dispatch({
            type: StoreAction.SET_CARD,
            payload: {index, src, text}
        })
    }

    store.deleteCard = (index) => {
        dispatch({
            type: StoreAction.DELETE_CARD,
            payload: {index}
        });
    };

    store.swapCards = (srcIndex, destIndex) => {
        dispatch({
            type: StoreAction.SWAP_CARDS,
            payload: { srcIndex, destIndex }
        });
    };

    store.deletePage = (pageIndex) => {
        dispatch({
            type: StoreAction.DELETE_PAGE,
            payload: {pageIndex}
        })
    };

    store.insertPage = (pageIndex) => {
        dispatch({
            type: StoreAction.INSERT_PAGE,
            payload: {pageIndex}
        })
    };

    store.newBinder = () => {
        dispatch({
            type: StoreAction.NEW_BINDER,
            payload: {}
        });
    };

    store.newGallery = () => {
        dispatch({
            type: StoreAction.NEW_GALLERY,
            payload: {}
        });
    };

    store.importBinder = (cards) => {
        dispatch({
            type: StoreAction.IMPORT_BINDER,
            payload: {cards}
        });
    };

    store.importGallery = (cards) => {
        dispatch({
            type: StoreAction.IMPORT_GALLERY,
            payload: {cards}
        });
    };

    return (
        <StoreContext.Provider value={{store}}>
            {children}
        </StoreContext.Provider>
    );
}

export default StoreContext;