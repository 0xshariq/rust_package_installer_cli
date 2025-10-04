<template>
  <div v-if="isLoading" class="loading">
    Loading user profile...
  </div>
  <div v-else-if="isAuthenticated" class="user-profile">
    <h2>Welcome, {{ user?.name }}!</h2>
    <div class="user-info">
      <p><strong>Email:</strong> {{ user?.email }}</p>
      <p><strong>User ID:</strong> {{ user?.sub }}</p>
    </div>
    <LogoutButton />
  </div>
  <div v-else class="not-authenticated">
    <h2>Please log in</h2>
    <LoginButton />
  </div>
</template>

<script>
import { useAuth0 } from '@auth0/auth0-vue';
import LoginButton from './LoginButton.vue';
import LogoutButton from './LogoutButton.vue';

export default {
  components: {
    LoginButton,
    LogoutButton
  },
  setup() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    return {
      user,
      isAuthenticated,
      isLoading
    };
  }
};
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 20px;
}

.user-profile {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.user-info {
  margin: 15px 0;
}

.user-info p {
  margin: 5px 0;
}

.not-authenticated {
  text-align: center;
  padding: 20px;
}
</style>
