export default {
    SET_USER: (state, newUser) => {
        state.user.phone = newUser.phone;
        state.user.username = newUser.username;
        state.user.email = newUser.email;
        state.user.id = newUser.id;
    },
}