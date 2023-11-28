export const handleLogoutAndRedirect = async (navigate) => {
  try {
    const response = await fetch('/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.status === 200) {
      localStorage.removeItem('token');
      localStorage.removeItem('object_id');
      console.log('Logout successful');
    } else {
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    navigate('/login');
  }
};

