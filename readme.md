
# SalesNav Puller

**SalesNav Puller** is a Node.js tool designed to extract contact data from Sales Navigator and generate CSV files. This is particularly useful for teams that either don't have direct access to Sales Navigator or shouldn't have it.

## Why Use SalesNav Puller?

Sales Navigator has some quirks, such as not allowing easy export of saved searches. This tool provides a workaround by pulling the data and sharing it with your team in a straightforward format.

## Features

- Export contact data from Sales Navigator saved searches.
- Generates CSV files for easy sharing and collaboration.
- Works with 2-factor authentication and manual security checks.

## Key Notes

- The tool **waits until the user has completed any required security checks**. This is intentional and works seamlessly with setups using 2-factor authentication.
- The **code layout is as-is** and not intended to be a showcase of advanced JavaScript or TypeScript practices. It is functional, simple, and focused on solving the problem at hand.

## Prerequisites

- Node.js (LTS version recommended)
- NPM (comes with Node.js)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/DominicFinn/salesnav_puller.git
   ```
2. Navigate to the project directory:
   ```bash
   cd salesnav_puller
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the tool:
   ```bash
   npm start
   ```
2. Follow the prompts to log in to Sales Navigator and complete any security checks.
3. Once authenticated, the tool will extract the contact data and generate CSV files in the project directory.

## Limitations

- Ensure you have appropriate permissions and access to Sales Navigator before using this tool.
- This library **does not bypass** any security or restrictions set by Sales Navigator—it streamlines the process of exporting data you already have access to.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to fork the repository and submit a pull request.

## License

This project is open-source and available under the [MIT License](LICENSE).
