gen_title_screen();
gen_lyrics();


let scene = document.getElementById('mainscene');

scene.addEventListener('enter-vr', function () {
  let player = document.querySelector('#player');
  player.object3D.position.y = 1.6;

  let e = document.createElement('a-entity');
  e.classList.add('escape-vr');
  e.setAttribute('geometry','primitive: plane; width: 0.5; height: 0.5;');
  e.setAttribute('material', 'color: red');
  e.setAttribute('text', `value: Exit VR Mode; width=: 6; height: 3; align: center; font: monoid;`);
  e.setAttribute('rotation', '90 0 0');
  e.setAttribute('position', '0 1.5 0');
  e.setAttribute('exit-vr', true);

  player.appendChild(e);
});

scene.addEventListener('exit-vr', function () {
  document.querySelectorAll('.escape-vr').forEach(x => x.remove());
});
