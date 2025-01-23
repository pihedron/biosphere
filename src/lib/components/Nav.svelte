<script lang="ts">
  export let links: { name: string, href: string }[]
</script>

<nav>
  {#each links as link}
    <a href={link.href} class="center">{link.name}</a>
  {/each}
</nav>