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

# From own imports
from .Argument import Argument
from .Command import Command
from .Flag import Flag

# TODO: Replace with package constant
TAB='    '

class BaseCLI(ABC):
    """
    Base class for command-line interfaces.

    Attributes:
        name (str): The name of the CLI.
        shorthand (str): The shorthand notation for the CLI.
        help (str): A brief description of the CLI.
        help_extension (str): Additional help information for the CLI.
        arguments (list): A list of Argument instances representing the CLI arguments.
        commands (list): A list of Command instances representing the CLI commands.
        flags (list): A list of Flag instances representing the CLI flags.
        parsed_arguments (list): A list of parsed positional arguments.
        parsed_command (str): The parsed command name.
        parsed_flags (dict): A dictionary of parsed flags.
        parsing_errors (list): A list of parsing errors encountered during validation.
    """
    def __init__(self,
                 auto_preinit: bool = True,
                 auto_parse: bool = True,
                 auto_validate: bool = True,
                 auto_execute: bool = True):
        """
        Initializes the BaseCLI instance.

        Args:
            auto_preinit (bool): Whether to automatically call the pre_init method.
            auto_parse (bool): Whether to automatically parse command-line arguments.
            auto_validate (bool): Whether to automatically validate parsed arguments.
            auto_execute (bool): Whether to automatically execute the CLI command.
        """
        
        if auto_preinit:
            if hasattr(self, 'pre_init') and callable(getattr(self, 'pre_init')):
                self.pre_init()
                
        meta = self.meta()

        # Initialize the name of the CLI
        self.name = meta['name'] if 'name' in meta else None
        # Initialize the shorthand notation for the CLI
        self.shorthand = meta['shorthand'] if 'shorthand' in meta else None
        # Initialize the brief description of the CLI
        self.help = meta['help'] if 'help' in meta else None
        # Initialize additional help information for the CLI, if provided
        self.help_extension = meta['help_extension'] if 'help_extension' in meta else None
        
        arguments = meta['arguments'] if 'arguments' in meta else []
        commands = meta['commands'] if 'commands' in meta else []
        value_error = None
        if len(commands) > 0:
            if len(arguments) > 0:
                value_error = True
        elif len(arguments) > 0:
            if len(commands) > 0:
                value_error = True
        if value_error:
            raise ValueError('You cannot have pre-defined arguments and commands at the same time.')
        
        # Initialize the list of Argument instances representing the CLI arguments
        self.arguments = []
        for index, argument in enumerate(arguments):
            self.arguments.append(Argument(**argument, position=index))
        
        # Initialize the list of Command instances representing the CLI arguments
        self.commands = []
        for command in commands:
            self.commands.append(Command(**command))
        
        # Initialize the list of Flag instances representing the CLI flags
        flags = meta['flags'] if 'flags' in meta else []
        self.flags = []
        for flag in flags:
            self.flags.append(Flag(**flag))
        
        if auto_parse:
            if hasattr(self, 'pre_parse') and callable(getattr(self, 'pre_parse')):
                self.pre_parse()
                
            # Parse the command-line arguments and flags
            self.parse_args()

            if auto_validate:
                self.validate_args()
        
        if auto_execute:
            self.execute()

    def parse_args(self):
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
        command = None
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
                if len(self.commands) > 0:
                    if command is None:
                        for search_command in self.commands:
                            if arg == search_command.name or arg == search_command.shorthand:
                                command = arg
                                continue
                # If the argument is not a flag, add it to the positional arguments list
                arguments.append(arg)
            
            # Move to the next argument
            i += 1
            
        # Assign the parsed command name, positional arguments, and flags
        self.parsed_arguments = arguments
        self.parsed_command = command
        self.parsed_flags = flags
        
    def validate_args(self):
        """
        Pre-execution checks for required arguments and flags.

        This method ensures that all required arguments and flags have been provided
        before the main execution of the CLI. If any required argument or flag is missing,
        it prints an error message and returns False, indicating that the execution should not proceed.

        Returns:
            bool: True if all required arguments and flags are provided, False otherwise.
        """
        
        # Initialize an empty list to store any parsing errors encountered
        parsing_errors = []

        # Check if the help flag ('-h' or '--help') is present in the parsed flags
        help_flag_detected = '-h' in self.parsed_flags or '--help' in self.parsed_flags
        # Check if the help flag ('-h' or '--help') is present in the parsed flags
        if help_flag_detected:
            # If the help flag is detected, print the CLI usage information
            self.print()
            sys.exit(0)
        else:
            # TODO: Check too many commands and wrong commands
            if len(self.commands) > 0:
                if self.parsed_command:
                    for command in self.commands:
                        if self.parsed_command == command.name or self.parsed_command == command.shorthand:
                            command.value = self.parsed_command
                else:
                    parsing_errors.append('No command provided.')
            else:
                # Determine the number of parsed arguments and the total number of expected arguments
                amount_of_parsed_arguments = len(self.parsed_arguments)
                amount_of_all_arguments = len(self.arguments)
                # Check if the number of parsed arguments exceeds the number of expected arguments
                if amount_of_parsed_arguments > amount_of_all_arguments:
                    parsing_errors.append(
                        f'Number of possible arguments provided ({amount_of_parsed_arguments}) is greater than expected ({amount_of_all_arguments}).'
                    )

                # Calculate the number of required arguments
                amount_of_required_arguments = len([argument for argument in self.arguments if argument.required])
                amount_of_required_additional_arguments = amount_of_required_arguments - amount_of_parsed_arguments

                # Check if the number of parsed arguments is less than the number of required arguments
                if amount_of_parsed_arguments < amount_of_required_arguments:
                    parsing_errors.append(
                        f'Script requires ({amount_of_required_additional_arguments}) additional argument{"s" if amount_of_required_additional_arguments > 1 else ""}.'
                    )

                # Check for missing required arguments
                for argument in self.arguments:
                    if argument.required and amount_of_required_additional_arguments > 0:
                        parsing_errors.append(f'Missing required argument: <{argument.name}>.')
                        continue
                        
                    if self.parsed_arguments[argument.position]:
                        argument.value = self.parsed_arguments[argument.position]

            # Check for unknown flags in the parsed flags
            for parsed_flag in self.parsed_flags:
                search_result = [flag for flag in self.flags if flag.short == parsed_flag or flag.long == parsed_flag]
                if len(search_result) == 0:
                    parsing_errors.append(f'Unknown flag: {parsed_flag}.')

            # Check for missing required flags and validate flag values
            for flag in self.flags:
                if flag.required:
                    if flag.short not in self.parsed_flags and flag.long not in self.parsed_flags:
                        parsing_errors.append(f'Missing required flag: {flag.short}, {flag.long}.')
                        
                if flag.short in self.parsed_flags or flag.long in self.parsed_flags:
                    parsed_flag_value = self.parsed_flags.get(flag.short) or self.parsed_flags.get(flag.long)
                    if parsed_flag_value and flag.value_name is None and parsed_flag_value is not True:
                        parsing_errors.append(
                            f'Flag "{flag.short}, {flag.long}" does not expect a value, but one was given: "{parsed_flag_value}".'
                        )
                    else:
                        flag.value = parsed_flag_value

        # Assign the list of parsing errors encountered
        amount_of_parsing_errors = len(parsing_errors)
        if amount_of_parsing_errors > 0:
            print()
            print(f'({amount_of_parsing_errors}) Parsing errors occured:')
            for parsing_error in parsing_errors:
                print(parsing_error)
            print()
            print('Hint: Use the -h, --help flag for usage information.')
            print()
            sys.exit(1)
    
    def format_str(self, include_args:bool, include_meta:bool, minify_usage:bool, tab_padding:int):
        """
        Formats the CLI usage and meta information into a string.

        This method generates a formatted string containing the CLI's usage information,
        including arguments, commands, and flags. It can also include meta information
        such as the CLI's name, shorthand, and help description.

        Args:
            include_meta (bool): Whether to include meta information in the formatted string.
            print_usage (bool): Whether to include minified usage information in the formatted stri
            tab_padding (int): The number of spaces to use for indentation

        Returns:
            str: The formatted string containing the CLI's usage and meta information.
        """
        def pad(indented_formatted_string):
            tabs = ''
            for _ in range(tab_padding):
                tabs += TAB
            return f'{tabs}{indented_formatted_string}'
        
        # Initialize an empty string to store the formatted output
        indented_formatted_string = ''
        
        # If include_meta is True, include meta information in the formatted string
        if include_meta:
            # If help_extension is provided, add each extension to the formatted string
            if self.help_extension:
                indented_formatted_string += '\n'
                for extension in self.help_extension:
                    indented_formatted_string += pad(f'\t{extension}')
                    indented_formatted_string += '\n'
                    
            indented_formatted_string += '\n'
        
        # Set the name to './<name>' by default
        name = f'./{self.name}'
        if minify_usage:
            # Add shorthand and name to the formatted string
            indented_formatted_string = pad(f'{self.shorthand}, {self.name}')
        else:
            # Add usage information to the formatted string
            indented_formatted_string += '\n'
            indented_formatted_string += f'Usage:\n{TAB}{name}'
        
        amount_of_arguments_greater_0 = len(self.arguments)
        if amount_of_arguments_greater_0:
            indented_formatted_string += ' [arguments]'
        
        amount_of_commands_greater_0 = len(self.commands)
        if amount_of_commands_greater_0:
            indented_formatted_string += ' [command]'
        
        amount_of_flags_greater_0 = len(self.flags)
        if amount_of_flags_greater_0:
            indented_formatted_string += ' [flags]'
            
        if include_meta:
            indented_formatted_string += pad(f'\n\t{self.help}')
        
        if include_args:
            indented_formatted_string += '\n'
            
            # TODO: Make tab-space the maximum of all flags and arguments for consistency
            # If there are arguments, include them in the formatted string
            if amount_of_arguments_greater_0:
                indented_formatted_string += '\n'
                indented_formatted_string += 'Arguments:\n'
                
                # Iterate over each argument and add its details to the formatted string
                for argument in self.arguments:
                    # Format the argument line with indentation
                    argument_line = f'{TAB}<{argument.name}>:'
                    argument_line_length = (len(argument_line) + 1)
                    argument_line += f' {argument.help}'
                    indented_formatted_string += argument_line + '\n'
                    
                    # If help_extension is provided for the argument, add each extension to the formatted string
                    if argument.help_extension:
                        for extension in argument.help_extension:
                            indented_formatted_string += f'{" " * argument_line_length}{extension}\n'
                            
            # If there are commands, include them in the formatted string
            if amount_of_commands_greater_0:
                indented_formatted_string += '\n'
                indented_formatted_string += 'Commands:\n'
                
                # Iterate over each argument and add its details to the formatted string
                for command in self.commands:
                    # Format the command line with indentation
                    command_line = f'{TAB}{command.shorthand}, {command.name}:'
                    command_line_length = (len(command_line) + 1)
                    command_line += f' {command.help}'
                    indented_formatted_string += command_line + '\n'
                    
                    # If help_extension is provided for the command, add each extension to the formatted string
                    if command.help_extension:
                        for extension in command.help_extension:
                            indented_formatted_string += f'{" " * command_line_length}{extension}\n'
            
            # TODO: Make tab-space the maximum of all flags and arguments for consistency
            # If there are flags, include them in the formatted string
            if amount_of_flags_greater_0:
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
        
        return indented_formatted_string
            
    def print(self, include_args:bool=True, include_meta:bool=False, minify_usage:bool=False, tab_padding:int=0):
        """
        Prints the formatted CLI usage and meta information to the console.

        This method generates a formatted string containing the CLI's usage information,
        including arguments, commands, and flags. It can also include meta information
        such as the CLI's name, shorthand, and help description. The formatted string
        is then printed to the console.

        Args:
            include_args (bool): Whether to include arguments, commands, and flags in the formatted string.
            include_meta (bool): Whether to include meta information in the formatted string.
            minify_usage (bool): Whether to include minified usage information in the formatted string.
            tab_padding (int): The number of spaces to use for indentation.
        """
        
        # Generate the formatted string using the format_str method
        # The format_str method takes include_args, include_meta, minify_usage, and tab_padding as arguments
        indented_formatted_string = self.format_str(include_args, include_meta, minify_usage, tab_padding)
        
        # Print the final formatted string to the console
        print(indented_formatted_string)
    
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
        
    def get_command(self):
        """
        Returns the value of the command.

        This method retrieves the value associated with the command
        that has been parsed from the command-line input.

        Returns:
            Any: The value of the command, initially set to None.
        """
        # Access the value attribute of the command instance and return it
        for command in self.commands:
            if command.value:
                return command.value
        return None

    def get_argument(self, name:str):
        """
        Returns the argument value with the given name.
        """
        for argument in self.arguments:
            if argument.name == name:
                return argument.value
        return None
        
    def get_flag(self, name:str):
        """
        Returns the flag value with the given name.
        """
        for flag in self.flags:
            if flag.short == name or flag.long == name:
                return flag.value
        return None
    
    def pre_init(self):
        """
        Optional method to be overridden in child classes for pre-execution logic.
        Not making it abstract, to prevent the need to implement it in every child class.
        """
        pass
    
    def pre_parse(self):
        """
        Optional method to be overridden in child classes for pre-parsing logic.
        Not making it abstract, to prevent the need to implement it in every child class.
        """
        pass
    
    @abstractmethod
    def meta(self) -> dict[
        'name':str,
        'shorthand':str,
        'help':str,
        'help_extension':str,
        'arguments':List[Argument],
        'commands':List[Command],
        'flags':List[Flag]]:
        """
        Override this method in the child classes to provide meta information.
        
        This method is used to ensure that the script works the same way whether it is executed directly
        or imported and then executed. The meta information such as name, shorthand, help, arguments, commands,
        and flags must be provided by the child class implementing this method.
        """
        raise NotImplementedError("Each script MUST implement the 'meta' method.")
                
    @abstractmethod
    def execute(self):
        """
        Override this method in the child classes to implement functionality.
        """
        raise NotImplementedError("Each script MUST implement the 'execute' method.")