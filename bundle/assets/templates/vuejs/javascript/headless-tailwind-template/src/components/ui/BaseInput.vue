<!-- components/BaseInput.vue -->
<template>
  <input
    type="text"
    :placeholder="placeholder"
    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "Enter text"
    }
  }
}
</script>
