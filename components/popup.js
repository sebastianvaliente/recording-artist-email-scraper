import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

export default function HowItWorksPopup() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        style={{ margin: "0 auto", display: "block", marginBottom: "2em" }}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        HOW THIS WORKS
      </Button>

      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
        <DialogTitle>How it works.</DialogTitle>

        <DialogContent>
          <DialogContentText>
            In short, we run a search for tweets with "send beats to" as the query. Then,
            all the emails are extracted from those tweets and returned to you!
          </DialogContentText>
        </DialogContent>

        <DialogTitle>How to use.</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Simply select a range of dates, and click "Scrape Emails". When it's done,
            you'll have the option to copy all the retrieved emails to clipboard.
            <br />
            <br />
            A couple things to note: The Twitter API only allows you to retrieve a certain
            amount of tweets at a time. For that reason, you can only select a date range
            as far as 30 days from today.
            <br />
            <br />
            You should keep your own records of the emails you retrieve so you can filter
            the duplicates (assuming you use this more than once.) After you copy the
            emails, you can use "Paste Special" in Google Sheets and it'll paste each
            email into a cell.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Got it.
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
