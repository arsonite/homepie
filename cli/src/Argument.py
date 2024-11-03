# Copyright (C) 2024-2025 Burak Günaydin
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, version 3 of the License.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.

# From system imports
from typing import List
    
# TODO: Implement as package class
class Argument:
    """
    Represents a command-line argument.

    Attributes:
        name (str): The name of the argument.
        help (str): A brief description of the argument.
        help_extension (List[str], optional): Additional help information for the argument.
        required (bool): Indicates whether the argument is required.
        value (Any): The value of the argument, initially set to None.
    """
    def __init__(self,
                name:str,
                help:str|List[str],
                position:int,
                required:bool):
        self.name = name
        self.help = help
        self.position = position
        self.required = required
        
        self.value = None  # Initialize the value of the argument to None