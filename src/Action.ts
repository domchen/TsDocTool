//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

/// <reference path="./lib/types.d.ts" />

import ts = require("typescript");
import FileUtil = require("./lib/FileUtil");
import TextFile = require("./TextFile");

class Action {

    public run(srcPath:string):void{
        var fileNames = FileUtil.search(srcPath, "ts");
        var options:ts.CompilerOptions = {target: ts.ScriptTarget.ES6, module: ts.ModuleKind.None};
        var host = ts.createCompilerHost(options);
        var program = ts.createProgram(fileNames, options, host);
        var errors = program.getDiagnostics();
        if (errors.length > 0) {
            errors.forEach(diagnostic => {
                var lineChar = diagnostic.file.getLineAndCharacterFromPosition(diagnostic.start);
                console.log(`${diagnostic.file.filename} (${lineChar.line},${lineChar.character}): ${diagnostic.messageText}`);
            });
            return;
        }

        program.getSourceFiles().forEach(sourceFile=> {
            var filename = sourceFile.filename;
            if (filename.indexOf(srcPath) != 0) {
                return;
            }
            var textFile = new TextFile(sourceFile.text);
            this.formatFile(sourceFile,textFile);
            var result = textFile.toString();
            if(result!=sourceFile.text){
                console.log(result);
                //FileUtil.save(sourceFile.filename,result);
            }
        });
    }

    protected formatFile(sourceFile:ts.SourceFile,textFile:TextFile):void{

    }
}

export  = Action;