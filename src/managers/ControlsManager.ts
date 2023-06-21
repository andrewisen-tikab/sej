import { SejCore } from '..';
import Manager from './manager';

/**
 * Controls manager.
 */
export default class ControlsManager extends Manager {
    private config = {
        enableTransition: true,
    };

    fit(_object?: THREE.Object3D) {
        const { cameraControls } = SejCore.getControls();
        if (cameraControls == null) return;
        let object = _object ?? this.getDefaultScene();
        console.log('FITTING!');

        cameraControls.fitToSphere(object, this.config.enableTransition);
    }
}
