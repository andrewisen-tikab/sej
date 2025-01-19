import * as THREE from 'three';

import GUI from 'lil-gui';
import { Sky } from 'three/addons/objects/Sky.js';

import type { Editor } from '../editor/types';
import type { Calendar } from './types';

/**
 * Abstract class that implements the {@link Calendar} type.
 */
export abstract class AbstractCalendar implements Calendar {
    private _date: Date = new Date();

    public ISOString: string = '';

    public localeString: string = '';

    public editor: Editor;

    public hour: number = 0;

    public minute: number = 0;

    public second: number = 0;

    public day: number = 0;

    public month: number = 0;

    public year: number = 0;

    public locales: Intl.LocalesArgument = 'en-US';

    public options: Intl.DateTimeFormatOptions = {
        timeZone: 'UTC',
    };

    private _sky: Sky = new Sky();

    public visualizeSun: boolean = false;

    private _sun = new THREE.Vector3();

    private _effectController = {
        turbidity: 0,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 2,
        azimuth: 180,
        exposure: 1,
    };

    constructor(editor: Editor, date: Date = new Date()) {
        this.editor = editor;
        this.visualizeSun = false;

        this._sky.scale.setScalar(450000);
        editor.scene.add(this._sky);

        this.setDate(date);
    }

    public setLocales(locales: Intl.LocalesArgument): void {
        this.locales = locales;
        this.setDate(this._date);
    }

    public setTimezone(timeZone: string): void {
        this.options.timeZone = timeZone;
        this.setDate(this._date);
    }

    public setDate(date: Date): void {
        this._date = date;
        this.ISOString = date.toISOString();
        this.localeString = date.toLocaleString(this.locales, this.options);

        this.hour = date.getHours();
        this.minute = date.getMinutes();
        this.second = date.getSeconds();
        this.day = date.getDate();
        this.month = date.getMonth();
        this.year = date.getFullYear();

        this._updateSun();
    }

    public getDate(): Readonly<Date> {
        return this._date;
    }

    private _updateSun() {
        this._sky.visible = this.visualizeSun;
        const {
            _sun: sun,
            _effectController: effectController,
            _sky: {
                material: { uniforms },
            },
        } = this;

        uniforms.turbidity.value = effectController.turbidity;
        uniforms.rayleigh.value = effectController.rayleigh;
        uniforms.mieCoefficient.value = effectController.mieCoefficient;
        uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
        const theta = THREE.MathUtils.degToRad(effectController.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        uniforms.sunPosition.value.copy(sun);
    }

    public addDebug(gui: GUI): void {
        const { _effectController: effectController } = this;
        gui.add(this, 'locales').onFinishChange((value: Intl.LocalesArgument) => {
            this.locales = value;
            this.setDate(this._date);
        });

        gui.add(this.options, 'timeZone').onFinishChange((value: string) => {
            this.options.timeZone = value;
            this.setDate(this._date);
        });

        gui.add(this, 'ISOString').disable().listen();
        gui.add(this, 'localeString').disable().listen();

        const timeFolder = gui.addFolder('Time');
        timeFolder
            .add(this, 'hour')
            .min(0)
            .max(23)
            .step(1)
            .listen()
            .onChange((value: number) => {
                this._date.setHours(value);
                this.setDate(this._date);
            });
        timeFolder
            .add(this, 'minute')
            .min(0)
            .max(59)
            .step(1)
            .listen()
            .onChange((value: number) => {
                this._date.setMinutes(value);
                this.setDate(this._date);
            });
        timeFolder
            .add(this, 'second')
            .min(0)
            .max(59)
            .step(1)
            .listen()
            .onChange((value: number) => {
                this._date.setSeconds(value);
                this.setDate(this._date);
            });
        timeFolder.close();

        const dateFolder = gui.addFolder('Date');
        dateFolder
            .add(this, 'day')
            .min(0)
            .max(30)
            .step(1)
            .listen()
            .onChange((value: number) => {
                this._date.setDate(value);
                this.setDate(this._date);
            });
        dateFolder
            .add(this, 'month')
            .min(0)
            .max(11)
            .step(1)
            .listen()
            .onChange((value: number) => {
                this._date.setMonth(value);
                this.setDate(this._date);
            });
        dateFolder
            .add(this, 'year')
            .min(0)
            .max(9999)
            .step(1)
            .listen()
            .onChange((value: number) => {
                this._date.setFullYear(value);
                this.setDate(this._date);
            });
        dateFolder.close();

        const sunFolder = gui.addFolder('Sun');

        sunFolder
            .add(this, 'visualizeSun')
            .name('Visualize Sun')
            .onChange(() => {
                this._updateSun();
            });

        const guiChanged = this._updateSun.bind(this);

        sunFolder.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
        sunFolder.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
        sunFolder.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
        sunFolder.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
        sunFolder.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged);
        sunFolder.add(effectController, 'azimuth', -180, 180, 0.1).onChange(guiChanged);
        sunFolder.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged);

        sunFolder.close();
    }
}
