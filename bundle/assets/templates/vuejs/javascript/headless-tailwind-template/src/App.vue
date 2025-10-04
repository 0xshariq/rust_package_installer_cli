<template>
  <div class="max-w-md mx-auto space-y-4 mt-10">
    <BaseCard>
      <h2 class="text-xl font-bold mb-4">Contact Form</h2>
      <BaseInput placeholder="Your name" />
      <BaseTextarea placeholder="Your message" class="mt-3" />
      <BaseButton class="mt-4">Submit</BaseButton>
    </BaseCard>
  </div>
</template>

<script>
import BaseButton from './components/BaseButton.vue'
import BaseInput from './components/BaseInput.vue'
import BaseTextarea from './components/BaseTextarea.vue'
import BaseCard from './components/BaseCard.vue'

export default {
  components: {
    BaseButton,
    BaseInput,
    BaseTextarea,
    BaseCard,
  }
}
</script>
