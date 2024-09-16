import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { DateConverterEventCard } from '../DateConverter';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function CustomizedDialogs({ openSave, setOpenSave, setShowShare, event }) {
  const navigate = useNavigate();
  const currentUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentUrl.search);

  const handleClose = () => {
    setOpenSave(false);
    setShowShare(false);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openSave}
      >
        <div className='bg-[#1f2937] text-white px-1 sm:px-16'>

        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            backgroundColor: '#1f2937',
            '&:hover' : {
              backgroundColor: '#374151'
            }
            // color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography gutterBottom>
          <p className='text-[20px] min-[400px]:text-[22px] lg:text-[25px] font-bold text-orange-500 w-full text-center mt-3'> Sign in to save this event</p>
        </Typography>

        <DialogContent className='mt-6 p-2 sm:p-4 shadow-[#121821] shadow-lg bg-[#171f2a]'>

          <div className='flex flex-row justify-between gap-4 sm:gap-20 '>
            <div className='flex flex-col'>
              <h1 className='text-md sm:text-lg text-bold mb-2'> {event.title} </h1>
              <h3 className='text-[12px] text-blue-500'> {DateConverterEventCard(event.start)} </h3>
            </div>

            <div 
              // style={{
              //   background: `url(https://firebasestorage.googleapis.com/v0/b/ticketvibe.appspot.com/o/events%2Fimages%2Fkrishna-in-autumn-my-artwork-wallpaper-v0-kzr4f5h88wub1-min.png?alt=media&token=222994b9-78ca-4ebd-9184-f3964349fb4f) no-repeat center center/cover`
              // }}
              className='w-[125px] sm:w-[150px] lg:w-[200px] h-[75px] lg:h-[100px]'
            />

          </div>
          
        </DialogContent>

        <DialogActions className='h-20 mt-2 mb-2 sm:mb-6'>

          <div className='w-full h-fit flex flex-row items-center justify-center'>
            <Button 
              style={{
                textTransform: 'none',
                fontSize: '14.5px',
                padding: '0 25px',
                backgroundColor: '#C2410C',
              }}
              variant="contained"
              onClick={() => {
                searchParams.set('redirect_uri', `/event/${event._id}`);
                searchParams.set('action', 'save_event');
                window.location.href = `/auth/signin?${searchParams.toString()}${currentUrl.hash}`;
              }} 
              className='h-[42px]'
            >
              Continue
            </Button>  
          </div>

        </DialogActions>

        </div>

      </BootstrapDialog>
    </React.Fragment>
  );
}