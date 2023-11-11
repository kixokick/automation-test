# Setting Up a Node.js Environment for Running the Code

To run the provided Puppeteer code, you need to set up a Node.js environment on your system. Puppeteer is a Node.js library that provides a high-level API to control headless Chrome or Chromium browsers. Here are the steps to set up a Node.js environment:

## Step 1: Install Node.js and npm

If you haven't already, you need to install Node.js, which includes npm (Node Package Manager). You can download the latest version of Node.js from the official website: [Node.js Downloads](https://nodejs.org/en/download/).

Follow the installation instructions for your specific operating system.

To check if Node.js and npm are installed, open your command line or terminal and run the following commands:

```bash
node -v
npm -v
```

These commands should display the installed Node.js and npm versions, respectively.

## Step 2: Create a Project Directory

You need to clone this repository onto your local machine, by copying the https code and using ```git clone https://github.com/kixokick/automation-test.git``` or by downloading the file as a zip.
Afterward, you need to open terminal in the folder just created.
and run the command

```bash
npm install
```

## Step 3: Run the project

Once you are done running the ```npm install``` command, it would download all the dependencies and you can run the project with the command 
```bash
npm start
```

The script will launch Chrome browser, navigate to the specified URL, interact with the web page elements, and perform the actions described in the code.

Make sure you have a stable internet connection and a computer with sufficient resources to run a headless browser.

Your Node.js environment is now set up, and you can run the provided Puppeteer code by following the steps above.