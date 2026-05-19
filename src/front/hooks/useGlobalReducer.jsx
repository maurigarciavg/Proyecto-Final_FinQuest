import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useReducer } from "react";

import storeReducer, { initialStore, persistSession } from "../store";


const StoreContext = createContext();


export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(storeReducer, initialStore());

    useEffect(() => {
        persistSession(store.token, store.user, store.activeProfile, store.currentChild);
    }, [store.token, store.user, store.activeProfile, store.currentChild]);

    return (
        <StoreContext.Provider value={{ store, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}


StoreProvider.propTypes = {
    children: PropTypes.node.isRequired
};


export default function useGlobalReducer() {
    const context = useContext(StoreContext);

    if (!context) {
        throw new Error("useGlobalReducer must be used inside StoreProvider");
    }

    return context;
}
