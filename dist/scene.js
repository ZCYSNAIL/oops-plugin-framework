"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.unload = exports.load = void 0;
function load() { }
exports.load = load;
function unload() { }
exports.unload = unload;
// 在其他扩展脚本中，我们可以使用如下代码调用 rotateCamera 函数
// const options: ExecuteSceneScriptMethodOptions = {
//     name: scene.ts 所在的扩展包名, 如: App,
//     method: scene.ts 中定义的方法, 如: createPrefab,
//     args: 参数，可选, 只传递json
// };
// const result = await Editor.Message.request('scene', 'execute-scene-script', options);
exports.methods = {
    /** 创建视图层制 */
    async createPrefab(fileName, className, prefabUrl) {
        const { Node, js, Layers } = require('cc');
        const node = new Node(fileName);
        node.layer = Layers.Enum.UI_2D;
        while (true) {
            const result = js.getClassByName(className);
            if (result)
                break;
            await new Promise((next) => {
                setTimeout(next, 100);
            });
        }
        const com = node.addComponent(className);
        com.resetInEditor && com.resetInEditor();
        const info = cce.Prefab.generatePrefabDataFromNode(node);
        node.destroy();
        return Editor.Message.request('asset-db', 'create-asset', prefabUrl, info.prefabData || info);
    }
};