import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ComboBox({ options, handleFilter }) {
    const [value, setValue] = React.useState('');
    const [inputValue, setInputValue] = React.useState(''); 

    React.useEffect(() => {

        console.log(inputValue);
      
        options.forEach(option => {
          if(option.label === inputValue){
            handleFilter(option.filter);
          }
        });
      
    }, [inputValue]);

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={options}
      renderInput={(params) => <TextField {...params} label="Sort" />}
      className='text-black bg-white text-sm'
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}    
    />
  );
}
