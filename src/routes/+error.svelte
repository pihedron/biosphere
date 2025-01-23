<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'

  let ready = false
  onMount(() => (ready = true))
</script>

<section>
  {#if ready}
    <div class="content">
      <span id="pill" transition:fly={{ y: -32, duration: 500 }}
        >{$page.status}</span
      >
      <h1 transition:fly={{ y: -32, duration: 500, delay: 250 }}>Oh no!</h1>
      <p transition:fly={{ y: 32, duration: 500, delay: 500 }}>
        We've hit a dead end.
      </p>
      <p transition:fly={{ y: 32, duration: 500, delay: 750 }}>
        Do you want to return to our
        <a href="/">home page</a>?
      </p>
    </div>
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    overflow: auto;
  }

  .content {
    display: block;
    text-align: center;
  }

  h1 {
    justify-content: center;
    margin: 0;
  }

  #pill {
    display: inline-flex;
    width: fit-content;
  }
</style>
