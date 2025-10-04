import "./assets/main.css";
import { createAuth0 } from "@auth0/auth0-vue";
import { createApp } from "vue";
import { createPinia } from "pinia";

const app = createApp(App);
import App from "./App.vue";
import router from "./router";
app.use(createPinia());
app.use(router);

app.use(
  createAuth0({
    domain: "{yourDomain}",
    clientId: "{yourClientId}",
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  })
);

app.mount("#app");
