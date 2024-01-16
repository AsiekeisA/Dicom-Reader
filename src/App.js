import Parser from './Parser';
import './App.css';
import { useEffect, useState } from 'react';
import ImageCanvas from './ImageCanvas';
import Images from './Images';
// const fs = window.require('fs')
// const path = window.require('path')
function App() {

  const [picture, setPicture] = useState([]);
  const [file, setFile] = useState('');
  const [parameters, setParameters] = useState({
    rows: 0,
    cols: 0,
    pixelSpacingX: 0,
    pixelSpacingY: 0,
    pixelSpacingZ: 0,
    pixMin: 0,
    pixMax: 0,
    windowCenter: 0,
    windowWidth: 0,
    rescaleIntercept: 0,
    rescaleSlope: 0
});

  // useEffect(() => {
  //   if (file !== '')
  //     read(file)
  // },[file])

  const handleFolderChange = (e) => {
    // const dirHandle = await window.showDirectoryPicker();
    // // const fileNames = [];
    // for await (const fileHandle of dirHandle.values()) {
    //   const file = await fileHandle.getFile();
    //   // fileNames.push(file.name);
    //   console.log(file)
    const path = e.target.files[0]

    }
  

  function reader(e){
    const reader = new FileReader();
    const file = e.target.files[0]
    // console.log(file)
    reader.onload = () => {
      console.log("To cos"+ reader.result);
    };
    reader.readAsBinaryString(file);
    //       const binaryString = reader.readAsBinaryString(file);
    //   console.log(binaryString)

  }

  return (
    <div className="App">
      <header className="App-header">
        <Parser
          picture={picture}
          setPicture={setPicture}
          setParameters={setParameters}
        />
        <Images
          picture={picture}
          parameters={parameters}
        />
        {/* <ImageCanvas
          picture={picture}
          parameters={parameters}
        /> */}
      </header>
    </div>
  );
}

export default App;
