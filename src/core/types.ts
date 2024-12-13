import * as z from 'zod';

import type { KeyboardControls, ViewportControls } from '../controls/types';
import type { Editor } from '../editor/types';
import type { Renderer } from '../renderer/types';
import type { Viewport } from '../viewport/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Schema for validating test methods.
 *
 * @example
 * const isValid = TestSchema.parse({
 *   test: () => true
 * });
 *
 * @throws {ZodError} If the provided test method is not a function or does not return a boolean.
 */
export const TestSchema = z.object({
    /**
     * E2E test method.
     *
     * This method should return `true` if the test passes, and `false` if it fails.
     * Check the method itself for more information.
     * @param args Any
     */
    test: z.custom<(...args: any[]) => boolean>(
        (value) => {
            if (typeof value !== 'function') return false;

            try {
                const returnValue = value();
                return typeof returnValue === 'boolean';
            } catch {
                return false; // If the function throws, it's invalid
            }
        },
        {
            message: 'test must be a function that returns a boolean.',
        },
    ),
});

/**
 * Represents the inferred type from the `TestSchema` using Zod.
 *
 * This type is automatically generated based on the structure of `TestSchema`.
 * It ensures that the type definition stays in sync with the schema.
 */
export type Test = z.infer<typeof TestSchema>;

/**
 * Schema for a serializable object that includes methods for converting
 * to and from JSON.
 */
export const SerializableObjectSchema = z.object({
    /**
     * Creates a new instance of this class based on the given JSON.
     * @param args Any
     */
    fromJSON: z.custom<(this: void, ...args: any[]) => any>(
        (value) => typeof value === 'function',
        {
            message: 'fromJSON must be a function.',
        },
    ),
    /**
     * Returns a JSON representation of this class.
     */
    toJSON: z.custom<(this: void) => any>((value) => typeof value === 'function', {
        message: 'toJSON must be a function.',
    }),
});

/**
 * Represents an object that can be serialized.
 *
 * This type is inferred from the `SerializableObjectSchema` using Zod's `infer` method.
 * It ensures that the object adheres to the structure defined by the schema.
 */
export type SerializableObject = z.infer<typeof SerializableObjectSchema>;

/**
 * Base type for all parts of the library.
 * Useful if you want to create your own `SejEngine`.
 */
export type Sej = {
    /**
     * The canvas where the renderer draws its output.
     */
    container: HTMLElement;
    /**
     * The `Editor` is the meat of the application.
     * It holds the scene, the camera, the signals, the loader manager, the selector, the debugger and the config.
     */
    editor: Editor;
    /**
     * The `viewport` is class that handles the rendering of the scene.
     * It's a high-level abstraction of the {@link Renderer}.
     */
    viewport: Viewport;
    /**
     * The `renderer` is class that handles the rendering of the scene.
     * This is a low-level class that features the actual rendering logic.
     */
    renderer: Renderer;
    /**
     * The `ViewportControls` controls an object in the viewport.
     * It's usually the camera.
     */
    viewportControls: ViewportControls;
    /**
     * The `KeyboardControls` captures keyboard inputs.
     * Any type of logic can be implemented on top of this.
     */
    keyboardControls: KeyboardControls;
};

export type SupportedCameras = 'perspective' | 'orthographic';
