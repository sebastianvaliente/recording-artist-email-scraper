import { Button, Snackbar } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Loader from "react-loader-spinner";
import { Component } from "react";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import DateRangePicker from "rsuite/lib/DateRangePicker";
import "rsuite/lib/styles/index.less";
const { before, afterToday, combine } = DateRangePicker;

const defaultState = {
  emails: [],
  showSnackbar: false,
  loadingEmails: false,
  selectedDates: [],
  emailScrapeInitiated: false,
  showDatePicker: true,
  emailsLoaded: false
};

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      ...defaultState
    };
  }

  clearState = () => {
    /* reset date picker */
    this.setState({ showDatePicker: false }, () => {
      this.setState({ ...defaultState });
    });
  };

  determineContext = () => {
    const { selectedDates, emailScrapeInitiated } = this.state;
    return {
      noDatesAndScrapeNotInitiated: selectedDates.length <= 0 && !emailScrapeInitiated,
      datesSelectedButScrapeNotInitiated:
        selectedDates.length > 0 && !emailScrapeInitiated
    };
  };

  scrapeEmails = async () => {
    const { selectedDates } = this.state;
    this.setState({ emailScrapeInitiated: true });
    try {
      const { emails } = (
        await axios.get("/api/getTweets", {
          headers: { dates: JSON.stringify(selectedDates) }
        })
      ).data;
      this.setState({ emails, emailsLoaded: true });
    } catch (e) {
      console.error("Error when fetching emails", e);
    }
  };

  snackbar = () => {
    /* snackbar notif that appears after copy to clipboard */
    const { showSnackbar } = this.state;
    return (
      <Snackbar
        open={showSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={6000}
        message="Emails copied to clipboard!"
        onClose={() => this.setState({ showSnackbar: false })}
      />
    );
  };

  datePicker = () => {
    const { showDatePicker } = this.state;
    if (!showDatePicker) return null;
    const ThirtyDaysBeforeToday = new Date().setDate(new Date().getDate() - 30);
    return (
      <DateRangePicker
        style={{ padding: "40px 30%", display: "block", paddingTop: "10px" }}
        onOk={selectedDates => {
          this.setState({ selectedDates });
        }}
        ranges={[]}
        showOneCalendar
        disabledDate={combine(afterToday(), before(ThirtyDaysBeforeToday))}
      />
    );
  };

  copyToClipboardButton = () => {
    const { emails } = this.state;
    if (emails.length <= 0) return null;

    return (
      <>
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
          {emails.length} emails scraped!
        </h3>
        <CopyToClipboard
          text={emails.join(",")}
          onCopy={() => this.setState({ showSnackbar: true })}
        >
          <Button
            variant="contained"
            color="primary"
            style={{ display: "block", margin: "0 auto", marginBottom: "1em" }}
          >
            Copy Emails To clipboard
          </Button>
        </CopyToClipboard>
      </>
    );
  };

  loader = () => {
    const { LOADING } = Home.constants;
    return (
      <>
        <h4 style={{ textAlign: "center", marginBottom: "25px" }}>{LOADING}</h4>
        <div style={{ display: "flex" }}>
          <Loader
            style={{ display: "block", margin: "0 auto" }}
            type="Grid"
            color="#3f51b5"
            height={100}
            width={100}
          />
        </div>
      </>
    );
  };

  actionButtonController = () => {
    const { emailScrapeInitiated, emails } = this.state;
    const { datesSelectedButScrapeNotInitiated } = this.determineContext();
    const { SCRAPE_BTN_TEXT, RESCRAPE_BTN_TEXT } = Home.constants;

    return (
      <>
        {datesSelectedButScrapeNotInitiated && (
          <Button
            onClick={this.scrapeEmails}
            variant="contained"
            color="primary"
            style={{ display: "block", margin: "0 auto" }}
          >
            {SCRAPE_BTN_TEXT}
          </Button>
        )}

        {emailScrapeInitiated && emails.length > 0 && (
          <Button
            onClick={this.clearState}
            variant="contained"
            color="primary"
            style={{ display: "block", margin: "0 auto" }}
          >
            {RESCRAPE_BTN_TEXT}
          </Button>
        )}
      </>
    );
  };

  render() {
    const { emailScrapeInitiated, emailsLoaded } = this.state;
    const { HEADER } = Home.constants;
    const { noDatesAndScrapeNotInitiated } = this.determineContext();
    const { SELECT_RANGE } = Home.constants;

    return (
      <div style={{ margin: "10em 0" }}>
        <Container>
          <div>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>{HEADER}</h1>
          </div>

          {noDatesAndScrapeNotInitiated && (
            <h4 style={{ textAlign: "center" }}>{SELECT_RANGE}</h4>
          )}

          {!emailScrapeInitiated && <this.datePicker />}

          {emailScrapeInitiated && !emailsLoaded && <this.loader />}

          <this.copyToClipboardButton />

          <this.actionButtonController />

          <this.snackbar />
        </Container>
      </div>
    );
  }
}

Home.constants = {
  HEADER: "ARTIST EMAIL SCRAPER FOR TWITTER",
  SCRAPE_BTN_TEXT: "SCRAPE EMAILS",
  RESCRAPE_BTN_TEXT: "SCRAPE AGAIN",
  SELECT_RANGE: "Select a range of dates to collect emails from.",
  LOADING:
    "Fetching tweets where artists asks for beats and extracting emails from them..."
};
