const AUTH_STORAGE_KEY = "jwt-example-session";

const readPersistedSession = () => {
  if (typeof window === "undefined") {
    return { token: null, user: null, activeProfile: null, currentChild: null };
  }

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawSession) {
    return { token: null, user: null, activeProfile: null, currentChild: null };
  }

  try {
    const parsedSession = JSON.parse(rawSession);
    return {
      token: parsedSession.token || null,
      user: parsedSession.user || null,
      activeProfile: parsedSession.activeProfile || null,
      currentChild: parsedSession.currentChild || null,
    };
  } catch (error) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return { token: null, user: null, activeProfile: null, currentChild: null };
  }
};

export const persistSession = (token, user, activeProfile = null, currentChild = null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!token || !user) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ token, user, activeProfile, currentChild }),
  );
};

export const initialStore = () => {
  const persistedSession = readPersistedSession();

  return {
    token: persistedSession.token,
    user: persistedSession.user,
    authChecked: false,
    currentChild: persistedSession.currentChild,
    activeProfile: persistedSession.activeProfile,
    products: [],
    orders: [],
    loading: {
      auth: false,
      products: false,
      orders: false,
      checkout: false,
    },
    errors: {
      auth: null,
      products: null,
      orders: null,
      checkout: null,
    },
    notice: null,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "auth_request":
      return {
        ...store,
        loading: { ...store.loading, auth: true },
        errors: { ...store.errors, auth: null },
      };

    case "auth_success":
      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user,
        authChecked: true,
        loading: { ...store.loading, auth: false },
        errors: { ...store.errors, auth: null },
      };

    case "auth_failure":
      return {
        ...store,
        loading: { ...store.loading, auth: false },
        errors: { ...store.errors, auth: action.payload },
        authChecked: true,
      };

    case "finish_auth_check":
      return {
        ...store,
        authChecked: true,
        loading: { ...store.loading, auth: false },
      };

    case "clear_session":
      return {
        ...store,
        token: null,
        user: null,
        activeProfile: null,
        currentChild: null,
        orders: [],
        authChecked: true,
        loading: {
          ...store.loading,
          auth: false,
          orders: false,
          checkout: false,
        },
        errors: { ...store.errors, auth: null, orders: null, checkout: null },
        notice: action.payload || "Sesion cerrada.",
      };

    case "products_request":
      return {
        ...store,
        loading: { ...store.loading, products: true },
        errors: { ...store.errors, products: null },
      };

    case "products_success":
      return {
        ...store,
        products: action.payload,
        loading: { ...store.loading, products: false },
        errors: { ...store.errors, products: null },
      };

    case "products_failure":
      return {
        ...store,
        loading: { ...store.loading, products: false },
        errors: { ...store.errors, products: action.payload },
      };

    case "orders_request":
      return {
        ...store,
        loading: { ...store.loading, orders: true },
        errors: { ...store.errors, orders: null },
      };

    case "orders_success":
      return {
        ...store,
        orders: action.payload,
        loading: { ...store.loading, orders: false },
        errors: { ...store.errors, orders: null },
      };

    case "orders_failure":
      return {
        ...store,
        loading: { ...store.loading, orders: false },
        errors: { ...store.errors, orders: action.payload },
      };

    case "checkout_request":
      return {
        ...store,
        loading: { ...store.loading, checkout: true },
        errors: { ...store.errors, checkout: null },
      };

    case "checkout_success":
      return {
        ...store,
        orders: [action.payload, ...store.orders],
        loading: { ...store.loading, checkout: false },
        errors: { ...store.errors, checkout: null },
        notice: "Orden creada correctamente.",
      };

    case "checkout_failure":
      return {
        ...store,
        loading: { ...store.loading, checkout: false },
        errors: { ...store.errors, checkout: action.payload },
      };

    case "set_notice":
      return {
        ...store,
        notice: action.payload,
      };

    case "clear_notice":
      return {
        ...store,
        notice: null,
      };

    case "set_child":
      return {
        ...store,
        currentChild: action.payload,
      };

    case "set_active_profile":
      return {
        ...store,
        activeProfile: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}
