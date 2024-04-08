const handleLogout = () => {
    // Clear the session token from local storage
    localStorage.removeItem('sessionToken');
    // Redirect the user to the login page
  };

  export default handleLogout