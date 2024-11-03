# Copyright (c) 2024-2025 Burak Günaydin
# All Rights Reserved
#
# This software is the confidential and proprietary information of
# Burak Günaydin. You may not use, modify, or distribute this
# software (unless you have the permission of the copyright holder)
# except in accordance with the terms of any applicable license agreement.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

# From system imports
from typing import List

# TODO: Implement as package class
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