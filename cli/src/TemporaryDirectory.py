#!/usr/bin/env python3.11

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
import os
import shutil
import uuid

# TODO: Implement as package class
class TemporaryDirectory:
    """
    A context manager for creating and automatically cleaning up a temporary folder.

    Attributes:
        directory_path (str): The base path where the temporary folder will be created.
        directory_name (str): The name of the temporary folder. If not provided, a unique name will be generated.
        ignore_errors (bool): Whether to ignore errors when deleting the folder.
    """

    def __init__(self, directory_path:str='.', directory_name:str=None, ignore_errors:bool=True, keep_folder:bool=False):
        """
        Initializes the TemporaryDirectory context manager.

        Args:
            directory_path (str): The base path where the temporary folder will be created. Defaults to current directory.
            directory_name (str): The name of the temporary folder. If not provided, a unique name will be generated.
            ignore_errors (bool): Whether to ignore errors when deleting the folder. Defaults to True.
        """
        self.directory_path = directory_path
        # If directory_name is provided, use it; otherwise, generate a unique name
        self.directory_name = directory_name if directory_name else f'~temp-{uuid.uuid4().hex}'
        # Combine base path and folder name to get the full path of the temporary folder
        self.folder_path = os.path.join(self.directory_path, self.directory_name)
        self.ignore_errors = ignore_errors
        self.keep_folder = keep_folder

    def __enter__(self):
        """
        Creates the temporary folder when entering the context.

        Returns:
            str: The path to the temporary folder.
        """
        # Create the directory
        os.makedirs(self.folder_path, exist_ok=True)
        return self.folder_path

    def __exit__(self, exc_type, exc_value, traceback):
        """
        Removes the temporary folder and all its contents when exiting the context.

        Args:
            exc_type (type): The exception type.
            exc_value (Exception): The exception instance.
            traceback (traceback): The traceback object.
        """
        if self.keep_folder:
            return
        # Remove the directory and all its contents
        shutil.rmtree(self.folder_path, self.ignore_errors)