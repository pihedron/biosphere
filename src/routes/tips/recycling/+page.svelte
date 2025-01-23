<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'

  const def = 'WAITING'

  let ready = false
  onMount(() => (ready = true))

  let src = '#'
  let text = def

  function change(ev: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
    let { files } = (ev.target as HTMLInputElement)
    if (!files) return
    text = def
    const file = files[0]
    const reader = new FileReader()
    reader.onload = async e => {
      src = e.target?.result as string
      const mimeType = src.split(';')[0].split(':')[1]
      const data = src.split(',')[1]
      const response = await fetch('/ai', {
        method: 'POST',
        body: JSON.stringify({ data, mimeType }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      text = await response.json()
    }
    reader.readAsDataURL(file)
  }
</script>

<section id="banner" class="auto">
  {#if ready}
    <span id="pill" transition:fly={{ y: -32, duration: 1000 }}>Recycling</span>
    <h1 transition:fly={{ y: -32, duration: 1000, delay: 500 }}>
      Sort your waste!
    </h1>
    <p id="caption" transition:fly={{ y: -32, duration: 1000, delay: 1000 }}>
      Upload an image to start sorting your waste using AI.
    </p>
    <Button click={e => window.open('#ai', '_self')}>Let's go!</Button>
  {/if}
</section>
<div class="auto upload" id="ai">
  <h2>Waste Sorter</h2>
  <div>
    <p>The AI will look at your image and place it in 4 categories:</p>
    <ul>
      <li><strong style="color: #00dd80;">ORGANIC</strong> = food scraps and leftovers</li>
      <li><strong style="color: var(--accent);">RECYCLABLE</strong> = plastics</li>
      <li><strong style="color: #ff4040;">LANDFILL</strong> = general waste</li>
      <li><strong>ERROR</strong> = image could not be classified</li>
    </ul>
  </div>
  <input type="file" accept="image/*" id="image" capture="environment" on:change={change}/>
  <label for="image"> Upload </label>
  <img {src}>
  <div>{text}</div>
</div>

<style>
  input[type='file'] {
    display: none;
  }

  label {
    padding: 8px 16px;
    background-color: transparent;
    color: var(--color);
    border-radius: 4px;
    border: 2px solid var(--color);
    transition: all 250ms;
    cursor: pointer;
  }

  label:hover {
    background-color: var(--color);
    color: var(--bg);
  }

  img {
    max-width: calc(min(1024px, 100%));
    max-height: 40vh;
    border-radius: 8px;
  }

  .upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 64px 32px;
    gap: 16px;
    height: 100vh;
  }
</style>
