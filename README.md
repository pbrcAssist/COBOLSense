# Cobol Sense

## Overview

Cobol Sense is a Visual Studio Code extension that serves as a GPT Assistant for COBOL. It provides features such as code documentation, code generation, and code optimization.

## Features

### Document

The Document command allows you to generate documentation for your COBOL code using Cobol Sense. It leverages a backend API to enhance code documentation.

To use:
1. Open a COBOL file in Visual Studio Code.
2. Select the code you want to document.
3. Right-click, select "Cobol Sense," and choose "Document."
4. A new tab will open, displaying the documentation of the highlighted code.

### Generate

Generate code snippets efficiently with the Generate command. Simply provide a prompt, and Cobol Sense will generate the code for you.

To use:
1. Open a COBOL file in Visual Studio Code.
2. Right-click, select "Cobol Sense," and choose "Generate."
3. Follow the prompts to generate code based on your input.

### Optimize

Optimize your COBOL code with the Optimize command. Cobol Sense communicates with a backend API to refactor and improve the efficiency of your code.

To use:
1. Open a COBOL file in Visual Studio Code.
2. Select the code you want to optimize.
3. Right-click, select "Cobol Sense," and choose "Optimize."
4. Your code will be optimized, improving its efficiency.

## Usage

1. Open a COBOL file in Visual Studio Code.
2. Select the code you want to perform an action on.
3. Open the command palette (Ctrl + Shift + P) and run the corresponding command:
    - **Document**: `cobol-sense.documentCommand`
    - **Generate**: `cobol-sense.generateCommand`
    - **Optimize**: `cobol-sense.optimizeCommand`

## Commands

- `cobol-sense.documentCommand`: Document selected COBOL code.
- `cobol-sense.generateCommand`: Generate code based on a prompt.
- `cobol-sense.optimizeCommand`: Optimize selected COBOL code.

## Requirements

- Visual Studio Code version 1.84.0 and above.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view (Ctrl + Shift + X).
3. Search for "Cobol Sense" and install the extension.

## Contributing

For more information, visit the [Cobol Sense GitHub Repository](https://github.com/cobolsense/COBOLSense).

## License

This project is licensed under the Apache License, Version 2.0 - see the [LICENSE.md](LICENSE.md) file for details.
