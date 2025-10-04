<template>
  <div v-if="isLoading">Loading ...</div>
  <div v-else>
    <h2>User Profile</h2>
    <button v-if="!isAuthenticated" @click="login">Log in</button>
    <pre v-if="isAuthenticated">
      <code>{{ user }}</code>
    </pre>
  </div>
</template>

<script setup lang="ts">
import { useAuth0, type User } from '@auth0/auth0-vue';

const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

const login = () => {
  loginWithRedirect();
};
</script>
