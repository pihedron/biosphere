<script lang="ts">
  export let fontSize: number | string
</script>

<span
  class="material-symbols-rounded"
  style="font-size: {typeof fontSize == 'string' ? fontSize : fontSize + 'px'};"
>
  <slot></slot>
</span>

<style>
  .material-symbols-rounded {
    user-select: none;
    font-variation-settings:
      'FILL' 1,
      'wght' 400,
      'GRAD' 0,
      'opsz' 24;
  }
</style>
