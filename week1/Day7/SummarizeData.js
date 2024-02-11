export const summarizeAge = (processedData) => {
    return processedData.reduce((totalAge, user) => {
        return totalAge + user.age;
    }, 0);
};
