import { json } from "@sveltejs/kit"
import { IMGBB } from '$env/static/private'

export async function GET() {
  return json(IMGBB)
}