# Copyright (c) 2024-2024 Burak Günaydin
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
                options:List[str]=None,
                value_name:str=None):
        self.short = f'-{short}'
        self.long = f'--{long}'
        self.help = help
        self.required = required
        
        self.options = options
        self.value_name = value_name
        
        self.value = None # Initialize the value of the flag to None