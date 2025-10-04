import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import { clerkPlugin } from "@clerk/vue";
import router from './router'
import { createPinia } from 'pinia'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk publishable key to the .env.local file");
}
app.use(createPinia())
app.use(router)
const app = createApp(App);
app.use(clerkPlugin, {
  publishableKey: PUBLISHABLE_KEY,
});
app.mount("#app");