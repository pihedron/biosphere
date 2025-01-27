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
  <h1>Had enough?</h1>
  <p>You can only post reports if you are logged into your account.</p>
  <Button {click}>Exit</Button>
</div>
