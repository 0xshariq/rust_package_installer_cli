<template>
  <div>
    <button @click="login" class="btn btn-primary">Log in</button>
  </div>
</template>

<script>
import { useAuth0 } from '@auth0/auth0-vue';

export default {
  setup() {
    const { loginWithRedirect } = useAuth0();

    const login = () => {
      loginWithRedirect();
    };

    return {
      login
    };
  }
};
</script>
