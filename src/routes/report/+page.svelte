<script lang="ts">
  import { auth, db, store } from '$lib/firebase'
  import {
    collection,
    doc,
    GeoPoint,
    getDoc,
    setDoc,
    updateDoc,
  } from 'firebase/firestore'
  import { goto } from '$app/navigation'
  import Button from '$lib/components/Button.svelte'

  async function geocodeAddress(address: string): Promise<GeoPoint | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      )
      const data = await response.json()

      if (data.length > 0) {
        return new GeoPoint(parseFloat(data[0].lat), parseFloat(data[0].lon))
      }
      return null
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(window.location.pathname, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const key = await response.json()

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${key}`,
        {
          method: 'POST',
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error('Image upload failed')
      }

      const data = await response.json()
      return data.data.url
    } catch (error) {
      console.error('ImgBB upload error:', error)
      throw error
    }
  }

  let title = ''
  let content = ''
  let address = ''
  let images: File[] = []
  let errorMessage = ''
  let isSubmitting = false

  async function handleSubmit() {
    if (!auth.currentUser) {
      errorMessage = 'Please log in to submit reports'
      return
    }

    if (!title || !content || !address) {
      errorMessage = 'Please fill in all required fields'
      return
    }

    isSubmitting = true
    errorMessage = ''

    try {
      const location = await geocodeAddress(address)

      if (!location) {
        errorMessage = 'Could not convert address to coordinates'
        isSubmitting = false
        return
      }

      const imageUrls: string[] = []
      for (const file of images) {
        const url = await uploadImage(file)
        imageUrls.push(url)
      }

      const date = new Date()

      const incidentReport = {
        title,
        content,
        images: imageUrls,
        location,
        date,
        expiry: new Date(new Date(date).setMonth(date.getMonth() + 1)),
        uid: $store.user?.uid || 'anonymous',
      }

      const ref = collection(db, 'reports')
      const meta = doc(ref, '(default)')
      const snap = await getDoc(meta)
      let count: number = snap.data()?.count

      setDoc(doc(ref, count.toString()), incidentReport)

      count += 1
      updateDoc(meta, { count })

      goto('/nearby')
    } catch (error) {
      console.error('Error submitting incident:', error)
      errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to submit incident report'
      isSubmitting = false
    }
  }

  function handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files) {
      images = Array.from(input.files)
    }
  }
</script>

<section class="auto top full">
  <h1>Report Incident</h1>

  {#if errorMessage}
    <div class="error-message">
      {errorMessage}
    </div>
  {/if}

  <form on:submit|preventDefault={handleSubmit}>
    <div class="group">
      <input
        id="title"
        type="text"
        name="title"
        required
        bind:value={title}
        class:filled={title.length > 0}
        disabled={isSubmitting}
      />
      <label for="title">Incident Title</label>
    </div>

    <div class="group">
      <input
        id="address"
        type="text"
        name="address"
        required
        bind:value={address}
        class:filled={address.length > 0}
        disabled={isSubmitting}
      />
      <label for="address">Incident Location Address</label>
    </div>

    <div class="group">
      <textarea
        id="content"
        name="content"
        required
        bind:value={content}
        class:filled={content.length > 0}
        disabled={isSubmitting}
      ></textarea>
      <label for="content">Incident Description</label>
    </div>

    <div class="group file-input">
      <input
        type="file"
        id="images"
        name="images"
        multiple
        accept="image/*"
        on:change={handleImageUpload}
        disabled={isSubmitting}
      />
      <span class="uploader"
        >{images.length > 0
          ? `${images.length} file(s) selected`
          : 'Upload Images (optional)'}</span
      >
    </div>

    <div class="group">
      <Button type="submit" click={() => {}} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Incident Report'}
      </Button>
    </div>
  </form>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 32px;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .group {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 16px;
  }

  input,
  textarea {
    padding: 24px 16px 12px;
    color: var(--color);
    background-color: color-mix(in oklab, var(--color), transparent 90%);
    border: 0;
    border-radius: 4px;
    transition: all 250ms;
  }

  input[type='file'] {
    padding: 0;
    background-color: transparent;
  }

  label {
    position: absolute;
    top: 18px;
    left: 16px;
    transition: all 250ms;
    color: color-mix(in oklab, var(--color), transparent 50%);
  }

  input:focus + label,
  input.filled + label,
  textarea:focus + label,
  textarea.filled + label {
    top: 6px;
    left: 16px;
    font-size: 12px;
    color: var(--accent);
  }

  .error-message {
    box-sizing: border-box;
    width: 100%;
    padding: 16px;
    background-color: color-mix(in oklab, red, transparent 80%);
    color: red;
    border-radius: 4px;
    margin-bottom: 16px;
  }

  .file-input {
    position: relative;
    overflow: hidden;
  }

  .file-input input[type='file'] {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .uploader {
    box-sizing: border-box;
    padding: 16px;
    background-color: color-mix(in oklab, var(--color), transparent 90%);
    border-radius: 4px;
    cursor: pointer;
  }

  input:disabled,
  textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  textarea {
    min-height: 150px;
    resize: vertical;
  }
</style>
