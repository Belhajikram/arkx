export const processUserData = ({users}) => {
    const femaleUser = users.filter(user => user.gender !== 'male')
    const femaleDescription = femaleUser.map(({ firstName, lastName, age }) => (`Name: ${firstName} ${lastName}, Age: ${age}`));
    return {
        femaleUser,
        femaleDescription
    }
 
};
console.log(processUserData(data))
