<script lang="ts">
  import { onMount } from 'svelte'
  import Button from '$lib/components/Button.svelte'
  import Nav from '$lib/components/Nav.svelte'
  import '../app.css'
  import { store } from '$lib/firebase'

  let verified = false
  $: links = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Tips',
      href: '/tips',
    },
    {
      name: 'Nearby',
      href: '/nearby',
    },
    verified ? {
      name: 'Exit',
      href: '/exit'
    } : {
      name: 'Join',
      href: '/join',
    },
  ]

  store.subscribe(data => {
    verified = data.verified
  })
</script>

<svelte:head>
  <meta name="og:title" content="Earth needs you!" />
  <meta
    name="og:description"
    content="Our planet is slowly dying. It's up to you to save our environment."
  />
  <meta name="og:url" content="https://biosphere.pages.dev" />
  <title>Biosphere</title>
</svelte:head>

<header>
  <div class="auto">
    <a id="logo" class="center" href="/">Biosphere</a>
    <Nav {links}></Nav>
  </div>
</header>
<main>
  <slot></slot>
</main>
<footer>
  <div class="auto slab">
    <div id="mark">
      <span id="biosphere">Biosphere</span> is the future.
    </div>
  </div>
</footer>
