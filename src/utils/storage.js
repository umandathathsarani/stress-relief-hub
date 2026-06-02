export const saveGameState = (gameId, data) => {
    localStorage.setItem(`stress_hub_${gameId}`, JSON.stringify(data));
};

export const loadGameState = (gameId) => {
    const data = localStorage.getItem(`stress_hub_${gameId}`);
    return data ? JSON.parse(data) : null;
};

export const clearGameState = (gameId) => {
    localStorage.removeItem(`stress_hub_${gameId}`);
};