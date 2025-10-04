<template>
  <div>
    <button @click="handleLogout" class="btn btn-secondary">Log out</button>
  </div>
</template>

<script>
import { useAuth0 } from '@auth0/auth0-vue';

export default {
  setup() {
    const { logout } = useAuth0();

    const handleLogout = () => {
      logout({ 
        logoutParams: { 
          returnTo: window.location.origin 
        } 
      });
    };

    return {
      handleLogout
    };
  }
};
</script>
