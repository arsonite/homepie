import sys

class CommandParser:
    def __init__(self):
        self.parsed_args = {}
        self.required_tokens = []
        self.tokens = {}
        self.options = {}

    def add_required_token(self, token, desc):
        self.required_tokens.append(token)
        self.tokens[token] = desc

    def add_optional_token(self, token, desc):
        self.tokens[token] = desc

    def add_option(self, option, desc, hint=None):
        self.options[option] = (desc, hint)

    def parse_arguments(self, args):
        i = 0
        while i < len(args):
            token = args[i]
            if token in self.tokens:
                if token in self.required_tokens:
                    if i + 1 < len(args):
                        self.parsed_args[token] = args[i + 1]
                        i += 1  # Skip the next argument as it's the value for the token
                    else:
                        return False, f"Missing argument for {token}"
                else:
                    self.parsed_args[token] = True  # For optional tokens without values
            else:
                return False, f"Unknown option: {token}"
            i += 1

        # Check for required tokens
        missing_tokens = [token for token in self.required_tokens if token not in self.parsed_args]
        if missing_tokens:
            return False, f"Missing required argument(s): {', '.join(missing_tokens)}"

        return True, None

    def print_usage(self):
        print("\nUsage: sh <path>/start.sh [REQUIRED] [OPTIONS]\n")
        print("Required:")
        for token, desc in self.tokens.items():
            if token in self.required_tokens:
                print(f"  {token} {desc}")
        print("\nOptions:")
        for token, desc in self.tokens.items():
            if token not in self.required_tokens:
                print(f"  {token} {desc}")
        for option, (desc, hint) in self.options.items():
            print(f"  {option} {desc}")
            if hint:
                print(f"{'':28s}{hint}")
        print("")

def main():
    parser = CommandParser()

    # Define required tokens
    parser.add_required_token("-e", "<env>")
    
    # Define optional tokens
    parser.add_optional_token("-d", "Execute script in background")
    parser.add_optional_token("-i", "Disables forcing a restart if process is already running")
    parser.add_optional_token("-t", "Display logs of the process running in background")
    
    # Define options
    parser.add_option("--tail-logs", "Display logs of the process running in the terminal", "(Requires '-d')")

    # Parse command-line arguments
    args = sys.argv[1:]
    success, error_message = parser.parse_arguments(args)
    if not success:
        print(error_message)
        parser.print_usage()
        sys.exit(1)

    # Access parsed arguments
    env = parser.parsed_args.get("-e")
    if env:
        print(f"Environment set to: {env}")

    # Further logic based on parsed arguments
    if env == "prod":
        print("No production build available yet.")

    # Execute main script logic using parsed arguments...

if __name__ == "__main__":
    main()
