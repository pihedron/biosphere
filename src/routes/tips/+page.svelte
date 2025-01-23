<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'

  let ready = false
  onMount(() => (ready = true))
</script>

<section id="banner" class="auto">
  {#if ready}
    <span id="pill" transition:fly={{ y: -32, duration: 1000 }}>Tips</span>
    <h1 transition:fly={{ y: -32, duration: 1000, delay: 500 }}>
      How can you help?
    </h1>
    <p id="caption" transition:fly={{ y: -32, duration: 1000, delay: 1000 }}>
      Let's see how small changes to your lifestyle can save this planet.
    </p>
  {/if}
  <a class="floating" style="margin-top: 32px;" href="#carbon">
    <Icon fontSize={48}>arrow_downward</Icon>
  </a>
</section>
<section class="auto slab" id="carbon">
  <div class="half">
    <img src="https://images.unsplash.com/photo-1581626221838-9715c0e06049?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="industrial area">
  </div>
  <div class="half">
    <h2>Carbon Footprint <Icon fontSize={'inherit'}>footprint</Icon></h2>
    <p>
      Your carbon footprint is a measure of the amount of
      <em>carbon dioxide</em>
      released into the atmosphere as a result of your daily activities.
    </p>
    <p>
      By reducing your carbon footprint, you are slowing down the rate of global
      warming and making Earth a healthier place.
    </p>
    <Button click={(e) => window.open('/tips/footprint', '_self')}>
      Calculate it!
    </Button>
  </div>
</section>
<section class="auto slab">
  <div class="half">
    <h2>Recycling <Icon fontSize={'inherit'}>recycling</Icon></h2>
    <p>
      It's crucial to know which materials to recycle to conserve natural
      resources and prevent landfills from overflowing.
      <em>Sorting</em> your garbage is an important aspect of reducing the environmental
      impact landfills have on our planet.
    </p>
    <Button click={(e) => window.open('/tips/recycling', '_self')}>
      Sort my waste!
    </Button>
  </div>
  <div class="half">
    <img src="https://www.gme-recycling.com/wp-content/uploads/2023/11/investing-recycling-tecnology.jpg" alt="green city">
  </div>
</section>
