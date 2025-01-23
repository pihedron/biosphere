interface TransportTrip {
  type: 'car' | 'flight' | 'bus' | 'train'
  distance: number
  fuelType?: string
  passengers?: number
}

interface ElectricityData {
  kWh: number
  region?: string
}

interface DietData {
  type: 'meat' | 'vegetarian' | 'vegan'
  mealsPerDay: number
}

interface WasteData {
  kgPerWeek: number
}

interface CarbonFootprintData {
  transportation?: TransportTrip[]
  electricity?: ElectricityData
  diet?: DietData
  waste?: WasteData
}

class CarbonFootprintCalculator {
  private emissionFactors: {
    car: Record<string, number>
    flight: Record<string, number>
    publicTransport: Record<string, number>
    electricity: Record<string, number>
    diet: Record<string, number>
    waste: Record<string, number>
  }

  constructor() {
    this.emissionFactors = {
      car: {
        gasoline: 0.192,
        diesel: 0.171,
        electric: 0.053
      },
      flight: {
        shortHaul: 0.255,
        mediumHaul: 0.150,
        longHaul: 0.102
      },
      publicTransport: {
        bus: 0.105,
        train: 0.041
      },
      electricity: {
        average: 0.5
      },
      diet: {
        meat: 6.61,
        vegetarian: 2.89,
        vegan: 2.09
      },
      waste: {
        averagePerKg: 0.5
      }
    }
  }

  calculateTransportEmissions(type: string, distance: number, fuelType: string = 'average', passengers: number = 1): number {
    let factor: number

    switch (type) {
      case 'car':
        factor = this.emissionFactors.car[fuelType] || this.emissionFactors.car.gasoline
        return (factor * distance) / passengers

      case 'flight':
        if (distance <= 500) factor = this.emissionFactors.flight.shortHaul
        else if (distance <= 1500) factor = this.emissionFactors.flight.mediumHaul
        else factor = this.emissionFactors.flight.longHaul

        return factor * distance

      case 'bus':
        return this.emissionFactors.publicTransport.bus * distance

      case 'train':
        return this.emissionFactors.publicTransport.train * distance

      default:
        throw new Error('Unsupported transportation type')
    }
  }

  calculateElectricityEmissions(kWh: number, region: string = 'average'): number {
    return kWh * this.emissionFactors.electricity.average
  }

  calculateDietEmissions(dietType: string, mealsPerDay: number): number {
    const factor = this.emissionFactors.diet[dietType] || this.emissionFactors.diet.meat
    return factor * mealsPerDay
  }

  calculateWasteEmissions(wasteKg: number): number {
    return wasteKg * this.emissionFactors.waste.averagePerKg
  }

  calculateTotalCarbonFootprint(data: CarbonFootprintData): number {
    let totalEmissions = 0

    if (data.transportation) {
      data.transportation.forEach(trip => {
        totalEmissions += this.calculateTransportEmissions(
          trip.type,
          trip.distance,
          trip.fuelType,
          trip.passengers
        )
      })
    }

    if (data.electricity) {
      totalEmissions += this.calculateElectricityEmissions(
        data.electricity.kWh,
        data.electricity.region
      )
    }

    if (data.diet) {
      totalEmissions += this.calculateDietEmissions(
        data.diet.type,
        data.diet.mealsPerDay
      )
    }

    if (data.waste) {
      totalEmissions += this.calculateWasteEmissions(data.waste.kgPerWeek)
    }

    return totalEmissions
  }
}