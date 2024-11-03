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
class Flag:
    """
    Represents a command-line flag.

    Attributes:
        short (str): The short form of the flag (e.g., '-h').
        long (str): The long form of the flag (e.g., '--help').
        help (str): A brief description of the flag.
        help_extension (List[str], optional): Additional help information for the flag.
        value_name (str, optional): The name of the value associated with the flag.
        required (bool): Indicates whether the flag is required.
        value (Any): The value of the flag, initially set to None.
    """
    def __init__(self,
                short: str,
                long: str,
                help: str|List[str],
                required:bool,
                options:List[str]=None):
        self.short = f'-{short}'
        self.long = f'--{long}'
        self.help = help
        self.required = required
        
        self.options = options
        
        self.value = None # Initialize the value of the flag to None