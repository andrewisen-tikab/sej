import { z } from 'zod';

import { AddDebug } from '../debugger/types';
import type { EditorPointer } from '../editor/types';

export const CalendarDataSchema = z.object({
    /**
     * The hour of the date.
     * @remarks Must be an integer between 0 and 23.
     * @default 0
     */
    hour: z.number().int().min(0).max(23),
    /**
     * The minute of the date.
     * @remarks Must be an integer between 0 and 59.
     * @default 0
     */
    minute: z.number().int().min(0).max(59),
    /**
     * The second of the date.
     * @remarks Must be an integer between 0 and 59.
     * @default 0
     */
    second: z.number().int().min(0).max(59),
    /**
     * The day of the date.
     * @remarks Must be an integer between 0 and 30.
     * @default 0
     */
    day: z.number().int().min(0).max(30),
    /**
     * The month of the date.
     * @remarks Must be an integer between 0 and 11.
     * @default 0
     */
    month: z.number().int().min(0).max(11),
    /**
     * The year of the date.
     * @remarks Must be an integer between 0 and 9999.
     * @default 0
     */
    year: z.number().int().min(0).max(9999),
});

export type CalendarData = z.infer<typeof CalendarDataSchema>;

/**
 * Represents a calendar with methods to set and get the date.
 */
export type Calendar = {
    /**
     * A locale string, array of locale strings, Intl.Locale object, or array of Intl.Locale objects that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used.
     * @default "en-US"
     */
    readonly locales: Intl.LocalesArgument;

    /**
     * An object that contains one or more properties that specify comparison options.
     */
    readonly options: Intl.DateTimeFormatOptions;

    /**
     * The date in ISO string format.
     * @remarks This is a read-only property. Useful for debugging.
     * @default ""
     */
    readonly ISOString: string;

    /**
     * The locale string representation of the date.
     * @remarks This is a read-only property. Useful for debugging.
     * @default ""
     */
    readonly localeString: string;

    /**
     * Whether to visualize the sun.
     * @default false
     */
    visualizeSun: boolean;

    /**
     * The locale or locales to use
     *
     * See [MDN - Intl - locales argument](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument).
     */
    setLocales(locales: Intl.LocalesArgument): void;

    /**
     *
     * @param timeZone - See {}
     */
    setTimezone(timeZone: string): void;

    /**
     * Sets the date for the calendar.
     *
     * @param date - The date to set.
     */
    setDate: (date: Date) => void;
    /**
     * Gets the date from the calendar.
     *
     * @returns The date.
     */
    getDate: () => Readonly<Date>;
} & CalendarData &
    EditorPointer &
    AddDebug;
