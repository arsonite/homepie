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
import argparse

class BaseCLI:
    def __init__(self, name, description, flags=None):
        self.name = name
        self.description = description
        self.flags = flags or []
    
    def add_arguments(self, parser):
        """Method to add custom arguments to the parser."""
        for flag in self.flags:
            parser.add_argument(flag['short'], flag['long'], help=flag['help'], required=flag.get('required', False))

    def run(self, args):
        """Override this method in the child classes to implement functionality."""
        raise NotImplementedError("Each script must implement the 'run' method.")

    def get_meta(self):
        """Returns the meta information of the script for dynamic listing."""
        return {
            'name': self.name,
            'description': self.description,
            'flags': self.flags
        }