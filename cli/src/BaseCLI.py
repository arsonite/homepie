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

# System imports
import sys

# From system imports
from abc import ABC, abstractmethod
from typing import List

TAB=f'{"":>4}'

class _Argument:
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
                 help_extension:List[str]=None,
                 required:bool=True):
        self.name = name
        self.help = help
        self.help_extension = help_extension
        self.required = required
        self.value = None  # Initialize the value of the argument to None

    def __str__(self):
        """
        Returns a string representation of the _Argument instance.
        """
        return f'Argument: {self.name}, Help: {self.help}, Required: {self.required}'

class _Flag:
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
                 help: str,
                 help_extension:List[str]=None,
                 value_name:str=None,
                 required:bool=True):
        self.short = short
        self.long = long
        self.help = help
        self.help_extension = help_extension
        self.value_name = value_name
        self.required = required
        self.value = None  # Initialize the value of the flag to None

    def __str__(self):
        """
        Returns a string representation of the _Flag instance.
        """
        return f'Flag: {self.short}, {self.long}, Help: {self.help}, Required: {self.required}'

class BaseCLI(ABC):
    """
    Base class for command-line interfaces.

    Attributes:
        name (str): The name of the CLI.
        shorthand (str): The shorthand notation for the CLI.
        help (str): A brief description of the CLI.
        help_extension (str, optional): Additional help information for the CLI.
        arguments (List[_Argument], optional): A list of _Argument instances representing the CLI arguments.
        flags (List[_Flag], optional): A list of _Flag instances representing the CLI flags.
        parsed_arguments (List[str]): The parsed positional arguments from the command-line input.
        parsed_flags (dict): The parsed flags from the command-line input.
    """
    def __init__(self,
                 name:str,
                 shorthand:str,
                 help:str,
                 help_extension:str=None,
                 arguments:List[_Argument]=None,
                 flags:List[_Flag]=None):
        # Initialize the name of the CLI
        self.name = name
        
        # Initialize the shorthand notation for the CLI
        self.shorthand = shorthand
        
        # Initialize the brief description of the CLI
        self.help = help
        
        # Initialize additional help information for the CLI, if provided
        self.help_extension = help_extension
        
        # Initialize the list of _Argument instances representing the CLI arguments
        self.arguments = []
        for argument in arguments:
            self.arguments.append(_Argument(**argument))
        
        # Initialize the list of _Flag instances representing the CLI flags
        # If no flags are provided, initialize it to an empty list
        self.flags = []
        for flag in flags:
            self.flags.append(_Flag(**flag))

        # Parse the command-line arguments and flags
        self.parsed_arguments, self.parsed_flags = self.parse_arguments_and_flags()

    def __str__(self):
        """
        Returns a string representation of the CLI instance.
        """
        return f'CLI: {self.name}, Shorthand: {self.shorthand}, Help: {self.help}'
        
    def parse_arguments_and_flags(self):
        """
        Custom argument parsing logic to be independent from argparser for custom formatting reasons.
        
        This function parses command-line arguments passed to the script.
        It distinguishes between the command name, positional arguments, and flags.
        
        Returns:
            tuple: A tuple containing the command name (str), a list of positional arguments (list),
                   and a dictionary of flags (dict).
        """
        
        # If there are fewer than 2 arguments, return None for command_name and empty lists/dicts for args and kwargs
        if len(sys.argv) < 1:
            return {}
        
        # Initialize empty lists for positional arguments and a dictionary for flags
        arguments = []
        flags = {}
        
        # Iterate over the remaining command-line arguments
        # Initialize the index to start from the first argument after the script name
        i = 1
        
        # Loop through the command-line arguments starting from the second element
        while i < len(sys.argv):
            arg = sys.argv[i]
            
            # Check if the argument is a flag (starts with '-')
            if arg.startswith("-"):
                # Check if the next argument exists and is not another flag
                if i + 1 < len(sys.argv) and not sys.argv[i + 1].startswith("-"):
                    # If the next argument is a value, add it to flags with the current flag as the key
                    flags[arg] = sys.argv[i + 1]
                    # Skip the next argument since it's already processed as a value
                    i += 1
                else:
                    # If the next argument is another flag or doesn't exist, set the current flag to True
                    flags[arg] = True
            else:
                # If the argument is not a flag, add it to the positional arguments list
                arguments.append(arg)
            
            # Move to the next argument
            i += 1
        
        # Return the parsed command name, positional arguments, and flags
        return arguments, flags
    
    def get_meta(self):
        """
        Returns the meta information of the script for dynamic listing.
        """
        return {
            'name': self.name,
            'shorthand': self.short,
            'help': self.help,
            'arguments': self.arguments,
            'flags': self.flags,
        }
        
    def print(self, print_meta:bool=False, print_usage:bool=True, replace_name:bool=False):
        """
        Returns a formatted string representation of the BaseCLI instance.
        """
        # Initialize an empty string to store the formatted output
        indented_formatted_string = ''
        # If print_meta is True, include meta information in the formatted string
        if print_meta:
            # Add shorthand and name to the formatted string
            indented_formatted_string = f'{self.shorthand}, {self.name}\n\t{self.help}'
            
            # If help_extension is provided, add each extension to the formatted string
            if self.help_extension:
                indented_formatted_string += '\n'
                for extension in self.help_extension:
                    indented_formatted_string += f'''\t{extension}'''
                    indented_formatted_string += '\n'
                    
            indented_formatted_string += '\n'
        
        # If print_usage is True, include usage information in the formatted string
        if print_usage:
            # Set the name to './<name>' by default
            name = f'./{self.name}'
            # If replace_name is True, use shorthand and name instead
            if replace_name:
                name = f'{self.shorthand}, {self.name}'
                
            # Add usage information to the formatted string
            indented_formatted_string += '\n'
            indented_formatted_string += f'Usage:\n{TAB}{name} [arguments] [flags]\n'
        
        # If there are arguments, include them in the formatted string
        if self.arguments:
            indented_formatted_string += '\n'
            indented_formatted_string += 'Arguments:\n'
            
            # Iterate over each argument and add its details to the formatted string
            for argument in self.arguments:
                # Format the argument line with indentation
                argument_line = f'{TAB}{argument.name}:'
                argument_line_length = (len(argument_line) + 1)
                argument_line += f' {argument.help}'
                indented_formatted_string += argument_line + '\n'
                
                # If help_extension is provided for the argument, add each extension to the formatted string
                if argument.help_extension:
                    for extension in argument.help_extension:
                        indented_formatted_string += f'{" " * argument_line_length}{extension}\n'
        
        # TODO: Make tab-space the maximum of all flags and arguments for consistency
        # If there are flags, include them in the formatted string
        if self.flags:
            indented_formatted_string += '\n'
            indented_formatted_string += 'Flags:\n'
            
            # Iterate over each flag and add its details to the formatted string
            for flag in self.flags:
                # Format the flag line with indentation
                flag_line = f'{TAB}{flag.short}, {flag.long}:'
                flag_line_length = (len(flag_line) + 1)
                flag_line += f' {flag.help}'
                indented_formatted_string += flag_line + '\n'
                
                # If help_extension is provided for the flag, add each extension to the formatted string
                if flag.help_extension:
                    for extension in flag.help_extension:
                        indented_formatted_string += f'{" " * flag_line_length}{extension}\n'
        
        # Print the final formatted string
        print(indented_formatted_string)
    
    @abstractmethod
    def execute(self, arguments):
        """
        Override this method in the child classes to implement functionality.
        """
        raise NotImplementedError("Each script must implement the 'run' method.")