const breakAuth = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        localStorage.removeItem("id");
};

module.exports = {
    breakAuth
};