<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'

  interface TransportTrip {
    type: 'car' | 'flight' | 'bus' | 'train'
    distance: number
    fuelType?: 'gasoline' | 'diesel' | 'electric'
    passengers?: number
  }

  interface ElectronicDevice {
    type: string
    hoursPerDay: number
    watts: number
  }

  interface DietData {
    type: 'meat' | 'vegetarian' | 'vegan'
    mealsPerDay: number
  }

  interface WasteData {
    kgPerWeek: number
  }

  class CarbonFootprintCalculator {
    private emissionFactors = {
      car: {
        gasoline: 0.192 / 30,
        diesel: 0.171 / 30,
        electric: 0.053 / 30,
        default: 0.192 / 30,
      },
      flight: {
        shortHaul: 0.255 / 30,
        mediumHaul: 0.15 / 30,
        longHaul: 0.102 / 30,
      },
      publicTransport: {
        bus: 0.105 / 30,
        train: 0.041 / 30,
      },
      electronics: { average: 0.1 / 30 },
      diet: {
        meat: 6.61,
        vegetarian: 2.89,
        vegan: 2.09,
      },
      waste: { averagePerKg: 0.5 / 7 },
    }

    calculateElectronicsEmissions(devices: ElectronicDevice[]): number {
      return devices.reduce((total, device) => {
        const kWh = (device.hoursPerDay * device.watts) / 1000
        return total + kWh * this.emissionFactors.electronics.average
      }, 0)
    }

    calculateTransportEmissions(trips: TransportTrip[]): number {
      return trips.reduce((total, trip) => {
        switch (trip.type) {
          case 'car':
            const factor = this.emissionFactors.car[trip.fuelType || 'gasoline']
            return total + (factor * trip.distance) / (trip.passengers || 1)
          case 'flight':
            const flightFactor =
              trip.distance <= 500
                ? this.emissionFactors.flight.shortHaul
                : trip.distance <= 1500
                  ? this.emissionFactors.flight.mediumHaul
                  : this.emissionFactors.flight.longHaul
            return total + flightFactor * trip.distance
          case 'bus':
            return (
              total + this.emissionFactors.publicTransport.bus * trip.distance
            )
          case 'train':
            return (
              total + this.emissionFactors.publicTransport.train * trip.distance
            )
          default:
            return total
        }
      }, 0)
    }

    calculateDietEmissions(diet: DietData): number {
      const factor = this.emissionFactors.diet[diet.type]
      return factor * diet.mealsPerDay
    }

    calculateWasteEmissions(waste: WasteData): number {
      return waste.kgPerWeek * this.emissionFactors.waste.averagePerKg
    }

    calculateTotalCarbonFootprint(
      transport: TransportTrip[],
      electronics: ElectronicDevice[],
      diet: DietData,
      waste: WasteData,
    ): number {
      return (
        this.calculateTransportEmissions(transport) +
        this.calculateElectronicsEmissions(electronics) +
        this.calculateDietEmissions(diet) +
        this.calculateWasteEmissions(waste)
      )
    }
  }

  let ready = false
  let carbonFootprint = 0

  let transportTrips: TransportTrip[] = []
  let electronicDevices: ElectronicDevice[] = []
  let dietType: DietData['type'] = 'meat'
  let mealsPerDay = 3
  let wasteKgPerWeek = 10

  function addTransportTrip() {
    transportTrips = [
      ...transportTrips,
      {
        type: 'car',
        distance: 0,
        fuelType: 'gasoline',
        passengers: 1,
      },
    ]
  }

  function addElectronicDevice() {
    electronicDevices = [
      ...electronicDevices,
      {
        type: '',
        hoursPerDay: 0,
        watts: 0,
      },
    ]
  }

  function calculateFootprint() {
    const calculator = new CarbonFootprintCalculator()
    carbonFootprint = calculator.calculateTotalCarbonFootprint(
      transportTrips,
      electronicDevices,
      { type: dietType, mealsPerDay },
      { kgPerWeek: wasteKgPerWeek },
    )
    window.open('#result', '_self')
  }

  onMount(() => (ready = true))
</script>

<section id="banner" class="auto">
  {#if ready}
    <span id="pill" transition:fly={{ y: -32, duration: 1000 }}>Footprint</span>
    <h1 transition:fly={{ y: -32, duration: 1000, delay: 500 }}>
      What is your carbon footprint?
    </h1>
    <p id="caption" transition:fly={{ y: -32, duration: 1000, delay: 1000 }}>
      Approximate your emissions using our carbon footprint calculator.
    </p>
    <Button click={(e) => window.open('#calculator', '_self')}
      >Let's do it!</Button
    >
  {/if}
</section>
<section id="calculator" class="auto">
  <h2>Carbon Footprint Calculator</h2>
  <div class="transport-section">
    <h3>Transportation</h3>
    <p>
      For all modes of transport, enter the distance (km) travelled per month.
      For car trips, please select fuel type and enter number of passengers as
      well.
    </p>
    {#each transportTrips as trip, i}
      <div class="trip-input">
        <select bind:value={trip.type}>
          <option value="car">Car</option>
          <option value="flight">Flight</option>
          <option value="bus">Bus</option>
          <option value="train">Train</option>
        </select>
        <input
          type="number"
          bind:value={trip.distance}
          placeholder="Distance (km)"
        />
        {#if trip.type === 'car'}
          <select bind:value={trip.fuelType}>
            <option value="gasoline">Gasoline</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
          </select>
          <input
            type="number"
            bind:value={trip.passengers}
            placeholder="Passengers"
          />
        {/if}
      </div>
    {/each}
    <Button click={addTransportTrip}>Add Trip</Button>
  </div>
  <div class="electronics-section">
    <h3>Electronic Devices</h3>
    <p>
      Enter the type of device you use, the number of hours you use it per day,
      and the power rating in Watts.
    </p>
    {#each electronicDevices as device, i}
      <div class="device-input">
        <input type="text" bind:value={device.type} placeholder="Device Type" />
        <input
          type="number"
          bind:value={device.hoursPerDay}
          placeholder="Hours per Day"
        />
        <input type="number" bind:value={device.watts} placeholder="Watts" />
      </div>
    {/each}
    <Button click={addElectronicDevice}>Add Device</Button>
  </div>
  <div class="diet-section">
    <h3>Diet</h3>
    <p>
      Select your diet from the dropdown and enter the number of meals you have
      per day.
    </p>
    <select bind:value={dietType}>
      <option value="meat">Meat</option>
      <option value="vegetarian">Vegetarian</option>
      <option value="vegan">Vegan</option>
    </select>
    <input type="number" bind:value={mealsPerDay} placeholder="Meals per Day" />
  </div>
  <div class="waste-section">
    <h3>Waste</h3>
    <p>Enter the amount of waste or garabge you produce in kg per week.</p>
    <input
      type="number"
      bind:value={wasteKgPerWeek}
      placeholder="Kg of Waste per Week"
    />
  </div>
  <div class="btn-wrapper">
    <Button click={calculateFootprint}>Crunch the numbers!</Button>
  </div>
</section>

<section id="result" class="auto">
  <h2>Your Carbon Footprint</h2>
  {#if carbonFootprint > 0}
    <p>
      You release around {carbonFootprint.toFixed(2)} kg of CO<sub>2</sub>
      in a day and {(carbonFootprint * 365).toFixed(0)} kg in a year.
    </p>
  {:else}
    <p>
      Please submit the form by clicking the button to see your carbon footprint
      here.
    </p>
  {/if}
</section>

<div class="auto divider">
  <h2>Reducing Your Carbon Footprint</h2>
</div>
<section class="auto slab">
  <div class="half">
    <h3>Travel Wisely</h3>
    <p>
      Instead of driving, consider walking or riding a bike to reduce greenhouse
      gas emissions and boost your fitness. For longer distances, take a train
      or bus. Living car-free can reduce your carbon footprint by up to 2 tons
      of CO<sub>2</sub> equivalents per year.
    </p>
  </div>
</section>
<section class="auto slab">
  <div class="half">
    <h3>Keep Earth Clean</h3>
    <p>
      Garbage can severely pollute the air and contaminate water if not
      discarded properly. Dispose your waste responsibly using our
      <a href="/tips/recycling">waste sorter</a>
      and participate in <a href="/nearby">local clean-ups</a> of public spaces.
    </p>
  </div>
</section>
<section class="auto slab">
  <div class="half">
    <h3>Reduce & Reuse</h3>
    <p>
      Always try to reduce, reuse, repair, and recycle as many products cause
      carbon emissions at each step during its production. Protect the planet by
      buying fewer things like clothes and shopping second-hand.
    </p>
  </div>
</section>
<section class="auto slab">
  <div class="half">
    <h3>Save Energy</h3>
    <p>
      A significant portion of our energy is powered by fossil fuels. Reduce
      your energy consumption by decreasing your heating and cooling use,
      switching to LED light bulbs, and hanging things to dry instead of using a
      dryer. Improving your home's energy efficiency, through better insulation
      or replacing your oil or gas furnace with an electric heat pump can reduce
      your carbon footprint by up to 900 kg of CO<sub>2</sub> equivalents per year.
    </p>
  </div>
</section>

<style>
  section {
    margin: 0 auto;
    padding: 32px;
  }

  .divider {
    padding: 0 32px;
    text-align: center;
  }

  .divider h2 {
    box-sizing: border-box;
    margin: 0;
    width: 100%;
  }

  .trip-input,
  .device-input {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  input,
  select {
    flex: 1;
    padding: 0.5rem;
    appearance: none;
    background-color: var(--bg);
    color: var(--color);
    border-radius: 4px;
    border: 2px solid var(--color);
  }

  select {
    cursor: pointer;
    transition: all 250ms;
  }

  select:hover {
    background-color: var(--color);
    color: var(--bg);
  }

  .btn-wrapper {
    margin-top: 32px;
  }
</style>
