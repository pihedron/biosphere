<script lang="ts">
  import { onMount } from 'svelte'
  import { db } from '$lib/firebase'
  import {
    collection,
    query,
    where,
    getDocs,
    GeoPoint,
  } from 'firebase/firestore'

  let reports: any[] = []
  let loading = true
  let error: string | null = null

  function calculateBounds(lat: number, lng: number) {
    const latDegreePerKm = 1 / 111
    const lngDegreePerKm = 1 / (111 * Math.cos((lat * Math.PI) / 180))
    const radius = 50

    return {
      sw: new GeoPoint(
        lat - radius * latDegreePerKm,
        lng - radius * lngDegreePerKm,
      ),
      ne: new GeoPoint(
        lat + radius * latDegreePerKm,
        lng + radius * lngDegreePerKm,
      ),
    }
  }

  async function getUserLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        (err) => reject(new Error('Location error: ' + err.message)),
      )
    })
  }

  async function fetchReports() {
    try {
      const { lat, lng } = await getUserLocation()
      const bounds = calculateBounds(lat, lng)

      const reportsRef = collection(db, 'reports')
      const q = query(
        reportsRef,
        where('location', '>=', bounds.sw),
        where('location', '<=', bounds.ne),
      )

      const reportsDocs = await getDocs(q)

      reports = reportsDocs.docs
        .filter((doc) => doc.id !== '(default)')
        .map((doc) => ({ ...doc.data(), id: doc.id }))
    } catch (err) {
      error = err instanceof Error ? err.message : 'Fetch error'
    } finally {
      loading = false
    }
  }

  onMount(fetchReports)
</script>

<div class="top full">
  {#if loading}
    <div class="loading">Loading reports...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if reports.length === 0}
    <div class="no-reports">No nearby reports found.</div>
  {:else}
    <section class="auto slab">
      <div class="container">
        <h1>Nearby Reports</h1>
        {#if reports.length === 0}
          <p>There are no nearby reports.</p>
        {/if}
        {#each reports as report}
          <div class="report-card">
            <h2>{report.title}</h2>
            <p>{report.content}</p>
            <iframe
              title="map"
              src="https://maps.google.com/maps?q={report.address}&hl=en&output=embed"
            ></iframe>
            {#if report.images && report.images.length > 0}
              <p>Hold shift to scroll images horizontally on a computer.</p>
              <div class="outer">
                <div class="report-images">
                  {#each report.images as image}
                    <img src={image} alt="Incident report" />
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>

<style>
  .container {
    width: 100%;
  }

  .report-card {
    background-color: color-mix(in oklab, var(--color), transparent 90%);
    border-radius: 8px;
    padding: 32px;
    margin-bottom: 16px;
  }

  .report-card :is(h1, h2, h3) {
    margin-block-start: 0;
  }

  .outer {
    border-radius: 8px;
    overflow: hidden;
  }

  .report-images {
    display: flex;
    gap: 8px;
    overflow-x: auto;
  }

  .report-images::-webkit-scrollbar {
    display: none;
  }

  .report-images img {
    height: 320px;
    object-fit: cover;
    border-radius: 8px;
  }

  .loading,
  .error,
  .no-reports {
    text-align: center;
    padding: 32px;
    color: color-mix(in oklab, var(--color), transparent 50%);
  }

  iframe {
    width: 100%;
    height: 256px;
    border: 0;
    border-radius: 8px;
  }
</style>
