import React, { useState, useEffect } from 'react';
import { useUpdateGameStats } from '../hooks/useQueries';

const Code = () => {

  const pdfFiles = [
    "/public/PDFs/FE-Jan25-A1.pdf",
    "/public/PDFs/FE-Jan25-A2.pdf",
    "/public/PDFs/FE-Jan25-A3.pdf",
    "/public/PDFs/FE-Jan25-B1.pdf",
    "/public/PDFs/FE-Jan25-B2.pdf",
    "/public/PDFs/FE-Jan25-B3.pdf",
  ]
  const pdfSol = [
    "/public/PDFs/FE-Jan25-Sol-A1.pdf",
    "/public/PDFs/FE-Jan25-Sol-A2.pdf",
    "/public/PDFs/FE-Jan25-Sol-A3.pdf",
    "/public/PDFs/FE-Jan25-Sol-B1.pdf",
    "/public/PDFs/FE-Jan25-Sol-B2.pdf",
    "/public/PDFs/FE-Jan25-Sol-B3.pdf",
  ]
  const addGameStats = useUpdateGameStats();
  const [showSolution, setShowSolution] = useState(false);
  const [selectedPdfPathSol, setSelectedPdfPathSol] = useState(null);
  const [randomIndex, setRandomIndex] = useState(null);
  const [selectedPdfPath, setSelectedPdfPath] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Select a random PDF *once* when the component mounts
  useEffect(() => {
    document.title = "Code";

    console.log("Effect 1: Calculating index and setting first PDF path.");
    const numFiles = pdfFiles.length;
    if (numFiles > 0) {
      const calculatedIndex = Math.floor(Math.random() * numFiles);
      setRandomIndex(calculatedIndex); // Store the index in state

      // Set the path for the first PDF immediately using the calculated index
      const randomFilename = pdfFiles[calculatedIndex];
      // --- Construct correct path relative to public folder ---
      const pdfPath = `${randomFilename}`; // Removed /public/
      setSelectedPdfPath(pdfPath);
      console.log("Selected PDF Index:", calculatedIndex);
      console.log("Selected PDF Path:", pdfPath);
    } else {
      console.error("PDF files array is empty.");
    }
  }, []);

  useEffect(() => {
    console.log("Effect 2: Checking randomIndex to set solution path. Index is:", randomIndex);
    // Only run if randomIndex has been set (is not null) and is valid
    if (randomIndex !== null && randomIndex >= 0 && randomIndex < pdfSol.length) {
      const randomSolFilename = pdfSol[randomIndex];
      // --- Construct correct path relative to public folder ---
      // Adjust '/PDFs/solutions/' if your structure is different
      const pdfSolPath = `${randomSolFilename}`; // Removed /public/
      setSelectedPdfPathSol(pdfSolPath);
      console.log("Selected Solution PDF Path:", pdfSolPath);
    } else {
      console.log("Effect 2: randomIndex is null or invalid, skipping solution path set.");
    }
  }, [randomIndex]);


  //THIS IS WHERE YOU CAN ASSIGN POINTS
  const handleToggleSolutionClick = () => {
    const willShowSolution = !showSolution;
    setShowSolution(willShowSolution);
    if (willShowSolution && selectedPdfPathSol) {
      setIsModalOpen(true);
    }
  };

  const handleModalResponse = (gotItRight) => {
    console.log("User response:", gotItRight ? "Yes" : "No");
    setIsModalOpen(false);
  };


  //This holds the user's entry
  const [code, setCode] = useState('#include <stdio.h>\n\n//Start typing your code here \n int main() {\n\treturn 0;\n}');
  //This will hold the output from the terminal
  const [terminalOutput, setTerminalOutput] = useState('Terminal output will appear here');
  //State to track if code is running/compiling
  const [isRunning, setIsRunning] = useState(false);
  //This will state the problem to solve
  const [problem, setProblem] = useState({
    name: 'Problem Name here: '
  });

  const handleResetCode = () => {
    console.log('Resetting code');
    setCode('/#include <stdio.h>\n\n//Start typing your code here \n int main() {\n\treturn 0;\n}');
  }

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };


  const handleRunCode = async () => {
    setIsRunning(true);
    setTerminalOutput('Compiling and running code...');
    //-------IMPORTANT: THIS NEEDS TO BE CHANGED WHEN BACKEND RUNS ON DIFFERENT PORT
    const backendUrl = 'http://localhost:6969/api/compile/c'; // 'https://picnicpickup.online/api/compile/c';

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Sending the code in JSON format
        body: JSON.stringify({ code: code }),
      });

      //Get the response body as JSON
      const result = await response.json();

      //Combine compile and execution output for display
      let output = '';

      if (!response.ok) {
        output = `Error (Status ${response.status}):\n${result.compileOutput || result.error || JSON.stringify(result)}\n\n${result.executionOutput || ''}`;
      } else {
        addGameStats.mutate({ isWin: true, acornsEarned: 25, gameType: 'code' }, {
          onSuccess: (data) => {
            console.log("Acorns added!")
          }
        });
        
        // Format successful output
        if (result.compileOutput && result.compileOutput !== 'Compiled successfully.') {
          // Show warnings if any, unless it's just the success message
          output += `Compiler Output (Warnings):\n${result.compileOutput}\n\n`;
        } else if (!result.executionOutput) {
          // If only success message and no execution output
          output += `Compiler Output:\n${result.compileOutput}\n\n`;
        }

        if (result.executionOutput) {
          output += `Execution Output:\n${result.executionOutput}`;
        }

        // Handle case where compilation succeeded but nothing was printed
        if (output.trim() === '') {
          output = 'Compilation successful, no output produced.';
        }
      }
      setTerminalOutput(output.trim());

    } catch (error) {
      // Handle network errors (server down, CORS issues if not configured right)
      console.error('Network or fetch error:', error);
      setTerminalOutput(
        `Network Error: Could not connect to the compilation server.\n${error.message}`
      );
    } finally {
      setIsRunning(false); // Reset loading state regardless of success/failure
    }
  };




  //This will handle time
  const [timeLeft, setTimeLeft] = useState(20);

  // Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) {
      //this is where you make something happen when time runs out
      console.log("Times UP!!")
      return;
    }


    const timerInterval = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000); //Run every 1 second

    return () => { clearInterval(timerInterval) };

  }, [timeLeft, terminalOutput]);


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  //    RENDERING
  return (
    //Main container
    <div className="flex h-screen font-sans text-white p-4">
      {/*Left panel, problem description*/}
      <div className="w-1/3 bg-green-800 p-6 rounded-l-lg rounded-r-lg mr-2 flex flex-col">
        {/* The problem name/type */}
        <h2 className="text-2x1 font-bold mb-4">{problem.name}</h2>

        {/* PDF Display */}
        {(showSolution && selectedPdfPathSol) || 0 >= timeLeft ? (
          <iframe src={selectedPdfPathSol} width="100%" height="100%" title="Solution PDF" style={{ border: 'none' }} />
        ) : selectedPdfPath ? (
          <iframe src={selectedPdfPath} width="100%" height="100%" title="Problem PDF" style={{ border: 'none' }} />
        ) : (
          <p className="text-gray-400 p-4">Loading Problem PDF...</p>
        )}
      </div>


      {/* Right panel, code editor and terminal */}
      <div className="w-2/3 flex flex-col ml-2">
        {/* Wrapper for the right panel */}
        <div className="flex-grow bg-orange-100 rounded-t-lg shadow-lg p-4 flex flex-col text-gray-800">
          {/*Top Section: Code Editor Area*/}
          <div className="mb-3 flex justify-between items-center">
            {/* Timer */}
            <div className={`text-xl font-semibold px-3 py-1 rounded shadow border border-gray-300 ${timeLeft <= 0 ? 'bg-red-500 text-white' : 'text-gray-700 bg-white'}`}>
              {timeLeft <= 0 ? 'TIMES UP!!' : `Time Left: ${formatTime(timeLeft)}`}
            </div>
            {/* Buttons */}
            <div className="flex space-x-3">
              {/*New Question Button */}
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-md shadow transition duration-200 ease-in-out transform hover:scale-105"
              >
                New Question
              </button>

              {/* Reset button */}
              <button
                onClick={handleResetCode}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-5 rounded-md shadow transition duration-200 ease-in-out transform hover:scale-105 "
              >
                Reset Code
              </button>
              {/*Run Code Button */}
              <button
                onClick={handleRunCode}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-md shadow transition duration-200 ease-in-out transform hover:scale-105"
              >
                Run Code
              </button>
              {/*Submit Code Button */}
              <button
                onClick={handleToggleSolutionClick}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-md shadow transition duration-200 ease-in-out transform hover:scale-105"
                disabled={!selectedPdfPathSol}
              >
                Submit Code
              </button>
            </div>
          </div>


          {/* Code Editor Simulation (uses textarea) */}
          <div className="flex-grow flex bg-white rounded-md border border-gray-300 overflow-hidden">
            {/* Line numbers */}
            <div className="bg-gray-100 p-2 text-right text-gray-500 select-none text-sm border-r border-gray-300">
              {code.split('\n').map((_, index) => (
                <div key={index}> {index + 1} </div>
              ))}
            </div>

            {/* Text area for code */}
            <textarea
              value={code}
              onChange={handleCodeChange}
              className="flex-grow p-2 font-mono text-sm resize-none focus:outline-none w-full h-full"
              spellCheck="false"
              wrap="off"
            />
          </div>
        </div>
        {/* Bottom Section: Terminal Output - Correctly positioned after Top Section */}
        <div className="h-1/3 bg-orange-900 rounded-b-lg shadow-lg p-4 mt-2 flex flex-col text-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-orange-200">Terminal Output: </h3>
          {/* Use the 'terminalOutput' state variable */}
          <div className="flex-grow bg-black bg-opacity-40 rounded-md p-3 font-mono text-sm overflow-auto whitespace-pre-wrap">
            {terminalOutput}
          </div>
        </div> {/* End of bottom section */}

      </div>
      {isModalOpen && (
        // Modal Content Box - Positioned Fixed in bottom-right
        <div className="fixed bottom-4 right-4 z-50 bg-white p-6 rounded-lg shadow-xl text-gray-800 max-w-sm border border-gray-300">
          <h3 className="text-xl font-semibold mb-4">Check Answer</h3>
          <p className="mb-6">After reviewing the solution, did you get the question right?</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => handleModalResponse(false)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow"
            >
              No
            </button>
            <button
              onClick={() => handleModalResponse(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow"
            >
              Yes
            </button>
          </div>
        </div>
      )}
      {/* --- END Modal Popup --- */}

    </div>





  )
}


export default Code;