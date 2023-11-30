export const formatDuration = (nanoseconds) => {
    const seconds = nanoseconds / 1e9;
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    let durationString = "";

    if (days > 0) {
        durationString += `${days}d `;
    }

    if (hours > 0 || days > 0) {
        durationString += `${hours}h `;
    }

    durationString += `${minutes}m`;

    return durationString.trim();
};

export const formatDate = (date) => {
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    };

    return new Date(date).toLocaleString("en-GB", options);
};
