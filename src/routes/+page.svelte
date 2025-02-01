<script lang="ts">
  import { onMount } from 'svelte'
  import { fly, draw } from 'svelte/transition'
  import Button from '$lib/components/Button.svelte'
  import { quintOut } from 'svelte/easing'

  import * as THREE from 'three'
  import { createRenderer } from '$lib/three'
  import { auth } from '$lib/firebase'

  let ready = false
  onMount(() => {
    ready = true

    let PLANET_SIZE = 16
    const main = document.querySelector('main')
    let tick = 0
    let width = window.innerWidth
    let height = window.innerHeight - 64
    const scene = new THREE.Scene()

    const renderer = createRenderer(width, height)
    document.querySelector('#canvas')?.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 100, 400)
    scene.add(camera)

    const sphere = new THREE.Object3D()
    const skeleton = new THREE.Object3D()
    const particles = new THREE.Object3D()

    scene
      .add(sphere)
      // .add(skeleton)
      .add(particles)

    const tetra = new THREE.TetrahedronGeometry(2, 0)
    const icosas = [
      new THREE.IcosahedronGeometry(7, 1),
      new THREE.IcosahedronGeometry(15, 1),
    ]

    const flat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
    })

    const wired = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      wireframe: true,
      side: THREE.DoubleSide,
    })

    const planet = new THREE.Mesh(icosas[0], flat)
    planet.scale.x = planet.scale.y = planet.scale.z = PLANET_SIZE
    sphere.add(planet)

    const frame = new THREE.Mesh(icosas[1], wired)
    frame.scale.x = frame.scale.y = frame.scale.z = 12
    skeleton.add(frame)

    const ambientLight = new THREE.AmbientLight(0x999999)
    scene.add(ambientLight)

    const lights: THREE.DirectionalLight[] = []
    lights[0] = new THREE.DirectionalLight(0xffffff, 2)
    lights[0].position.set(1, 0, 0)
    lights[1] = new THREE.DirectionalLight(0x00ff00, 4)
    lights[1].position.set(0.75, 1, 0.5)
    lights[2] = new THREE.DirectionalLight(0x1a5fff, 4)
    lights[2].position.set(-0.75, -1, 0.5)

    for (const light of lights) {
      scene.add(light)
    }

    function animate() {
      requestAnimationFrame(animate)
      width = window.innerWidth
      height = window.innerHeight - 64
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()

      particles.rotation.x += 0.0
      particles.rotation.y -= 0.004
      sphere.rotation.x -= 0.002
      sphere.rotation.y -= 0.003
      skeleton.rotation.x -= 0.001
      skeleton.rotation.y += 0.002

      planet.scale.x = planet.scale.y = planet.scale.z = PLANET_SIZE

      renderer.render(scene, camera)
      tick++
    }

    animate()

    main?.addEventListener('scroll', (e) => {
      const height: number =
        document.querySelector('.story')?.clientHeight ?? window.innerHeight
      const fraction = main.scrollTop / height
      planet.scale.x =
        planet.scale.y =
        planet.scale.z =
          PLANET_SIZE * (1 - fraction)
    })
  })
</script>

<section id="hero" class="auto">
  {#if ready}
    <h1 transition:fly={{ y: -32, duration: 1000 }}>Earth needs you!</h1>
    <p class="subtitle" transition:fly={{ y: 32, duration: 1000, delay: 250 }}>
      Our planet is slowly dying. It's up to you to save our environment.
    </p>
    <div transition:fly={{ y: 32, duration: 1000, delay: 500 }}>
      <Button click={(e) => window.open('/#about', '_self')}
        >What can I do?</Button
      >
    </div>
  {/if}
  <div id="canvas"></div>
</section>
<section class="auto slab textual" id="about">
  <div class="half">
    <h2>About</h2>
    <p>
      Our mission is to bring awareness of current environmental issues to the
      public and help every individual make a difference in this world.
    </p>
  </div>
</section>
<section class="auto slab" id="whatcanido">
  <div class="half">
    <h2>Your Contribution</h2>
    <p>
      You can make this planet a better place by following some of our
      sustainable <a href="/tips">tips</a> for reducing environmental damage.
    </p>
    <Button click={(e) => window.open('/tips', '_self')}>Let me help!</Button>
  </div>
</section>
<section class="auto slab start">
  <div class="half">
    <h2>Community Reports</h2>
    <p>
      Has someone dumped rubbish in your neighbourhood?
      <a href="/join">Register</a>
      an account and <a href="/report">report</a> the incident to your local community.
      Let the whole city know what's happening.
    </p>
    {#if auth.currentUser}
      <Button click={(e) => window.open('/report', '_self')}>
        I have a report!
      </Button>
    {:else}
      <Button click={(e) => window.open('/join', '_self')}>Sign me up!</Button>
    {/if}
  </div>
  <div class="half">
    <h2>Volunteers</h2>
    <p>
      Find the perfect opportunity to help out locals by checking out
      <a href="/nearby">nearby</a> reports.
    </p>
    <Button click={(e) => window.open('/join', '_self')}>What's nearby?</Button>
  </div>
</section>

<style>
  #hero {
    margin-top: var(--nav);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;
    box-sizing: border-box;
    padding: 0 32px 50vh;
    width: 100%;
    height: calc(100vh - var(--nav));
    text-align: center;
    overflow: hidden;
  }

  #hero h1 {
    margin: 0;
    color: transparent;
    background: linear-gradient(to right, var(--color), var(--accent));
    -webkit-background-clip: text;
    background-clip: text;
  }

  #hero .subtitle {
    margin: 16px 0;
    font-size: 20px;
  }

  #canvas {
    position: absolute;
    bottom: 0;
    z-index: -1;
  }

  @keyframes float {
    0% {
      transform: rotate(-15deg) translateY(0);
    }
    100% {
      transform: rotate(-17deg) translateY(-0.5vw);
    }
  }

  @media screen and (max-width: 640px) {
    #hero h1 {
      font-size: var(--heading);
    }

    #hero .subtitle {
      font-size: var(--normal);
    }
  }
</style>
