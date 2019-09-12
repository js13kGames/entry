// https://github.com/matthewbryancurtis/aframe-star-system-component
AFRAME.registerComponent("stars", {
  update: function() {
    const stars = new THREE.Geometry();

    while (stars.vertices.length < 10000) {
      stars.vertices.push(this.randomVectorBetweenSpheres(200, 500));
    }

    const material = new THREE.PointsMaterial();

    this.el.setObject3D("stars", new THREE.Points(stars, material));
  },

  // Returns a random vector between the inner sphere
  // and the outer sphere created with radius + depth
  randomVectorBetweenSpheres: function(radius, depth) {
    const randomRadius = Math.floor(Math.random() * (radius + depth - radius + 1) + radius);
    return this.randomSphereSurfaceVector(randomRadius);
  },

  // Returns a vector on the face of sphere with given radius
  randomSphereSurfaceVector: function(radius) {
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }
});
