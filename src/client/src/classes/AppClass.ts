/**
 * @license
 * Copyright (C) 2024-2025 Burak Günaydin
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Classes
import { AbstractBaseClass, AbstractBaseClassParams } from '@/classes/AbstractBaseClass.ts';

/**
 * Interface defining the parameters for AppClass.
 * Extends the AbstractBaseClassParams to inherit common parameters.
 */
interface AppClassParams extends AbstractBaseClassParams {
    /**
     * An optional array of alternative icon source URLs.
     */
    readonly alternativeIconSrc?: string[];
    /**
     * An optional React functional component associated with the AppClass.
     */
    readonly component?: React.FC;
    /**
     * A flag indicating if the AppClass is restricted to developers only.
     */
    readonly developersOnly?: boolean;
}

/**
 * AppClass extends the AbstractBaseClass to include additional properties
 * specific to the application's requirements.
 */
class AppClass extends AbstractBaseClass {
    /**
     * Stores alternative icon sources if provided.
     */
    public readonly alternativeIconSrc?: string[];
    /**
     * Stores the React component associated with this AppClass, if any.
     */
    public readonly component?: React.FC | undefined;
    /**
     * Indicates whether this class is intended for developers only.
     * Defaults to false if not specified.
     */
    public readonly developersOnly?: boolean | false;

    /**
     * Constructs an instance of AppClass.
     * @param params - The parameters required to initialize the AppClass.
     */
    constructor(params: AppClassParams) {
        // Call the constructor of the superclass with the provided parameters.
        super(params);

        // Assign alternativeIconSrc if provided; otherwise, set to undefined.
        this.alternativeIconSrc = params.alternativeIconSrc ? params.alternativeIconSrc : undefined;

        // Assign component if provided; otherwise, set to undefined.
        this.component = params.component ? params.component : undefined;

        // Assign developersOnly if provided; otherwise, default to false.
        this.developersOnly = params.developersOnly ? params.developersOnly : false;
    }
}

// Export the AppClass for use in other modules.
export { AppClass };
// Export the AppClassParams type for type safety in other modules.
export type { AppClassParams };