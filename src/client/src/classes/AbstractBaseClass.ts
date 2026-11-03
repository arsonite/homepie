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

// Utility
import String from '@/util/String.ts'

/**
 * Defines the parameters required to initialize an AbstractBaseClass instance.
 */
interface AbstractBaseClassParams {
    /**
     * A brief description of the class instance.
     */
    readonly description?: string;
    /**
     * The display name for the class instance.
     * If not provided, it will be generated from the 'name' property.
     */
    readonly displayName?: string;
    /**
     * The unique name identifier for the class instance.
     */
    readonly name: string;
}

/**
 * An abstract base class providing common properties and initialization logic.
 * Other classes should extend this class to inherit these properties.
 */
abstract class AbstractBaseClass {
    /**
     * A brief description of the class instance.
     */
    public readonly description?: string;
    /**
     * The display name for the class instance.
     */
    public readonly displayName: string;
    /**
     * The encoded version of the display name, used internally.
     */
    public readonly encodedName: string;
    /**
     * The unique name identifier for the class instance.
     */
    public readonly name: string;
    /**
     * Constructs an instance of AbstractBaseClass.
     * @param params - The parameters required to initialize the class instance.
     */

    constructor(params: AbstractBaseClassParams) {
        // Assign the provided description, if any.
        this.description = params.description;
        // Determine the display name. If not provided, generate it by inserting spaces into the 'name'.
        this.displayName = params.displayName ? params.displayName : String.insertSpaces(params.name);
        // Encode the display name for internal use. If displayName is provided, use it; otherwise, use the generated one.
        this.encodedName = params.displayName ? String.encode(String.insertSpaces(params.name)) : String.encode(this.displayName);
        // Assign the unique name identifier.
        this.name = params.name;
    }
}

// Export the AbstractBaseClass to allow other modules to import and extend it.
// This facilitates code reuse and ensures consistency across different class implementations.
export { AbstractBaseClass };
// Export the AbstractBaseClassParams type to provide type safety for parameters.
// This allows other modules to utilize the same parameter structure when initializing AbstractBaseClass instances.
export type { AbstractBaseClassParams };