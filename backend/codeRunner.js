const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

app.post('compile/c', async (req, res) =>{
    const { code } = req.body;

    //if(!code) <-ERROR HANDLE

    let tempDirPath = null;
    let compileOutput = '';
    let executionOutput = '';
    let statusCode = 200;

    try{
        const prefix = path.join(os.tmpdir(),'usercode-');
        tempDirPath = await fs.mkdtemp(prefix);
        console.log(`Created temporary directory: ${tempDirPath}`);

        const cFilePath = path.join(tempDirPath, 'source.c');
        const executeablePath = path.join(tempDirPath, 'program');

        await fs.writeFile(cFilePath,code);

        const compileCommand = `gcc "${cFilePath}" -o "${executeablePath}" -lm`;

        await new Promise((resolve, reject) => {
            exec(compileCommand, {timeout: 10000}, (error,stdout,stderr) =>{
                if (error){
                    console.error(`Compilation Error: ${error.message}`);
                    compileOutput = stderr || error.message;
                    statusCode = 400;
                    reject (new Error('Compilation Failed'));
                    return;
                }
                compileOutput = stderr || 'Compiled Succesfully';
                resolve();
            });
        });
    }
    catch (err){
        console.error('Processing error:',err);
        if (statusCode === 200) {statusCode = 500; }
        if (!compileOutput && !executionOutput){
            compileOutput = err.message || 'An unexpected server error occured.';
        } else if (err.message !== 'Compilation Failed'){
            executionOutput = executionOutput ? `${executionOutput}\nServer Error: ${err.message}` : `Server Error: ${err.message}`;
        }
    }

})