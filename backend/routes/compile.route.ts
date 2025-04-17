// src/routes/compile.route.ts

import express, { Request, Response } from 'express'; // Import Request, Response types
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import os from 'os';

const router = express.Router();

// Define the route on the router instance
router.post('/c', async (req: Request, res: Response) : Promise<void> => { // Add types for req, res
    const { code } = req.body;

    if (!code) {
        res.status(400).json({ error: 'No code provided.' });
        return;
    }

    let tempDirPath: string | null = null;
    let compileOutput = '';
    let executionOutput = '';
    let statusCode = 200;

    try {
        const prefix = path.join(os.tmpdir(), 'usercode-');
        tempDirPath = await fs.mkdtemp(prefix);
        console.log(`Created temporary directory: ${tempDirPath}`);

        const cFilePath = path.join(tempDirPath, 'source.c');
        const executablePath = path.join(tempDirPath, 'program');

        await fs.writeFile(cFilePath, code);

        const compileCommand = `gcc "${cFilePath}" -o "${executablePath}" -lm`;

        await new Promise<void>((resolve, reject) => { // Explicit Promise<void>
            exec(compileCommand, { timeout: 10000 }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Compilation Error: ${error.message}`);
                    compileOutput = stderr || error.message;
                    statusCode = 400;
                    reject(new Error('Compilation Failed'));
                    return;
                }
                compileOutput = stderr || 'Compiled successfully.';
                resolve();
            });
        });

        // --- Execution Logic ---
        if (statusCode === 200) {
            const executeCommand = `"${executablePath}"`;
            await new Promise<void>((resolve, reject) => { // Explicit Promise<void>
                exec(executeCommand, { timeout: 5000 }, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Execution Error: ${error.message}`);
                        executionOutput = `Runtime Error:\n${stdout}\n${stderr || error.message}`;
                    } else {
                        executionOutput = stdout || 'Execution finished.';
                        if (stderr) {
                            executionOutput += `\nStderr during execution:\n${stderr}`;
                        }
                    }
                    resolve(); // Resolve even if execution had errors, so we can send response
                });
            });
        }
        // --- End Execution Logic ---

    } catch (err: any) { // Explicit :any for caught error
        console.error('Processing error:', err);
        if (statusCode === 200) { statusCode = 500; } // Avoid overwriting 400 from compile error
        if (!compileOutput && !executionOutput) { // Ensure we have some error message
             compileOutput = err.message || 'An unexpected server error occurred.';
         } else if (err.message !== 'Compilation Failed') { // Append if it's a new error
             executionOutput = executionOutput ? `${executionOutput}\nServer Error: ${err.message}` : `Server Error: ${err.message}`;
         }
    } finally {
        // --- Cleanup Logic ---
        if (tempDirPath) {
            try {
                await fs.rm(tempDirPath, { recursive: true, force: true });
                console.log(`Deleted temporary directory: ${tempDirPath}`);
            } catch (cleanupErr: any) { // Explicit :any for caught error
                console.error(`Failed to delete directory ${tempDirPath}: ${cleanupErr.message}`);
            }
        }
        // --- End Cleanup Logic ---
    }

    // --- Send Response ---
    // This part MUST be outside the try...catch...finally block
    // so it always runs after attempting the operation and cleanup.
    console.log(`Sending response with status ${statusCode}`);
    res.status(statusCode).json({
        compileOutput: compileOutput,
        executionOutput: executionOutput
    });
    // --- End Send Response ---
});


export default router; // Export the router