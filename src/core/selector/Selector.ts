import * as THREE from 'three';

export default class Selector {
    private selected: THREE.Object3D | null = null;

    /**
     * Selects an object.
     * @param object
     * @returns True if new object is selected. False if object is already selected.
     */
    select(object: THREE.Object3D | null): boolean {
        if (this.selected === object) return false;
        this.selected = object;
        return true;
    }

    /**
     * Deselects the currently selected object.
     */
    deselect(): void {
        this.select(null);
    }
}
