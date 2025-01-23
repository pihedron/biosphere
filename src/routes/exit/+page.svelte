<script>
  import { goto } from '$app/navigation'
  import Button from '$lib/components/Button.svelte'
  import { auth } from '$lib/firebase'

  async function click() {
    await auth.signOut()
    goto('/')
  }
</script>

<div id="banner">
  <Button {click}>Exit</Button>
</div>
