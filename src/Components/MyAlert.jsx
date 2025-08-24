
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function MyAlert({open,text,color}){
  return (
    <div>
     
      <Snackbar open={open} autoHideDuration={6000} >
        <Alert
         
          severity={color}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {text}
        </Alert>
      </Snackbar>
    </div>
  );
}