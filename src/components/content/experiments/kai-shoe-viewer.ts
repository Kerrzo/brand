document.querySelectorAll<HTMLElement>('.shoe-viewer').forEach(root => {
 const stage=root.querySelector<HTMLElement>('.shoe-stage')!;
 const load=root.querySelector<HTMLButtonElement>('[data-load]')!;
 const wire=root.querySelector<HTMLButtonElement>('[data-wire]')!;
 const reset=root.querySelector<HTMLButtonElement>('[data-reset]')!;
 const status=root.querySelector<HTMLElement>('[role=status]')!;
 load.addEventListener('click',async()=>{
  load.disabled=true; status.textContent='Loading shoe geometry…';
  try {
   const [T,{GLTFLoader},{OrbitControls}]=await Promise.all([import('three'),import('three/addons/loaders/GLTFLoader.js'),import('three/addons/controls/OrbitControls.js')]);
   const model=await new GLTFLoader().loadAsync('/media/experiments/kai/shoe.glb');
   const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x171918,1);stage.appendChild(renderer.domElement);
   const scene=new T.Scene(); const camera=new T.PerspectiveCamera(35,1,.01,100);
   const material=new T.MeshStandardMaterial({color:0xc4c8c5,roughness:.7,metalness:.08,side:T.DoubleSide});
   model.scene.traverse((obj:any)=>{if(obj.isMesh)obj.material=material;});
   const box=new T.Box3().setFromObject(model.scene);const size=box.getSize(new T.Vector3());const center=box.getCenter(new T.Vector3());
   const scale=2/Math.max(size.x,size.y,size.z);model.scene.scale.multiplyScalar(scale);model.scene.position.sub(center.multiplyScalar(scale));scene.add(model.scene);
   scene.add(new T.HemisphereLight(0xffffff,0x494b53,2));
   const key=new T.DirectionalLight(0xffffff,3);key.position.set(3,5,4);scene.add(key);const rim=new T.DirectionalLight(0xb8c9ff,2);rim.position.set(-4,2,-3);scene.add(rim);
   camera.position.set(3,1.8,3.5);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;controls.enablePan=false;controls.minDistance=2;controls.maxDistance=9;controls.target.set(0,0,0);controls.update();controls.saveState();
   let visible=true;const render=()=>{if(visible&&!document.hidden)renderer.render(scene,camera);};
   controls.addEventListener('change',render);
   new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();render();}).observe(stage);
   new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;controls.enabled=visible&&!document.hidden;render();}).observe(stage);
   document.addEventListener('visibilitychange',()=>{controls.enabled=visible&&!document.hidden;render();});
   wire.addEventListener('click',()=>{material.wireframe=!material.wireframe;wire.setAttribute('aria-pressed',String(material.wireframe));render();});
   reset.addEventListener('click',()=>{controls.reset();render();});
   load.hidden=true;wire.hidden=false;reset.hidden=false;status.textContent='Geometry loaded · drag to rotate';render();
  }catch(error){status.textContent='The 3D preview could not load. Please try again.';load.disabled=false;console.error(error);}
 });
});