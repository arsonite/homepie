#!/bin/bash

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

#########################################################
#################### START CMD PARSE ####################
#########################################################

# Check if there are any arguments
if [ "$#" -gt 0 ]; then
    echo
    echo "This script does not accept any arguments. Proceeding ..."
    echo
fi

#######################################################
#################### END CMD PARSE ####################
#######################################################

#######################################################
#################### SCRIPT START #####################
#######################################################

# Get the directory of the script and navigate to it
# Necessary code-repetition to ensure being able to execute script from anywhere
script_dir=$(dirname "$(readlink -f "$0")")
cd "$script_dir"
cd ..

pnpm build