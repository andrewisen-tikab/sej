import { SejCore } from '..';

export default class Manager {
    public init() {}

    getDefaultScene() {
        return SejCore.getScenes().scene;
    }
}
