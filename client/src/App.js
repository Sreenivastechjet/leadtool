import React from 'react'
import Main from './components/Main';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import DataProvider from './GlobalContext';


function App() {
  return (
    <DataProvider>
    <Main/>
  </DataProvider>
  );
}


export default App;
