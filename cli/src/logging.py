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

# System imports
import logging
import logging.handlers
import os
import sys
import inspect
import traceback

# From system imports
from datetime import datetime

# Define a global base log directory
BASE_LOG_DIR = os.path.join(os.path.expanduser("~"), "ApplicationLogs") # User home directory

def create_log_directory() -> str:
    """
    Create a log directory based on the current date.

    This function generates a directory path by joining the base log directory
    with the current date in YYYY-MM-DD format. It ensures that the directory
    exists by creating it if necessary.

    Returns:
        str: The path to the created or existing log directory.
    """
    log_dir = os.path.join(BASE_LOG_DIR, datetime.now().strftime("%Y-%m-%d"))
    os.makedirs(log_dir, exist_ok=True) # Create directory if it doesn't exist
    return log_dir

# Global logger instance
logger = logging.getLogger("global_custom_logger")
logger.setLevel(logging.DEBUG) # Set the minimum logging level to DEBUG

# Create log directory
# log_directory = create_log_directory()

# Console handler for compact logging
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.DEBUG) # Set console handler to capture DEBUG and above

# TODO: Properly test and evaluate the implemented custom file logging functionality
# File handler for detailed logging at INFO level
# info_file_handler = logging.handlers.TimedRotatingFileHandler(
#     os.path.join(log_directory, "info.log"), 
#     when="midnight", # Rotate log at midnight
#     interval=1, # Rotate every 1 day
# )
# info_file_handler.setLevel(logging.INFO) # Set to capture INFO and above

# File handler for detailed logging at WARNING level
# warning_file_handler = logging.handlers.TimedRotatingFileHandler(
#     os.path.join(log_directory, "warning.log"), 
#     when="midnight", 
#     interval=1, 
# )
# warning_file_handler.setLevel(logging.WARNING) # Set to capture WARNING and above

# File handler for detailed logging at ERROR level
# error_file_handler = logging.handlers.TimedRotatingFileHandler(
#     os.path.join(log_directory, "error.log"), 
#     when="midnight", 
#     interval=1, 
# )
# error_file_handler.setLevel(logging.ERROR) # Set to capture ERROR and above

# Console formatter (compact)
console_formatter = logging.Formatter('%(levelname)s - %(message)s')
console_handler.setFormatter(console_formatter) # Apply compact format to console

# File formatter (detailed)
# file_formatter = logging.Formatter(
#     '%(asctime)s - %(levelname)s - %(message)s - [File: %(filename)s, Line: %(lineno)d]', 
#     datefmt='%Y-%m-%d %H:%M:%S'  # Define date format for logs
# )

# Apply detailed formatter to all file handlers
# info_file_handler.setFormatter(file_formatter)
# warning_file_handler.setFormatter(file_formatter)
# error_file_handler.setFormatter(file_formatter)

# Add all handlers to the global logger
logger.addHandler(console_handler)
# logger.addHandler(info_file_handler)
# logger.addHandler(warning_file_handler)
# logger.addHandler(error_file_handler)
# Custom colored formatter

class ColoredFormatter(logging.Formatter):
    """
    ColoredFormatter enhances log messages with ANSI color codes based on the severity level.

    Attributes:
        COLOR_CODES (dict): A dictionary mapping logging levels to their respective ANSI color codes.
            - logging.DEBUG: Blue
            - logging.WARNING: Yellow
            - logging.ERROR: Red
            - logging.CRITICAL: Magenta
        RESET_CODE (str): ANSI code to reset the text color to default.

    Methods:
        format(record):
            Overrides the default format method to prepend and append ANSI color codes to the log message.
            
            Args:
                record (logging.LogRecord): The log record to be formatted.
            
            Returns:
                str: The formatted log message with appropriate color codes.
    """
    COLOR_CODES = {
        logging.DEBUG: '\033[94m', # Blue
        logging.WARNING: '\033[93m', # Yellow
        logging.ERROR: '\033[91m', # Red
        logging.CRITICAL: '\033[95m', # Magenta
    }
    RESET_CODE = '\033[0m'

    def format(self, record):
        color = self.COLOR_CODES.get(record.levelno, self.RESET_CODE)
        message = record.getMessage()
        return f'{color}{message}{self.RESET_CODE}'
    
# Apply the colored formatter to the console handler
console_handler.setFormatter(ColoredFormatter())

def log(message: any, prettify: bool = False, padding: int | None = None) -> int:
    """
    Logs a message with optional pretty formatting and padding.

    Args:
        message (any): The message to be logged. Can be of any type.
        prettify (bool, optional): If True, the message will be pretty-printed.
            Defaults to False.
        padding (int | None, optional): Determines the number of blank lines
            to add before and after the message. Accepted values are 1 or 2.
            If an invalid value is provided, a critical error is logged.
            Defaults to None.

    Returns:
        int: Returns 0 upon successful logging.
    """
    # Get the current frame and retrieve caller's information
    frame = inspect.currentframe().f_back
    # filename = os.path.basename(frame.f_code.co_filename)  # Extract the filename from the caller's frame
    # lineno = frame.f_lineno  # Extract the line number from the caller's frame
    log_message = f'{message}'  # Convert the message to a string for logging
    
    # Validate the padding value
    if padding >= 3 or padding <= 0:
        critical(f'Padding level must be 1 or 2, you passed an invalid value: {padding}')
            
    # Add a blank line before the message if padding is 1 or more
    if padding >= 1:
        logger.info('')
    
    # Pretty-print the message if the prettify flag is set
    if prettify:
        import pprint
        pprint.pprint(log_message)  # Use pprint for formatted output
    else:
        logger.info(log_message)  # Log the message as is
    
    # Add a blank line after the message if padding is exactly 2
    if padding == 2:
        logger.info('')
    
    return 0  # Indicate successful logging

def warn(message: str) -> int:
    """
    Logs a warning message.

    Args:
        message (str): The warning message to be logged.

    Returns:
        int: Returns 0 after logging the warning.
    """
    logger.warning(message)  # Log the warning message
    return 0  # Indicate successful logging

def error(message: str, log_traceback: bool = False) -> int:
    """
    Logs an error message and optionally includes the traceback of the current exception.

    Args:
        message (str): The error message to be logged.
        log_traceback (bool, optional): Flag to determine whether to include the traceback.
            Defaults to False.

    Returns:
        int: Returns 1 to indicate an error has occurred.
    """
    # Retrieve the current exception information from the system
    exc_info = sys.exc_info()
    
    # Check if there is an active exception
    if exc_info and exc_info[0] is not None:
        # If an exception exists, proceed to log the error with exception details
        if log_traceback:
            # Log the error message with exception information
            logger.error(f'ERROR - {message}', exc_info=True)
            # Additionally, log the formatted traceback as a critical error
            logger.critical(traceback.format_exc(), exc_info=True)
        else:
            # Log the error message with exception information without the traceback
            logger.error(f'ERROR - {message}', exc_info=True)
    else:
        # If no exception is present, log the error message without exception info
        logger.error(f'ERROR - {message}')
    
    # Return 1 to signify that an error has been handled
    return 1

def critical(message: str, log_traceback: bool = False) -> None:
    """
    Logs a critical error message and exits the program.

    This function logs the provided error message, optionally including the traceback,
    and then terminates the program with an exit status of 1.

    Args:
        message (str): The critical error message to be logged.
        log_traceback (bool, optional): Flag to determine whether to include the traceback.
            Defaults to False.
    """
    # Log the error message as a critical error, potentially including the traceback
    error(message, log_traceback)
    
    # Exit the program with a status code of 1, indicating an error has occurred
    sys.exit(1)

def exception_handler(exc_type:any, exc_value:any, exc_traceback:any) -> int:
    """
    Handle uncaught exceptions and log them appropriately.

    This function is intended to replace the default excepthook. It logs any
    uncaught exceptions using the global logger, except for KeyboardInterrupt,
    which it re-raises to allow the program to exit gracefully.

    Args:
        exc_type (type): The exception type.
        exc_value (BaseException): The exception instance.
        exc_traceback (traceback): The traceback object.
    """
    if issubclass(exc_type, KeyboardInterrupt):
        # If the exception is a KeyboardInterrupt, use the default handler
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
        return
    # Log the uncaught exception with traceback details
    logger.critical("Exception occured:", exc_info=(exc_type, exc_value, exc_traceback))
    return 1

# Set the exception hook to the custom exception handler
# sys.excepthook = exception_handler