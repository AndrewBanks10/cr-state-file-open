# cr-state-file-open
This extension will display a source file at the line number associated with a specified redux state change when used in conjunction with [StateMonitor](https://github.com/AndrewBanks10/StateMonitor).

## Requirements

1. [vscode](https://code.visualstudio.com/)
2. [causality-redux](https://github.com/AndrewBanks10/causality-redux)
3. [react-causality-redux](https://github.com/AndrewBanks10/react-causality-redux)
4. [create-react-project](https://github.com/AndrewBanks10/create-react-project)
5. [StateMonitor](https://github.com/AndrewBanks10/StateMonitor)

## Installation

### Mac & Linux
```
cd $HOME/.vscode/extensions
git clone https://github.com/AndrewBanks10/cr-state-file-open
cd cr-state-file-open
npm install
```

### Windows
```
cd %USERPROFILE%\.vscode\extensions
git clone https://github.com/AndrewBanks10/cr-state-file-open
cd cr-state-file-open
npm install
```

## Usage
Using the StateMonitor, select a particular state for details. Then open the command palette in vscode and find the command "react-causality-redux load file". Select it. This will open the source file that caused the state change at the particular line number. 

## Known Issues
None

### License
MIT

