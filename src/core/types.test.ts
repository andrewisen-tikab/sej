import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { SerializableObjectSchema, TestSchema } from './types';

describe('TestSchema', () => {
    it('should validate a correct test method', () => {
        const validTest = { test: () => true };
        expect(() => TestSchema.parse(validTest)).not.toThrow();
    });

    it('should throw an error for an invalid test method', () => {
        const invalidTest = { test: 'not a function' };
        expect(() => TestSchema.parse(invalidTest)).toThrow(z.ZodError);
    });

    it('should throw an error if test method does not return a boolean', () => {
        const invalidTest = { test: () => 'not a boolean' };
        expect(() => TestSchema.parse(invalidTest)).toThrow(z.ZodError);
    });
});

describe('SerializableObjectSchema', () => {
    it('should validate a correct serializable object', () => {
        const validObject = {
            fromJSON: () => ({}),
            toJSON: () => ({}),
        };
        expect(() => SerializableObjectSchema.parse(validObject)).not.toThrow();
    });

    it('should throw an error for an invalid fromJSON method', () => {
        const invalidObject = {
            fromJSON: 'not a function',
            toJSON: () => ({}),
        };
        expect(() => SerializableObjectSchema.parse(invalidObject)).toThrow(z.ZodError);
    });

    it('should throw an error for an invalid toJSON method', () => {
        const invalidObject = {
            fromJSON: () => ({}),
            toJSON: 'not a function',
        };
        expect(() => SerializableObjectSchema.parse(invalidObject)).toThrow(z.ZodError);
    });
});
