export const getChildDashboard = async (childId) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}api/child-dashboard/${childId}`
        );

        if (!response.ok) {
            throw new Error("Error al obtener el dashboard");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};