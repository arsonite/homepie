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

// Types
// import FixedArrayType from '@/types/FixedArrayType.ts';

/**
 * RGB type represents an array of three numbers, each corresponding to the red, green, and blue components of a color.
 * The FixedArrayType ensures that the array always has exactly three elements.
 */
// type RGBType = FixedArrayType<number, 3>
type RGBType = [number, number, number];

export default RGBType;