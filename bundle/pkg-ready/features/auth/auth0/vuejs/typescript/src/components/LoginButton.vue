<template>
  <div>
    <button @click="login" class="btn btn-primary">Log in</button>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';

const { loginWithRedirect } = useAuth0();

const login = () => {
  loginWithRedirect();
};
</script>
