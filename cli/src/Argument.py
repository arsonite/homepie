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
                help:str,
                position:int,
                required:bool,
                help_extension:List[str]=None):
        self.name = name
        self.help = help
        self.position = position
        self.help_extension = help_extension
        self.required = required
        
        self.value = None  # Initialize the value of the argument to None