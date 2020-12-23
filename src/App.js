import React, { Component, Fragment } from "react";
import { withSnackbar } from "notistack";
import * as serviceWorker from "./serviceWorkerRegistration";
import { Button } from "@material-ui/core";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newVersionAvailable: false,
      waitingWorker: {},
    };
  }

  onServiceWorkerUpdate = (registration) => {
    this.setState({
      waitingWorker: registration && registration.waiting,
      newVersionAvailable: true,
    });
  };

  updateServiceWorker = () => {
    const { waitingWorker } = this.state;
    waitingWorker && waitingWorker.postMessage({ type: "SKIP_WAITING" });
    this.setState({ newVersionAvailable: false });
    window.location.reload();
  };

  refreshAction = (key) => { //render the snackbar button
    return (
      <Fragment>
        <Button
          className="snackbar-button"
          size="small"
          onClick={this.updateServiceWorker}
        >
          {"refresh"}
        </Button>
      </Fragment>
    );
  };


  componentDidMount = () => {
    const { enqueueSnackbar } = this.props;
    const { newVersionAvailable } = this.state;
    if (process.env.NODE_ENV === 'production') {
      console.log('registering service worker');
      serviceWorker.register({ onUpdate: this.onServiceWorkerUpdate });
    }

    if (newVersionAvailable) //show snackbar with refresh button
      enqueueSnackbar("A new version was released", {
        persist: true,
        variant: "success",
        action: this.refreshAction(),
      });
  };

  render() {
    //render components
    return(
      <h1>Hello welcome to ReactJs Home!</h1>
    )
  }
}





export default withSnackbar(App); //uses the snackbar context

