<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import { onMount } from 'svelte'
  import { fly, slide } from 'svelte/transition'
  import { auth, createUserWithEmailAndPassword, db, signInWithEmailAndPassword, updateProfile } from '$lib/firebase'
    import { goto } from '$app/navigation'

  const submit = async (e: SubmitEvent) => {
    e.preventDefault()
    if (checked) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const { user } = userCredential
          goto('/')
        })
        .catch((e) => {
          const { code, message } = e
          console.log(message)
        })
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          let { user } = userCredential
          updateProfile(user, { displayName })
          goto('/')
        })
        .catch((e) => {
          const { code, message } = e
          console.log(message)
        })
    }
  }

  let displayName = ''
  let email = ''
  let password = ''
  let checked = false

  let ready = false
  onMount(() => (ready = true))
</script>

<section id="banner">
  {#if ready}
    <h1 transition:fly={{ y: -32, duration: 1000 }}>Join</h1>
    <form on:submit={submit} transition:fly={{ y: 32, duration: 1000 }}>
      {#if !checked}
        <div class="group" transition:slide>
          <input
            id="name"
            type="text"
            name="name"
            required
            bind:value={displayName}
            class:filled={displayName.length > 0}
          />
          <label for="name">Name</label>
        </div>
      {/if}
      <div class="group">
        <input
          id="email"
          type="text"
          name="email"
          required
          bind:value={email}
          class:filled={email.length > 0}
        />
        <label for="email">Email</label>
      </div>
      <div class="group">
        <input
          id="password"
          type="password"
          name="password"
          required
          bind:value={password}
          class:filled={password.length > 0}
        />
        <label for="password">Password</label>
      </div>
      <div class="group">
        <input type="checkbox" name="cb" id="cb" bind:checked />
        <label for="cb" id="checkbox">
          <svg viewBox="0 0 100 100">
            <path
              class="box"
              d="M82,89H18c-3.87,0-7-3.13-7-7V18c0-3.87,3.13-7,7-7h64c3.87,0,7,3.13,7,7v64C89,85.87,85.87,89,82,89z"
            />
            <polyline class="check" points="25.5,53.5 39.5,67.5 72.5,34.5 " />
          </svg>
          <span>I already have an account!</span>
        </label>
      </div>
      <div class="group">
        <Button type="submit" click={(e) => null}
          >{checked ? 'Login' : 'Register'}</Button
        >
      </div>
    </form>
  {/if}
</section>

<style>
  form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .group {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 16px;
  }

  input[type='text'] + label,
  input[type='password'] + label {
    position: absolute;
    top: 18px;
    left: 16px;
    transition: all 250ms;
  }

  input {
    padding: 24px 16px 12px;
    color: var(--color);
    background-color: color-mix(in oklab, var(--color), transparent 90%);
    border: 0;
    border-radius: 4px;
  }

  input:not(#cb):focus + label,
  input.filled + label {
    top: 6px;
    left: 16px;
    font-size: 12px;
  }

  input:focus + label {
    color: var(--accent);
  }

  input[type='checkbox'] {
    opacity: 0;
    height: 0;
    margin: 0;
    pointer-events: none;
  }

  input[type='checkbox'] + label {
    position: relative;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  input[type='checkbox'] + label svg {
    width: 28px;
    stroke: var(--accent);
    stroke-width: 8;
    fill: white;
  }

  input[type='checkbox'] + label svg .box {
    stroke-dasharray: 320;
    stroke-dashoffset: 0;
    fill: var(--bg);
    transition: stroke-dashoffset 250ms linear;
  }

  input[type='checkbox'] + label svg .check {
    stroke-dasharray: 70;
    stroke-dashoffset: 70;
    fill: none;
    transition: stroke-dashoffset 250ms linear;
  }

  input[type='checkbox'] + label span {
    margin-left: 8px;
  }

  input[type='checkbox']:checked + label .box {
    stroke-dashoffset: 320;
  }

  input[type='checkbox']:checked + label .check {
    stroke-dashoffset: 0;
  }
</style>
