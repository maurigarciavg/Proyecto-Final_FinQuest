const getBackendUrl = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!backendUrl) {
        throw new Error("VITE_BACKEND_URL is not defined in the environment.");
    }

    return backendUrl;
};


const buildHeaders = (headers, hasBody) => {
    const nextHeaders = {
        Accept: "application/json",
        ...headers
    };

    if (hasBody && !nextHeaders["Content-Type"]) {
        nextHeaders["Content-Type"] = "application/json";
    }

    return nextHeaders;
};


const parseResponse = async (response) => {
    const contentType = response.headers.get("content-type") || "";
    const responseData = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const message = typeof responseData === "string"
            ? responseData
            : responseData.message || responseData.msg || "Request failed";
        const error = new Error(message);

        error.status = response.status;
        error.data = responseData;
        throw error;
    }

    return responseData;
};


export async function apiRequest(path, options = {}) {

    const hasBody = Boolean(options.body);
    const response = await fetch(`${getBackendUrl()}${path}`, {
        ...options,
        headers: buildHeaders(options.headers || {}, hasBody)
    });

    return parseResponse(response);
}


export const authHeaders = (token) => ({
    Authorization: `Bearer ${token}`
});
