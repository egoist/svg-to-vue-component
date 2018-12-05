<template>
  <div>
    <Icon @click="handleClick" foo="bat asd" class="foo"  />
  </div>
</template>

<script>
import Icon from './icon.svg'

export default {
  components: {
    Icon
  },
  methods: {
    handleClick() {
      alert(new Date())
    }
  }
}
</script>
