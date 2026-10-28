import bpy
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=r'C:\Users\Desktop\Documents\Products\Kai\Model\shoe_lp.fbx')
for obj in bpy.context.scene.objects:
 if obj.type == 'MESH':
  print('MESH',obj.name,len(obj.data.vertices),len(obj.data.polygons))
  obj.data.materials.clear()
bpy.ops.export_scene.gltf(filepath=r'C:\Users\Desktop\Documents\Products\brand\public\media\experiments\kai\shoe.glb',export_format='GLB',export_animations=False)
