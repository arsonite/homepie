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

/**
 * Utility class for managing cache and browser storage (localStorage and sessionStorage).
 * Provides methods to set, get, remove, and clear items in both cache and storage.
 */
class Storage {
    // In-memory cache to store key-value pairs for quick access
    private static cache: Record<string, any> = {};

    // TODO: Integrate cache functions into existing setters and getters
    /**
     * Retrieves a value from the in-memory cache based on a dot-separated key path.
     * @param key - The dot-separated key path to retrieve the value from.
     * @returns The value from the cache or null if the key does not exist.
     */
    static getFromCache(key: string): any | null {
        try {
            // Split the key by dots and reduce to traverse the nested object
            return key.split('.').reduce((acc, part) => acc && acc[part], this.cache) || null;
        } catch {
            // Return null if any error occurs during retrieval
            return null;
        }
    }

    /**
     * Sets a value in the in-memory cache based on a dot-separated key path.
     * @param key - The dot-separated key path where the value should be set.
     * @param value - The value to be stored in the cache.
     */
    static setInCache(key: string, value: any): void {
        const parts = key.split('.'); // Split the key into parts
        const last = parts.pop()!; // Get the last part of the key
        // Traverse the cache to find the target object
        const target = parts.reduce((acc, part) => {
            if (!acc[part] || typeof acc[part] !== 'object') acc[part] = {};
            return acc[part];
        }, this.cache);
        target[last] = value; // Set the value at the target location
    }

    /**
     * Removes a value from the in-memory cache based on a dot-separated key path.
     * @param key - The dot-separated key path of the value to be removed.
     */
    static removeFromCache(key: string): void {
        const parts = key.split('.'); // Split the key into parts
        const last = parts.pop()!; // Get the last part of the key
        // Traverse the cache to find the target object
        const target = parts.reduce((acc, part) => acc && acc[part], this.cache);
        if (target && last in target) delete target[last]; // Delete the key if it exists
    }

    /**
     * Clears the entire in-memory cache.
     */
    static clearCache(): void {
        this.cache = {}; // Reset the cache to an empty object
    }

    /**
     * Sets an item in browser storage (localStorage or sessionStorage).
     * Supports nested keys using dot notation.
     * @param key - The key under which the value should be stored.
     * @param value - The value to store.
     * @param useSession - If true, uses sessionStorage; otherwise, uses localStorage.
     */
    static set(key: string, value: any, useSession: boolean = false): void {
        const storage = useSession ? sessionStorage : localStorage; // Choose storage type
        if (key.includes('.')) {
            const [root, ...rest] = key.split('.'); // Split key into root and nested parts
            const data = JSON.parse(storage.getItem(root) || '{}'); // Retrieve existing data or initialize
            let obj = data;
            // Traverse or create nested objects
            rest.slice(0, -1).forEach(part => {
                if (!obj[part] || typeof obj[part] !== 'object') obj[part] = {};
                obj = obj[part];
            });
            obj[rest.pop()!] = value; // Set the value at the nested key
            storage.setItem(root, JSON.stringify(data)); // Save the updated data back to storage
        } else {
            storage.setItem(key, JSON.stringify(value)); // Store value directly if no nesting
        }
    }

    /**
     * Retrieves an item from browser storage (localStorage or sessionStorage).
     * Supports nested keys using dot notation.
     * @param key - The key of the item to retrieve.
     * @param useSession - If true, uses sessionStorage; otherwise, uses localStorage.
     * @returns The retrieved value or null if not found.
     */
    static get(key: string, useSession: boolean = false): any | null {
        try {
            const storage = useSession ? sessionStorage : localStorage; // Choose storage type
            if (key.includes('.')) {
                const [root, ...rest] = key.split('.'); // Split key into root and nested parts
                const data = JSON.parse(storage.getItem(root) || '{}'); // Retrieve data
                return rest.reduce((acc, part) => acc && acc[part], data) || null; // Traverse to get the value
            }
            const item = storage.getItem(key); // Retrieve the item directly
            return item ? JSON.parse(item) : null; // Parse and return the item if it exists
        } catch {
            // Return null if any error occurs during retrieval
            return null;
        }
    }

    /**
     * Removes an item from browser storage (localStorage or sessionStorage).
     * Supports nested keys using dot notation.
     * @param key - The key of the item to remove.
     * @param useSession - If true, uses sessionStorage; otherwise, uses localStorage.
     */
    static delete(key: string, useSession: boolean = false): void {
        const storage = useSession ? sessionStorage : localStorage; // Choose storage type
        if (key.includes('.')) {
            const [root, ...rest] = key.split('.'); // Split key into root and nested parts
            const data = JSON.parse(storage.getItem(root) || '{}'); // Retrieve existing data
            const last = rest.pop()!; // Get the last part of the key
            const obj = rest.reduce((acc, part) => acc && acc[part], data); // Traverse to the target object
            if (obj && last in obj) delete obj[last]; // Delete the key if it exists
            storage.setItem(root, JSON.stringify(data)); // Save the updated data back to storage
        } else {
            storage.removeItem(key); // Remove the item directly if no nesting
        }
    }

    /**
     * Clears all items from browser storage (localStorage or sessionStorage).
     * @param useSession - If true, clears sessionStorage; otherwise, clears localStorage.
     */
    static clear(useSession: boolean = false): void {
        const storage = useSession ? sessionStorage : localStorage; // Choose storage type
        storage.clear(); // Clear all items from the chosen storage
    }

    /**
     * Retrieves all items from browser storage (localStorage or sessionStorage) as a record.
     * @param useSession - If true, uses sessionStorage; otherwise, uses localStorage.
     * @returns A record of all key-value pairs or null if retrieval fails.
     */
    static getAll(useSession: boolean = false): Record<string, any> | null {
        try {
            const storage = useSession ? sessionStorage : localStorage; // Choose storage type
            const entries: Record<string, any> = {};
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i)!; // Get the key at the current index
                entries[key] = JSON.parse(storage.getItem(key) || 'null'); // Parse and store the value
            }
            return entries; // Return all entries
        } catch {
            // Return null if any error occurs during retrieval
            return null;
        }
    }

    /**
     * Updates all items in browser storage (localStorage or sessionStorage) with the provided data.
     * Removes items not present in the updated data and adds/updates existing ones.
     * @param updatedData - The new data to update the storage with.
     * @param useSession - If true, uses sessionStorage; otherwise, uses localStorage.
     */
    static updateAll(updatedData: Record<string, any>, useSession: boolean = false): void {
        const storage = useSession ? sessionStorage : localStorage; // Choose storage type
        const currentData = this.getAllItems(useSession) || {}; // Retrieve current data
        const flatten = (obj: Record<string, any>, prefix = ''): Record<string, any> => {
            // Helper function to flatten nested objects into dot-separated keys
            return Object.keys(obj).reduce((acc, key) => {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    Object.assign(acc, flatten(obj[key], fullKey)); // Recursively flatten
                } else {
                    acc[fullKey] = obj[key]; // Assign the value to the flattened key
                }
                return acc;
            }, {} as Record<string, any>);
        };

        const flatUpdated = flatten(updatedData); // Flatten the updated data
        const flatCurrent = flatten(currentData); // Flatten the current data

        // Remove items that are not present in the updated data
        Object.keys(flatCurrent).forEach(key => {
            if (!(key in flatUpdated)) this.removeItem(key, useSession);
        });

        // Add or update items from the updated data
        Object.entries(flatUpdated).forEach(([key, value]) => {
            this.setItem(key, value, useSession);
        });
    }

    /**
     * Checks if the in-memory cache is empty.
     * @returns True if the cache has no keys, otherwise false.
     */
    static isCacheEmpty(): boolean {
        return Object.keys(this.cache).length === 0; // Check if cache object has any keys
    }
}

export default Storage;