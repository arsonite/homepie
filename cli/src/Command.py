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
# TODO: Ommit commands in favor of flags with values (e.g. --name "John Doe" or maybe even "=" assignement e.g. --name="John Doe")
class Command:
    """
    Represents a command-line command.

    Attributes:
        name (str): The name of the command.
        help (str): A brief description of the command.
        help_extension (List[str], optional): Additional help information for the command.
        value (Any): The value of the command, initially set to None.
    """
    def __init__(self,
                name:str,
                shorthand:str,
                help:str|List[str]):
        self.name = name
        self.shorthand = shorthand
        self.help = help
        
        self.value = None